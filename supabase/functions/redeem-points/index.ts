import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Create admin client for bypassing RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create user client to verify auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { pointsToRedeem } = await req.json();

    if (!pointsToRedeem || typeof pointsToRedeem !== "number" || pointsToRedeem <= 0) {
      return new Response(JSON.stringify({ error: "Invalid points amount" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch points config
    const { data: configData, error: configError } = await supabaseAdmin
      .from("points_config")
      .select("key, value");

    if (configError) throw configError;

    const config: Record<string, any> = {};
    configData?.forEach((item: { key: string; value: any }) => {
      config[item.key] = item.value;
    });

    const pointsPerCent = config.exchange_rate?.points_per_cent || 10;
    const minThreshold = config.min_redeem_threshold?.points || 100;

    if (pointsToRedeem < minThreshold) {
      return new Response(JSON.stringify({ error: `Minimum ${minThreshold} points required to redeem` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch user's points account
    const { data: pointsAccount, error: accountError } = await supabaseAdmin
      .from("points_accounts")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (accountError || !pointsAccount) {
      return new Response(JSON.stringify({ error: "Points account not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (pointsAccount.balance < pointsToRedeem) {
      return new Response(JSON.stringify({ error: "Insufficient points balance" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Calculate trial balance to receive (in dollars)
    const trialBalanceReceived = (pointsToRedeem / pointsPerCent) / 100;
    const newBalance = pointsAccount.balance - pointsToRedeem;

    // Update points account
    const { error: updateError } = await supabaseAdmin
      .from("points_accounts")
      .update({
        balance: newBalance,
        lifetime_spent: pointsAccount.lifetime_spent + pointsToRedeem,
      })
      .eq("user_id", user.id);

    if (updateError) throw updateError;

    // Add ledger entry (using admin client to bypass RLS)
    const { error: ledgerError } = await supabaseAdmin
      .from("points_ledger")
      .insert({
        user_id: user.id,
        amount: -pointsToRedeem,
        balance_after: newBalance,
        type: "spend",
        source: "redeem",
        description: `Redeemed ${pointsToRedeem} points for $${trialBalanceReceived.toFixed(2)} trial bonus`,
      });

    if (ledgerError) throw ledgerError;

    // Update profile trial balance
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("trial_balance")
      .eq("user_id", user.id)
      .single();

    const currentTrialBalance = (profile?.trial_balance as number) || 0;

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ trial_balance: currentTrialBalance + trialBalanceReceived })
      .eq("user_id", user.id);

    if (profileError) throw profileError;

    // Record redemption
    await supabaseAdmin
      .from("points_redemptions")
      .insert({
        user_id: user.id,
        points_spent: pointsToRedeem,
        trial_balance_received: trialBalanceReceived,
        exchange_rate: { points_per_cent: pointsPerCent },
        status: "completed",
      });

    // Add transaction record for trial balance credit
    await supabaseAdmin
      .from("transactions")
      .insert({
        user_id: user.id,
        type: "platform_credit",
        amount: trialBalanceReceived,
        status: "completed",
        description: `Redeemed ${pointsToRedeem} points for trial bonus`,
      });

    return new Response(
      JSON.stringify({
        success: true,
        pointsSpent: pointsToRedeem,
        trialBalanceReceived,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error redeeming points:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
