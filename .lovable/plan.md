## Goal

给 voucher 系统加"每日限量发放"机制 + granted 卡的稀缺度视觉，制造紧迫感。Claimed/redeemed/settled/earnings 完全不动。

## 1. Database — 每日发放池

新表 `voucher_daily_pools`（一行 = face_value × date）：
- `face_value numeric` · `pool_date date` · `total_quota int` · `claimed_count int default 0`
- 唯一键 `(face_value, pool_date)`
- RLS：`authenticated` 只读今日所有行；写入只走 service_role

种子配额（每日 UTC 00:00 由 cron 重置 / 补行）：
- $10 → 1000 张
- $25 → 500 张
- $50 → 100 张

改 `handle_new_user`：循环 [10, 25, 50]，每个 face value 调一个新 security definer fn `consume_daily_voucher_pool(face_value)`，原子 `UPDATE ... SET claimed_count = claimed_count + 1 WHERE claimed_count < total_quota RETURNING ...`。返回成功才插 `position_vouchers`，失败就跳过（**当天没发够 3 张就算了**，符合你的确认）。

新 RPC `get_voucher_pool_today()` 返回所有 face_value 的 `{faceValue, remaining, total, resetsAt}`，public 可读。

新 edge function `reset-voucher-pools`（cron 每日 UTC 00:00 触发）：upsert 当天 3 行配额。

## 2. Frontend

**新 hook** `src/hooks/useVoucherDailyPool.ts`：调 `get_voucher_pool_today` + Supabase Realtime 订阅 `voucher_daily_pools` 表，按 face_value 索引。`resetsAt = next UTC midnight`，每秒计时。

**`VoucherCard.tsx` granted 分支**重写（claimed 分支零改动）：
- Top zone：保留 face value + expiry chip，下方加稀缺行
  - 文案：`{remaining} / {total} left today` + 右侧 `Resets in {Xh Ym}`
  - 进度条 `h-1 rounded-full`：
    - `>50%` → `bg-muted-foreground/60`，文案 `text-muted-foreground`
    - `25%–50%` → `bg-foreground`，文案 `text-foreground`
    - `<25%` → `bg-trading-red` + `animate-pulse`，文案 `text-trading-red`
    - `=0` → 进度条换成单行 `Lock icon + "Sold out today · resets in {Xh Ym}"`，CTA disabled 灰
- Bottom zone（方案 B frosted reveal）：
  - 两列 `Voucher code` / `Max profit`，值套 `blur-sm select-none opacity-60`
  - 居中浮一颗 primary pill：`Gift icon + Tap to claim`，`shadow-[0_0_24px_hsl(var(--primary)/0.4)]`
  - 售罄时 pill 变 disabled `bg-muted text-muted-foreground` + `Sold out`

**`VouchersSection.tsx`**：`grantedFresh` preset 拆成 5 个：
- `grantedComfortable` (653/1000)
- `grantedWarning` (340/1000)
- `grantedUrgent` (87/1000, red pulse)
- `grantedSoldOut` (0/1000)
- `grantedClaiming` 保留

Hook 在 style-guide 里用 mock data 注入。

## 3. Copy & Memory

- `docs/copy-dictionary.md`：新增 `Daily quota / Left today / Resets in / Sold out today`
- `mem://features/voucher-daily-pool` 新建：池子机制、配额数、阈值色阶、reset 时间
- `mem://design/voucher-granted-frosted-reveal` 新建：方案 B + 稀缺度的 granted 卡布局规则
- `DESIGN.md` Components 段补 voucher granted spec
- `mem://index.md` Core 加 1 行引用

## Out of scope

- Claimed/redeemed/settled/expired 卡片
- VoucherEarningsCard / 4 档阶梯
- Banner 不变
- 池子配额数后续可改，本轮先硬编码种子值

## Files

- `supabase/migrations/<new>.sql` — 表 + grants + RLS + `consume_daily_voucher_pool` + `get_voucher_pool_today` + 改 `handle_new_user`
- `supabase/functions/reset-voucher-pools/index.ts` + cron 配置
- `src/hooks/useVoucherDailyPool.ts` (new)
- `src/components/vouchers/VoucherCard.tsx` (只改 granted 分支)
- `src/pages/StyleGuide/sections/VouchersSection.tsx` (扩 preset)
- `docs/copy-dictionary.md`
- `DESIGN.md`
- `mem://features/voucher-daily-pool` · `mem://design/voucher-granted-frosted-reveal` · `mem://index.md`
