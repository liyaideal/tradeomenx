## 目标

在 `/vouchers` 页面 Expired 区域，给**每个用户**都常驻显示两张 demo 过期 voucher：
1. **未领取就过期**（granted → expired）
2. **领取了但 7 天内没 redeem 就过期**（claimed → expired）

让用户即使从没收到/领过 voucher，也能看到 expired 状态长什么样。

## 实现方式

纯前端注入 demo 数据，不动数据库、不动 edge function、不动 `position_vouchers` 表。

### 1. `src/hooks/usePositionVouchers.ts`

在 `useQuery` 返回结果之后，把两张固定的 demo 过期 voucher **拼到 `vouchers` 数组末尾**（在 enrichment 之后），保证：

- 所有用户（包括 guest fallback、新注册用户、老用户）都能看到。
- 不影响 `grantedVouchers` / `claimedVouchers` / `issuedVouchers` 的派生（它们用 `expiresAt > now` 过滤，demo 的 `expiresAt` 设为过去时间，自然不会进 active 列表）。
- 不影响 `claim` / `redeem` 调用（demo id 永远不会被点击触发，因为它们落进 ExpiredSection，那里没有交互）。

两条 demo 数据形状：

```ts
{
  id: "demo-expired-unclaimed",
  code: "DEMO-UNCLAIMED",
  faceValue: 5,
  redeemableCapPct: 5,         // → max profit $25
  maxHoldingHours: 24,
  entryPriceMin: 0.30, entryPriceMax: 0.70,
  minHoursToSettlement: 6,
  status: "expired",
  issuedAt:  <14 天前>,
  expiresAt: <7 天前>,          // 已过期 7 天
  claimedAt: null,             // 关键：从未 claim
  redeemedAt: null,
  redeemedAirdropPositionId: null,
  redeemedEventId: null, redeemedOptionId: null, redeemedSide: null,
  redeemedAirdropStatus: null,
  redeemedEventName: null, redeemedOutcomeLabel: null,
  redeemedSettledPnl: null, redeemedCloseReason: null,
}
```

```ts
{
  id: "demo-expired-unredeemed",
  code: "DEMO-UNREDEEMED",
  faceValue: 15,
  redeemableCapPct: 6.667,     // → max profit $100
  maxHoldingHours: 24,
  entryPriceMin: 0.30, entryPriceMax: 0.70,
  minHoursToSettlement: 6,
  status: "expired",
  issuedAt:  <12 天前>,
  expiresAt: <2 天前>,
  claimedAt: <9 天前>,          // 关键：claim 过，但 7 天内没 redeem
  redeemedAt: null,
  …其余 redeemed* 全部 null
}
```

### 2. `src/pages/Vouchers.tsx` — `ExpiredSection`

让两种过期来源在 UI 上能被区分（生产真实数据也能受益）。判定规则：

- `claimedAt != null && redeemedAt == null` → "Claimed, not redeemed"
- `claimedAt == null` → "Unclaimed"
- 其他保持当前 "Expired"

在右侧 `Expired` 文案下加一行 `text-[10px] text-muted-foreground/70`，写明上面两种来源；已有的 `opacity-70` / 灰色基调保持不变。不新增图标、不改色调，符合 expired 的"灰掉"语气。

### 3. 不改动

- `position_vouchers` 表 / RLS / migration：不动
- `claim-position-voucher` / `redeem-position-voucher` edge function：不动
- `VoucherCard` / `VoucherEarningsCard` / `VoucherBanner`：不动（demo 数据只走 ExpiredSection 渲染路径）
- `/style-guide` Vouchers section：上一轮已经覆盖了 expired 子状态，这次不需要再补
- `docs/copy-dictionary.md`：不动

## 验证

- 全新用户登录 `/vouchers` → 看到 Expired (2)，两行分别标 `Unclaimed` 和 `Claimed, not redeemed`
- 已有 expired voucher 的用户 → 真实 expired + 2 条 demo 一起显示，互不干扰
- Active / Granted / Redeemed 列表 → 计数和内容不变
- 点击 demo 行 → 无任何 side effect（ExpiredSection 本来就没绑定交互）
