import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const errMsg = (e: unknown) => (e instanceof Error ? e.message : 'Internal server error')

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

type CloseReason = 'USER_CLOSE' | 'MAX_HOLDING' | 'TAIL_CUTOFF' | 'LIQUIDATION' | 'EVENT_RESOLVED'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'Missing authorization header' }, 401)

    const body = (await req.json().catch(() => null)) as
      | { airdropPositionId?: string; reason?: CloseReason }
      | null
    if (!body?.airdropPositionId) {
      return json({ error: 'airdropPositionId is required' }, 400)
    }
    const reason: CloseReason = body.reason ?? 'USER_CLOSE'

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const admin = createClient(supabaseUrl, serviceKey)

    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) return json({ error: 'Unauthorized' }, 401)

    // 1) Load the airdrop position (must belong to the user and be active)
    const { data: pos, error: pErr } = await admin
      .from('airdrop_positions')
      .select('*')
      .eq('id', body.airdropPositionId)
      .eq('user_id', user.id)
      .maybeSingle()
    if (pErr) return json({ error: pErr.message }, 500)
    if (!pos) return json({ error: 'Position not found' }, 404)
    if (pos.status !== 'activated') {
      return json({ error: `Position is not active (status=${pos.status})` }, 409)
    }

    // 2) Look up the current mark price (best-effort; fall back to entry price)
    let markPrice = Number(pos.counter_price)
    const { data: voucher } = await admin
      .from('position_vouchers')
      .select('redeemed_option_id, redeemed_side, face_value, redeemable_cap_pct')
      .eq('redeemed_airdrop_position_id', pos.id)
      .maybeSingle()

    if (voucher?.redeemed_option_id) {
      const { data: opt } = await admin
        .from('event_options')
        .select('price')
        .eq('id', voucher.redeemed_option_id)
        .maybeSingle()
      if (opt?.price != null) markPrice = Number(opt.price)
    }

    // 3) Compute PnL: shares = face_value, entry = counter_price (counter side perspective)
    //    For long side: pnl = (mark - entry) * shares
    //    For short side: pnl = (entry - mark) * shares
    const entry = Number(pos.counter_price)
    const shares = Number(pos.airdrop_value) // face value = share count (spec)
    const side = String(pos.counter_side)
    const rawPnl = side === 'short' ? (entry - markPrice) * shares : (markPrice - entry) * shares

    // 4) Cap profit at redeemable_cap; losses are floored at 0 credit (voucher funds are sandboxed)
    const cap = pos.redeemable_cap != null ? Number(pos.redeemable_cap) : Number(pos.airdrop_value) * 0.5
    const creditedPnl = Math.max(0, Math.min(rawPnl, cap))

    const nowIso = new Date().toISOString()

    // 5) Mark position as settled
    const { error: uErr } = await admin
      .from('airdrop_positions')
      .update({
        status: 'settled',
        settled_pnl: creditedPnl,
        settled_at: nowIso,
        close_reason: reason,
        exit_price: markPrice,
      })
      .eq('id', pos.id)
      .eq('status', 'activated') // optimistic lock
    if (uErr) return json({ error: uErr.message }, 500)

    // 6) Credit the user's trial_balance with the positive PnL (if any)
    if (creditedPnl > 0) {
      const { data: profile } = await admin
        .from('profiles')
        .select('trial_balance')
        .eq('user_id', user.id)
        .maybeSingle()

      const newTrial = Number(profile?.trial_balance ?? 0) + creditedPnl
      await admin
        .from('profiles')
        .update({ trial_balance: newTrial })
        .eq('user_id', user.id)
    }

    return json({
      success: true,
      airdropPositionId: pos.id,
      exitPrice: markPrice,
      rawPnl,
      creditedPnl,
      cap,
      reason,
    })
  } catch (e) {
    console.error('close-trial-position error', e)
    return json({ error: errMsg(e) }, 500)
  }
})
