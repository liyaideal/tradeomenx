import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const VOLUME_REQUIREMENT = 50_000

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

    // 1) Pending pool
    const { data: pool } = await admin
      .from('voucher_earnings')
      .select('id, pending_amount, lifetime_credited')
      .eq('user_id', user.id)
      .maybeSingle()

    const pending = Number(pool?.pending_amount ?? 0)
    if (!pool || pending <= 0) {
      return json({ error: 'No voucher earnings to claim', pending: 0 }, 400)
    }

    // 2) Trading volume = sum of all filled trades.amount for the user
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

    if (volume < VOLUME_REQUIREMENT) {
      return json(
        {
          error: 'Trading volume requirement not met',
          pending,
          volume,
          required: VOLUME_REQUIREMENT,
        },
        403,
      )
    }

    // 3) Credit available balance
    const { data: profile } = await admin
      .from('profiles')
      .select('balance')
      .eq('user_id', user.id)
      .maybeSingle()

    const newBalance = Number(profile?.balance ?? 0) + pending

    const { error: upErr } = await admin
      .from('profiles')
      .update({ balance: newBalance })
      .eq('user_id', user.id)
    if (upErr) return json({ error: upErr.message }, 500)

    // 4) Reset pool + ledger entry
    const nowIso = new Date().toISOString()
    await admin
      .from('voucher_earnings')
      .update({
        pending_amount: 0,
        lifetime_credited: Number(pool.lifetime_credited ?? 0) + pending,
        last_settled_at: nowIso,
      })
      .eq('id', pool.id)

    await admin.from('voucher_earnings_ledger').insert({
      user_id: user.id,
      type: 'claim',
      amount: -pending,
      description: 'Claimed voucher earnings to available balance',
    })

    return json({ success: true, claimed: pending, newBalance, volume })
  } catch (e) {
    console.error('claim-voucher-earnings error', e)
    return json({ error: errMsg(e) }, 500)
  }
})
