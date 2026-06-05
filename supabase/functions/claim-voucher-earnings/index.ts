import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

// Keep in sync with src/lib/voucherTiers.ts
interface Tier { id: 1 | 2 | 3 | 4; volume: number; maxClaim: number | null }
const TIERS: Tier[] = [
  { id: 1, volume: 5_000, maxClaim: 25 },
  { id: 2, volume: 15_000, maxClaim: 100 },
  { id: 3, volume: 50_000, maxClaim: 500 },
  { id: 4, volume: 150_000, maxClaim: null },
]
function tierFor(volume: number): Tier | null {
  let current: Tier | null = null
  for (const t of TIERS) if (volume >= t.volume) current = t
  return current
}

const errMsg = (e: unknown) => (e instanceof Error ? e.message : 'Internal server error')
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'Missing authorization header' }, 401)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const admin = createClient(supabaseUrl, serviceKey)

    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) return json({ error: 'Unauthorized' }, 401)

    const { data: pool } = await admin
      .from('voucher_earnings')
      .select('id, pending_amount, lifetime_credited')
      .eq('user_id', user.id)
      .maybeSingle()

    const pending = Number(pool?.pending_amount ?? 0)
    const lifetimeCredited = Number(pool?.lifetime_credited ?? 0)
    if (!pool || pending <= 0) {
      return json({ error: 'No voucher earnings to claim', pending: 0 }, 400)
    }

    const { data: trades, error: tErr } = await admin
      .from('trades')
      .select('amount')
      .eq('user_id', user.id)
      .eq('status', 'Filled')
    if (tErr) return json({ error: tErr.message }, 500)

    const volume = (trades ?? []).reduce(
      (sum, row) => sum + Number((row as { amount: number | string }).amount ?? 0),
      0,
    )

    const tier = tierFor(volume)
    if (!tier) {
      return json(
        { error: 'Trading volume below tier 1', pending, volume, requiredForT1: TIERS[0].volume },
        403,
      )
    }

    const cap = tier.maxClaim == null ? Number.POSITIVE_INFINITY : tier.maxClaim
    const headroom = Math.max(0, cap - lifetimeCredited)
    const claimAmount = Math.min(pending, headroom)
    if (claimAmount <= 0) {
      return json(
        {
          error: 'Current tier cap already claimed — reach the next tier to claim more',
          pending,
          volume,
          tier: tier.id,
          tierCap: tier.maxClaim,
          lifetimeCredited,
        },
        403,
      )
    }

    const { data: profile } = await admin
      .from('profiles')
      .select('balance')
      .eq('user_id', user.id)
      .maybeSingle()

    const newBalance = Number(profile?.balance ?? 0) + claimAmount

    const { error: upErr } = await admin
      .from('profiles')
      .update({ balance: newBalance })
      .eq('user_id', user.id)
    if (upErr) return json({ error: upErr.message }, 500)

    const nowIso = new Date().toISOString()
    await admin
      .from('voucher_earnings')
      .update({
        pending_amount: Number((pending - claimAmount).toFixed(2)),
        lifetime_credited: Number((lifetimeCredited + claimAmount).toFixed(2)),
        last_settled_at: nowIso,
      })
      .eq('id', pool.id)

    await admin.from('voucher_earnings_ledger').insert({
      user_id: user.id,
      type: 'claim',
      amount: -claimAmount,
      description: `Claimed voucher earnings (tier ${tier.id})`,
    })

    return json({
      success: true,
      claimed: claimAmount,
      newBalance,
      volume,
      tier: tier.id,
      tierCap: tier.maxClaim,
    })
  } catch (e) {
    console.error('claim-voucher-earnings error', e)
    return json({ error: errMsg(e) }, 500)
  }
})
