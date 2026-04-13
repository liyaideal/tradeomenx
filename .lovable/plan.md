

# OmenX 主网前功能补全 — 实施计划

## 总览

两个大需求按优先级排队执行：
1. **Feature 2 — 出入金流程扩展**（先做）
2. **Feature 1 — 链上透明度验证页**（后做）

所有链上交互和外部 API 调用均用前端 mock 数据 + 定时器模拟，不调用真实 RPC 或 Banxa API。

---

## Feature 2 — 出入金流程扩展

### Task 2.1: Deposit Dialog/Page 改造为 3-Tab

**改动范围：**
- `DepositDialog.tsx`（桌面端）和 `Deposit.tsx`（移动端）统一改为 3-Tab 结构
- Tab 1: **Wallet Deposit** — 迁移现有钱包地址充值内容
- Tab 2: **Cross-Chain** — 新建组件
- Tab 3: **Buy with Fiat** — 新建组件
- 移除现有的 AssetSelect 选币步骤（因为目标固定为 Base-USDC）
- Tab 1 增加二次确认提示：仅支持 Base-USDC（合约地址），错链/错币不保证找回

### Task 2.2: Cross-Chain Deposit 完整流程（5 步）

**新建组件：** `CrossChainDeposit.tsx`

- Step 1 — 资产选择：From Chain 下拉（Ethereum/Arbitrum/BSC/Polygon）+ Token 选择 + 金额输入；To Chain 锁定 Base，To Token 锁定 USDC；收款地址用用户注册时平台创建的钱包地址（从 deposit_addresses 表或 custody address 获取），不可修改
- Step 2 — 报价确认：mock 报价数据（预计到账、最低到账、费用明细、汇率、滑点），30s 倒计时，feeBps=0
- Step 3 — Mock 钱包签名弹窗（模拟 MetaMask 确认界面）
- Step 4 — 处理中页：3 阶段进度条（源链确认 2s → 跨链处理 3s → 目标链确认 2s），定时器自动推进
- Step 5 — 结果页：成功（绿色动画 + 到账金额 + mock tx hash）/ 失败（红色 + 原因 + 重试按钮）

**新建 hook：** `useCrossChainDeposit.ts` — 管理状态机流转（DRAFT → QUOTING → QUOTED → SIGNING → SOURCE_PENDING → BRIDGING → DEST_PENDING → COMPLETED/FAILED）

**数据库：** 新建 `cross_chain_transactions` 表

### Task 2.3: Buy with Fiat（Banxa 法币入金）

**新建组件：** `BuyWithFiat.tsx`

- Step 1 — 表单：法币选择（USD/EUR/GBP/AUD，带国旗）、金额输入、支付方式选择（Credit Card/Bank Transfer/Apple Pay）、预计到账 USDC、费用明细
- Step 2 — Mock Banxa Checkout 页（Banxa Logo + 订单摘要 + KYC "Verified" + Complete Payment 按钮）
- Step 3 — 订单追踪（4 阶段状态进度条，定时器模拟）
- Step 4 — 结果页

**数据库：** 新建 `fiat_transactions` 表

### Task 2.4: Withdraw Dialog/Page 改造为 3-Tab

- Tab 1: **Wallet Withdraw** — 迁移现有提现内容
- Tab 2: **Cross-Chain Withdraw** — 新建
- Tab 3: **Sell to Fiat** — 新建

### Task 2.5: Cross-Chain Withdraw 流程

**新建组件：** `CrossChainWithdraw.tsx`

- Step 1 — 输入金额 + 选择目标链/代币 + To Address（默认用户钱包地址，支持一键填充）
- Step 2 — 风控校验（可用余额、冻结余额检查，mock 通过）
- Step 3-5 — 复用跨链充值的 Quote 确认 → 签名 → 处理中 → 结果页模式

### Task 2.6: Sell to Fiat（Banxa 法币出金）

**新建组件：** `SellToFiat.tsx`

- Step 1 — 卖出 USDC 金额 + 目标法币 + 收款方式 + 预计到手金额 + 费用明细；余额校验（含冻结余额扣除）
- Step 2 — Mock Banxa KYC/收款确认页
- Step 3 — USDC 转账确认页（From OmenX Wallet → To Banxa 收币地址）
- Step 4 — 订单追踪（5 阶段）
- Step 5 — 结果页（预计 1-3 个工作日到账）

**数据库变更：** profiles 表新增 `fiat_sell_frozen_balance` 字段（Sell 发起后冻结对应金额）

### Task 2.7: Transaction History 类型扩展

- 现有 Deposit/Withdraw 标签基础上，新增 4 种类型标签及颜色：
  - Cross-Chain In（蓝）、Cross-Chain Out（橙）、Fiat Buy（紫）、Fiat Sell（粉）
- 每条记录可展开查看详情（状态、tx hash、费用明细、时间线）

---

## Feature 1 — 链上透明度验证页

### Task 1.1: 页面框架 + 路由

- 新建 `/settings/transparency` 路由
- Settings 菜单新增 "Transparency Audit" 入口（Shield 图标）
- Footer 新增 "Open Source Auditor" 链接
- 页面结构：Hero Section + 3 个 Scenario 卡片 + Footer（合约地址 + 开源审计器入口）

### Task 1.2: Scenario 1 — 资产默克尔证明

- 入口卡片："My Funds Are Really There?"
- 点击后 5 步动画流程：拉取证明 → 读链上 StateRoot → 浏览器本地验算 → 结果展示
- 默认成功：绿色盾牌动画 + 可折叠详情（余额、仓位、Leaf Hash、State Root、Batch ID）
- 全部使用 mock 数据（真实 Base 链格式 0x + 64 hex）

**数据库：** 新建 `asset_verifications` 表

### Task 1.3: Scenario 2 — 历史交易溯源

- 入口卡片："Is My Trade Real?"
- 下拉选择最近交易 → 弹窗左右对比（DB Record vs On-Chain Log）
- 匹配字段绿色高亮，展示对手盘（做市商标注 "Official AMM Node"）
- 底部 "View on BaseScan" mock 链接

**数据库：** 新建 `trade_verifications` 表

### Task 1.4: Scenario 3 — 爆仓价格核查

- 入口卡片："Why Was I Liquidated?"
- 下拉选择强平记录（预填 mock 假爆仓数据）
- 三模块展示：链上强平快照 + 第三方预言机价格对比 + 结论文案
- 偏差百分比 + 颜色标识（绿色 = 合理范围内）

**数据库：** 新建 `liquidation_verifications` 表 + 预填 mock 爆仓记录

### Task 1.5: 辅助入口

- 先只做 Settings 子页面 + Footer 入口
- Wallet 页 "Verify Assets" 按钮和 Portfolio "Verify on Chain" 图标留后续迭代

---

## 执行顺序

按 PRD 优先级，Feature 2 全部完成后再做 Feature 1。Feature 2 内部按任务编号 2.1 → 2.2 → 2.3 → 2.4 → 2.5 → 2.6 → 2.7 依次执行。

