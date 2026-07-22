// sim-settle-spot — DEMO-STATE settlement engine for Pro spot US-stock events.
//
// Scope: scans events where product_lines contains 'spot' AND
// expected_settlement_time < now() AND lifecycle_status != 'SETTLED'.
// Per event, decides winner and:
//   1) event_options: winner final_price=1 is_winner=true; loser final_price=0.
//   2) All open spot positions on the event: credit spot_balance $1/share for
//      the winning side, $0 for losing side; close position row.
//   3) Insert transactions rows (trade_profit / trade_loss, account='spot').
//   4) Cancel all Pending spot orders for the event and refund notional to
//      spot_balance (+ transaction row).
//   5) Mark event lifecycle_status='SETTLED', is_resolved=true (hard contract),
//      settled_at, winning_option_id, settlement_description.
//
// Winner rule (DEMO-STATE): YES mark price ≥ 0.5 at settlement time → YES wins,
// else NO wins. Production: settlement service compares databento official
// close vs base_price per exchange calendar.
//
// Idempotent: SETTLED events are skipped. Per-event failures don't block others.
// Callable manually (POST, empty body) or by sim-daily-seed cron.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface EventRow {
  id: string;
  name: string;
  side_labels: { yes?: string; no?: string } | null;
  lifecycle_status: string | null;
  expected_settlement_time: string | null;
  product_lines: string[];
}

interface OptionRow {
  id: string;
  event_id: string;
  label: string;
  price: number;
}

interface PositionRow {
  id: string;
  user_id: string;
  event_name: string;
  option_id: string | null;
  option_label: string;
  size: number;
  margin: number;
}

interface TradeRow {
  id: string;
  user_id: string;
  event_name: string;
  amount: number;
  side: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const now = new Date();
  const summary: {
    scanned: number;
    settled: number;
    skipped: number;
    errors: Array<{ eventId: string; error: string }>;
  } = { scanned: 0, settled: 0, skipped: 0, errors: [] };

  try {
    // 1) Find eligible spot events.
    const { data: events, error: evErr } = await supabase
      .from("events")
      .select("id, name, side_labels, lifecycle_status, expected_settlement_time, product_lines")
      .contains("product_lines", ["spot"])
      .lt("expected_settlement_time", now.toISOString())
      .neq("lifecycle_status", "SETTLED");
    if (evErr) throw evErr;

    summary.scanned = events?.length ?? 0;

    for (const ev of (events as EventRow[]) ?? []) {
      try {
        // Options for the event
        const { data: opts, error: optErr } = await supabase
          .from("event_options")
          .select("id, event_id, label, price")
          .eq("event_id", ev.id);
        if (optErr) throw optErr;
        if (!opts || opts.length !== 2) {
          summary.skipped++;
          continue;
        }

        const yesLabel = ev.side_labels?.yes ?? "Yes";
        const noLabel = ev.side_labels?.no ?? "No";
        const yesOpt = (opts as OptionRow[]).find((o) => o.label === yesLabel) ?? opts[0];
        const noOpt = (opts as OptionRow[]).find((o) => o.label === noLabel) ??
          (opts as OptionRow[]).find((o) => o.id !== yesOpt.id)!;

        // DEMO-STATE winner rule: YES mark ≥ 0.5 → YES wins.
        const yesWins = Number(yesOpt.price) >= 0.5;
        const winner = yesWins ? yesOpt : noOpt;
        const loser = yesWins ? noOpt : yesOpt;

        // 2) Set option final prices / winners.
        await supabase
          .from("event_options")
          .update({ final_price: 1, is_winner: true })
          .eq("id", winner.id);
        await supabase
          .from("event_options")
          .update({ final_price: 0, is_winner: false })
          .eq("id", loser.id);

        // 3) Close spot positions for this event.
        const { data: positions, error: posErr } = await supabase
          .from("positions")
          .select("id, user_id, event_name, option_id, option_label, size, margin")
          .eq("product_line", "spot")
          .eq("status", "Open")
          .in("option_id", [winner.id, loser.id]);
        if (posErr) throw posErr;

        for (const p of (positions as PositionRow[]) ?? []) {
          const isWin = p.option_id === winner.id;
          const proceeds = isWin ? Number(p.size) : 0;
          const margin = Number(p.margin);
          const profit = proceeds - margin;

          if (proceeds > 0) {
            const { data: prof } = await supabase
              .from("profiles")
              .select("spot_balance")
              .eq("user_id", p.user_id)
              .maybeSingle();
            const newSpot = Number(prof?.spot_balance ?? 0) + proceeds;
            await supabase
              .from("profiles")
              .update({ spot_balance: newSpot })
              .eq("user_id", p.user_id);
          }

          await supabase
            .from("positions")
            .update({
              status: "Closed",
              closed_at: now.toISOString(),
              mark_price: isWin ? 1 : 0,
              pnl: profit,
            })
            .eq("id", p.id);

          await supabase.from("transactions").insert({
            user_id: p.user_id,
            type: profit >= 0 ? "trade_profit" : "trade_loss",
            amount: Math.abs(profit),
            account: "spot",
            description: `Settled: ${p.event_name} · ${p.option_label} · ${isWin ? "Won" : "Lost"}`,
            status: "completed",
          });
        }

        // 4) Cancel & refund Pending spot orders on this event.
        const { data: pendings, error: pendErr } = await supabase
          .from("trades")
          .select("id, user_id, event_name, amount, side")
          .eq("product_line", "spot")
          .eq("status", "Pending")
          .eq("event_name", ev.name);
        if (pendErr) throw pendErr;

        for (const t of (pendings as TradeRow[]) ?? []) {
          // Only Buy orders had funds pre-deducted; Sell orders don't hold cash.
          const refund = t.side === "buy" ? Number(t.amount) : 0;
          if (refund > 0) {
            const { data: prof } = await supabase
              .from("profiles")
              .select("spot_balance")
              .eq("user_id", t.user_id)
              .maybeSingle();
            const newSpot = Number(prof?.spot_balance ?? 0) + refund;
            await supabase
              .from("profiles")
              .update({ spot_balance: newSpot })
              .eq("user_id", t.user_id);

            await supabase.from("transactions").insert({
              user_id: t.user_id,
              type: "trade_profit",
              amount: refund,
              account: "spot",
              description: `Refund cancelled order · ${t.event_name} (market settled)`,
              status: "completed",
            });
          }
          await supabase
            .from("trades")
            .update({ status: "Cancelled", closed_at: now.toISOString() })
            .eq("id", t.id);
        }

        // 5) Mark event SETTLED + is_resolved (hard contract).
        await supabase
          .from("events")
          .update({
            lifecycle_status: "SETTLED",
            is_resolved: true,
            settled_at: now.toISOString(),
            winning_option_id: winner.id,
            settlement_description: `${winner.label} wins (mark price ${Number(yesOpt.price).toFixed(2)} at close)`,
          })
          .eq("id", ev.id);

        summary.settled++;
      } catch (e) {
        console.error("settle event failed", ev.id, e);
        summary.errors.push({ eventId: ev.id, error: String(e) });
      }
    }

    return new Response(JSON.stringify({ success: true, ...summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("sim-settle-spot fatal", e);
    return new Response(JSON.stringify({ error: String(e), ...summary }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
