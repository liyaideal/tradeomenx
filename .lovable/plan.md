我会在 `/portfolio/airdrops` 的 settled airdrop 行上增加明确的 Wallet 入口，让用户看到 `+$6.50` 后知道去哪里查看余额/提现条件。

Implementation plan:

1. Update desktop table action
  - 在 `src/pages/PortfolioAirdrops.tsx` 中，把 settled 状态当前只显示 P&L 文本的 Action 区改成可点击按钮。
  - 按钮文案建议用 `View`，右侧保留箭头图标。
  - 点击跳转到 `/wallet`。
  - 保留绿色 P&L 信息，避免用户丢失“已入账/收益金额”的反馈。
2. Update mobile card behavior
  - 目前 mobile 只有 activated 卡片点击进入 trade。
  - 为 settled 卡片也增加点击行为：点击卡片跳转 `/wallet`。
  - 调整 cursor 样式，让 activated 和 settled 都表现为可点击。
3. Add withdrawal requirement guidance
  - 在 settled 行的 Action 或附近增加简短提示，例如 `Withdrawal subject to volume requirements`，让用户知道不是看到收益就一定马上能提现。
  - 桌面端放在按钮下方的小字提示；移动端如果不改共享卡片组件结构，则先通过卡片点击跳 Wallet，并在桌面表格中明确展示提示。
4. Keep existing behaviors unchanged
  - Pending: 仍然是 `Activate`。
  - Activated: 仍然 `View` 到对应交易市场。
  - Expired: 仍然无操作。
  - 不改 airdrop 数据结构、不改后端、不动钱包余额计算逻辑。

Technical details:

- Main file: `src/pages/PortfolioAirdrops.tsx`
- Route target already exists: `/wallet`
- Existing navigation uses `useNavigate()`，所以只需要复用 `navigate('/wallet')`。
- No database or Cloud changes needed.