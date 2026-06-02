## 目标

把"选 event → 确认 → 兑换"这套流程从 Dialog/Drawer 里拿出来，直接铺在 `/vouchers` 页面上，让单券用户进来也不空，多券用户也能流畅切换。

## 新布局（桌面 ≥ md）

两栏，左窄右宽，左边券列表，右边兑换面板：

```text
┌─ Position Vouchers ─────────────────────────────────────────────┐
│  Redeem a voucher to instantly open a free position...          │
├──────────────────────────┬──────────────────────────────────────┤
│  Available (1)           │  Redeem 6D96F701 · $10.00            │
│  ┌────────────────────┐  │  ─────────────────────────────────── │
│  │ ● 6D96F701  $10.00 │  │  [voucher summary card — code, face, │
│  │   72h · cap $5     │  │   max profit, hold window, price band│
│  └────────────────────┘  │   left-aligned strip]                │
│  ┌────────────────────┐  │                                      │
│  │   489FAB02 $25.00  │  │  Pick a market                       │
│  └────────────────────┘  │  ┌────────────────────────────────┐  │
│                          │  │ search + category filter       │  │
│  Redeemed (2)            │  │ event row · event row · ...    │  │
│  ...                     │  │ (scrollable, max-h ~480px)     │  │
│  Expired (0)             │  └────────────────────────────────┘  │
│                          │  Selected summary + risk disclaimer  │
│                          │  [ Confirm & open position ]         │
└──────────────────────────┴──────────────────────────────────────┘
```

- 默认选中第一张 `issued` 券，右栏直接渲染兑换面板。
- 左侧每张 `issued` 券点一下就在右栏切，**不再弹 Dialog**。当前选中卡片加 `ring-2 ring-primary` 高亮。
- 切换券时 `picked` 重置为 `null`（不同券价格区间不同，复用没意义）。
- 没有任何券：右栏渲染空状态（与现在的 "No vouchers yet" 一致，左栏整体隐藏）。
- 只有一张券：左栏依旧渲染（保持结构稳定），用户也能看到自己有几张。

## 新布局（移动 < md）

单栏从上到下：

1. 标题块
2. Available 列表 — 横向 `snap-x` 滑动的卡片条（一张时也美观，多张时左右滑）。
3. 选中券的 redeem 面板（事件搜索 + 选择 + 确认按钮）。Cancel 按钮去掉，因为没有 dialog 可关；改成"Reset selection"次要按钮，仅当 `picked` 时显示。
4. Redeemed / Expired 折叠区。

→ 移动端干掉 `RedeemVoucherSheet` 的 MobileDrawer 调用。

## 组件改动

- **`src/pages/Vouchers.tsx`** 改造为两栏布局；管理 `selectedVoucherId`（默认第一张 issued）。
- **`src/components/vouchers/VoucherCard.tsx`** 增加 `compact?: boolean` 和 `selected?: boolean` props。compact 模式渲染成单行选择卡（icon + code + face + 倒计时 + cap），去掉大段说明文字和 Redeem 按钮，整张卡 clickable。
- **`src/components/vouchers/RedeemVoucherContent.tsx`** 加 `variant="inline"` 分支：
  - 没有外层 Dialog/Drawer，去掉 Cancel 按钮（或改成 "Reset"）。
  - 标题不再由 Dialog 提供，由 inline 容器自己渲染 `Redeem {code} · ${face}`。
  - 提交成功后不需要 `onClose`，直接 navigate。
- **`src/components/vouchers/RedeemVoucherSheet.tsx`** 删除（或保留作为后续别处复用，但 `/vouchers` 不再引用）。
- **`src/components/vouchers/EventPickerList.tsx`** 不改逻辑，但确保它在 inline 模式下高度受控（外层加 `max-h-[480px] overflow-y-auto`）。

## 不在范围

- 移动端事件选择交互（保持现有 list + 搜索）。
- 邮件/运营投放。
- 已兑换/已过期券的视觉重构。

## 实施顺序

1. `VoucherCard` 加 compact + selected props。
2. `RedeemVoucherContent` 加 inline variant。
3. `Vouchers.tsx` 重写：两栏布局 + 默认选中 + 切换逻辑 + 移动单栏。
4. 删除 `RedeemVoucherSheet` 引用（文件可保留）。

