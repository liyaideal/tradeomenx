# /style-guide Vouchers — 补齐所有缺失状态

只动 `src/pages/StyleGuide/sections/VouchersSection.tsx`，不动生产组件。所有 demo 必须复用真实组件（`VoucherBanner` / `VoucherCard` / `VoucherEarningsCard` / `CloseVoucherContent` / `ExpiredSection` 同款 row），文案与生产一字不差。

## 1. VoucherBanner（subsection 1）— 重写

当前 demo 的文案 `"X unredeemed voucher(s)"` / `"Expires in <24h — redeem now or lose it."` 在生产 `VoucherBanner.tsx` 里不存在，需要对齐。

新 PresetRail（4 档）：

| id | 触发条件 | icon | headline | sub |
|---|---|---|---|---|
| `hidden` | grantedCount=0 且 claimedCount=0 | — | （不渲染） | — |
| `grantedOnly` | grantedCount≥1 | `Gift` | `You have N unclaimed voucher(s)` | `Tap to claim — then redeem within 7 days.` |
| `grantedAndClaimed` | grantedCount≥1 且 claimedCount≥1（优先 granted CTA） | `Gift` | 同上 | 同上 |
| `claimedOnly` | grantedCount=0，claimedCount≥1 | `Ticket` | `You have N voucher(s) ready to redeem` | `Redeem to open a free position on any eligible event.` |

直接复用 `VoucherBanner` 组件（用 mock 注入 `usePositionVouchers` 不现实）→ 在 demo 里手写同款 JSX，但保证 className / 文案 / icon 与 `src/components/vouchers/VoucherBanner.tsx` 1:1。

## 2. VoucherCard（subsection 2）— 加 2 个 expired 态

在现有 8 档 PresetRail 末尾追加：

| id | mock | 视觉 |
|---|---|---|
| `expiredUnclaimed` | `status:'expired', claimedAt:null` | 走 §列表行（见下方第 7 节）；不进 `VoucherCard`，因 `VoucherCard` 无 expired 分支 |
| `expiredUnredeemed` | `status:'expired', claimedAt:set, redeemedAt:null` | 同上 |

→ 实际放到下方新建的"9. Expired voucher row"子分区，subsection 2 维持现状。

## 3. VoucherEarningsCard（subsection 3）— 加 3 个缺态

`VoucherEarningsCard` 已支持 `data` prop 直接驱动派生 tierState。新增 preset：

| id | volume / pending / lifetimeCredited | 触发文案 |
|---|---|---|
| `loading` | 用 `loading` 标志（需在 demo 里再加一层包装：直接渲染骨架版 — 复用组件的 `$—` 通过短路 mock 实现，最简做法：用 `pending=0, volume=0, lifetimeCredited=0` + 注释说明 `loading` 态金额显示 `$—` 与 button `"Trade more to unlock"`）。若组件无法仅靠 `data` 驱出 `$—`，在 demo 里手画占位段 + 引用 `loading` 视觉来源 |
| `nothingToClaim` | volume=20_000, pending=0, lifetimeCredited=25 → 按钮 `Nothing to claim` |
| `lifetimeAtCap` | volume=22_000, pending=40, lifetimeCredited=100（T2 cap 已用尽，pending>0）→ 按钮 `Tier cap claimed — reach next tier` |
| `claiming` | 沿用 `t2Partial` 数据，外加 demo-only flag 让按钮显示 `Claiming…` 旋转态。`VoucherEarningsCard` 当前 `claiming` 来自 `live.claiming`，不接受 prop → 在 demo 里**单独**画一个按钮快照（不走真组件），标注"按钮 claiming 态预览" |

若 `loading` / `claiming` 无法通过现有 props 驱动，在该子分区底部加一个 mini "Button states" 行，单独展示按钮 4 种文案（claim 可用 / claiming / nothing to claim / tier cap claimed / trade more to unlock），确保研发能照抄。

## 4. 新增 subsection — Vouchers 列表级状态

放在 "1. VoucherBanner" 之后，命名 **"2. Vouchers page — list-level states"**（后续编号顺延）：

| preset | 视觉 |
|---|---|
| `loading` | `rounded-xl border border-border bg-card/40 p-8 text-center text-sm text-muted-foreground` + `Loading vouchers...`（与 `src/pages/Vouchers.tsx` 一致） |
| `empty` | `rounded-xl border border-border bg-card/40 p-10 text-center` + 圆形 `Ticket` icon + `No vouchers yet` + 副标 `When you receive a position voucher, it'll show up here ready to redeem.` |
| `populated` | 文字提示 "见下方 sections 2–9 的各子模块组合" |

## 5. CloseVoucherContent（subsection 6）— 加 short + cap 截断态

现 PresetRail：profit / loss / submitting。新增：

| id | side | entry / mark / face | 演示重点 |
|---|---|---|---|
| `longProfitCapped` | long | 0.20 / 0.95 / 25 | rawPnL >> cap，credit 被 cap 截断到 `$25.00` |
| `shortProfit` | short | 0.70 / 0.20 / 25 | side=short 的视觉（红色 Position 行） |
| `shortLoss` | short | 0.30 / 0.85 / 25 | short + credit floored 到 `$0.00` |

## 6. RedeemedRow（subsection 7）— 加 close reason 区分

settled 行新增 close reason 区分（影响右下文案）：

| preset | close reason | 右下小字 |
|---|---|---|
| `settledManualProfit` | manual | `Closed manually` |
| `settledEventResolved` | event_settled | `Event settled` |
| `settledHoldExpiry` | expiry | `Hold window expired` |
| `settledFullLoss` | event_settled, pnl=0 | `Event settled` + `$0.00` |

保留现有 `binaryOpen` / `multiOpen`。原 `settledProfit` / `settledLoss` 合并入新预设。

## 7. 新增 subsection — Expired voucher row

放在最末（编号 10）。复刻 `Vouchers.tsx` 的 `ExpiredSection` 行视觉：`rounded-lg border border-border bg-muted/10 p-3 flex items-center justify-between gap-3 opacity-70`，左侧 `code` + `$face`，右侧 `Expired`。

PresetRail：

| id | 来源 | 右侧标签 |
|---|---|---|
| `expiredUnclaimed` | granted 未 claim 就过期 | `Expired` + 副标 `Never claimed` |
| `expiredUnredeemed` | claimed 但 7d 内未 redeem | `Expired` + 副标 `Never redeemed` |

> 注：当前生产 `ExpiredSection` 只显示 `Expired`，没有区分来源。子分区底部加一行备注："生产侧目前不区分两种来源；若需上线区分需另开 ticket 改 `Vouchers.tsx::ExpiredSection`。"

## 不做

- 不改任何生产组件（`VoucherBanner` / `VoucherCard` / `VoucherEarningsCard` / `CloseVoucherContent` / `Vouchers.tsx::ExpiredSection`）。所有差异在 demo 内复刻 JSX 实现。
- 不改 `docs/copy-dictionary.md`；如需新增 `Never claimed` / `Never redeemed` / `Closed manually` / `Hold window expired` / `Event settled` 等副标进字典，等用户单独确认。
- RedeemSticky / PositionChip 子分区现有覆盖已足够，不动。

## 验收

- /style-guide → Vouchers 区共 10 个子分区：Banner / Page list-level / VoucherCard / EarningsCard / EventPickerList / RedeemSticky / CloseVoucherContent / RedeemedRow / PositionChip / Expired row。
- 每个 PresetRail 的每一档切换都能驱出唯一可分辨的视觉。
- Banner / Earnings 按钮 / Empty / Loading / Expired row 的文案与生产源文件逐字一致。
