我会把跨链换币里的 `Swap Mode / Auto / Manual` 整个能力移除，只保留新供应商仍支持的设置项。

计划如下：

1. 清理 Deposit 的跨链换币入口
   - 删除 Swap 标题右侧的 `Auto` pill 按钮。
   - 保留右侧的 settings 图标，用于打开滑点设置。
   - 删除 `autoMode` 相关 state 和 props 传递。

2. 清理 Withdraw 的跨链换币入口
   - 同样删除 `Auto / Manual` 切换按钮。
   - 保留 settings 图标和滑点设置。
   - 删除 `autoMode` 相关 state 和 props 传递。

3. 重构共享设置组件 `CrossChainSettings`
   - 删除 `SwapModeCard`、`AutoModeButton`、`AUTO_FEATURES`、`MANUAL_FEATURES` 等旧供应商专属模块。
   - `SettingsPanel` 只展示 `Bridge Settings` 标题和 `Slippage` 设置。
   - 移除不再使用的 `Check`、`XCircle`、`cn` 等 import，避免死代码。

4. 文案和视觉结果
   - Deposit / Withdraw 的弹窗或页面顶部会从截图里的：
     ```text
     Swap                         Auto   settings
     ```
     变成：
     ```text
     Swap                                settings
     ```
   - 打开 settings 后只会看到滑点设置，不再出现 `Swap Mode`、`Auto`、`Manual` 和相关功能说明。

涉及文件：
- `src/components/deposit/CrossChainDeposit.tsx`
- `src/components/withdraw/CrossChainWithdraw.tsx`
- `src/components/deposit/CrossChainSettings.tsx`