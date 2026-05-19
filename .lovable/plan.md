## 目标
你截图中的 "You're funded — make your first real trade" 卡片（`ActivationHero`）与 Mainnet Launch 活动绑定过深，从 `/wallet` 页删掉。

## 改动
1. **`src/pages/Wallet.tsx`** — 移除 `ActivationHero` 的 import 和挂载点（移动端顶部 + 桌面左列顶部）。
2. **删除组件文件** `src/components/activation/ActivationHero.tsx`（仅 Wallet 使用，删除后无引用）。
3. **保留** `ActivationChecklist`（在 `MobileHome` 用）、`DepositActivationHint`（Deposit 页）、`useActivationState`、Logo Mainnet 徽章 — 这些不属于本次删除范围。
4. **更新记忆** `.lovable/memory/features/activation-system.md` 的 Surfaces 段，去掉 ActivationHero 相关描述。

## 不动的部分
- `/mainnet-launch` 活动页本身
- 激活状态机 hook
- Deposit 页和 MobileHome 的激活相关 UI
- 业务逻辑、数据层
