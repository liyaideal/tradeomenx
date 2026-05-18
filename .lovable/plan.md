## 移动端弹窗规范审计（修正版）

规范：移动端所有「编辑 / 确认 / 选择」类弹层必须用 `MobileDrawer`。Popover/Dialog/AlertDialog/原生 Drawer 都不算。

我把上一版误报的去掉了：
- ❌ ~~AuthDialog~~ —— 移动端实际走 `AuthSheet`（已是 `MobileDrawer`），调用方都做了 `isMobile ? <AuthSheet/> : <AuthDialog/>` 分支 ✅
- ❌ ~~EventCard Order Preview~~ —— 移动端走的是 `/order-preview` 整页（非弹窗）✅

---

### A. 严重违规（移动端居中 Dialog/AlertDialog）

| # | 文件 | 弹窗 | 触发位置 |
|---|------|------|---------|
| 1 | `src/components/PositionCard.tsx:334` | **Edit TP/SL** Dialog | 移动端 Positions 列表里每张卡的 "Add/Edit TP/SL" 按钮（截图里就是这个） |
| 2 | `src/components/OrderCard.tsx:131` | **Fill Order** AlertDialog | `/trade/order` 的 Orders tab，点订单卡 "Fill" 按钮 |
| 3 | `src/components/OrderCard.tsx:181` | **Cancel Order** AlertDialog | 同上，点订单卡 "Cancel" 按钮 |

→ 全部改成「移动端 `MobileDrawer` + 桌面端保留 Dialog」。OrderCard 两个 AlertDialog 内容差不多，可以共用一个内部 `OrderConfirmContent` 组件。

### B. 中度违规（用了 mobile 分支但走原生 `Drawer`，没走 `MobileDrawer`）

视觉/handle/安全区与项目其它抽屉不一致。

| # | 文件 | 现状 |
|---|------|------|
| 4 | `src/components/AirdropHomepageModal.tsx` | mobile 用 `@/components/ui/drawer` |
| 5 | `src/components/rewards/RedeemDialog.tsx` | mobile 用 `@/components/ui/drawer` |
| 6 | `src/components/rewards/XShareConfirmDialog.tsx` | mobile 用 `@/components/ui/drawer` |

→ 把 `<Drawer><DrawerContent>` 整段换成 `<MobileDrawer title=... description=...>`。

### C. 其它（不算违规但需确认）

| # | 文件 | 说明 |
|---|------|------|
| 7 | `src/components/MobileTradingLayout.tsx` | 直接用 `Sheet`，但这是侧边导航 `side="left"`，不是底部弹窗，**保留** |
| 8 | `src/components/MobileHeader.tsx`、`Portfolio.tsx`、`Wallet.tsx` 的移动端 Popover | 只是字段说明 tooltip，不是编辑/确认，**保留** |
| 9 | `src/components/events/ChgTimeframePicker.tsx` | 时间段切换 Popover，移动端用户感知有但操作轻，**可选改 Drawer**，非必须 |
| 10 | `src/components/BinaryEventHint.tsx` | 已有 `useIsMobile` 分支，需顺手确认移动分支是 `MobileDrawer` |

### D. 已合规（样板参考）

`TopUpDialog` / `RewardsWelcomeModal` / `TreasureClaimDialog` / `PolymarketConnectDialog` / `ConnectedAccountsCard` / `AuthSheet` / `ClosePositionDrawer`（上轮新加）

---

## 推荐范围

**A 组 3 个（必修） + B 组 3 个（建议修）**，一共 6 个文件。

A 组要新建/抽出来的共用子组件：
- `EditTpSlForm`（PositionCard 用）
- `OrderConfirmContent`（OrderCard 用，type 区分 fill / cancel）

要不要我现在按 A+B 一次全改？或者只先把 A 组 3 个改了？