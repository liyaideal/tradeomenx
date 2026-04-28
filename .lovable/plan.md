## Plan: Deposit Wallet 改成先选 Chain，再选 Token

### 目标
把 Deposit 的 Wallet/Cross-Chain 选择器从“所有 chain-token 组合一次性展开”改成两步选择，避免未来接口一次拉 30 条 chain + 几百个 token 导致请求过多和 UI 下拉过长。

### 交互调整
1. **From 区域拆成两个选择器**
   - 第一层：Chain 选择，只展示支持的链列表。
   - 第二层：Token 选择，只在当前选中的 chain 下展示该链可用 token。
   - 用户切换 chain 后：自动重置 token 为该 chain 的默认/第一个可用 token，并清空 amount。

2. **Desktop 与 Mobile 同步优化**
   - 当前 `DepositDialog` 和 `/deposit` 移动页都复用 `CrossChainDeposit`，所以改组件本身即可同时覆盖两端。
   - Desktop 保持紧凑卡片布局，Mobile 避免大下拉溢出，选择面板限制高度并可滚动。

3. **减少接口压力的结构预留**
   - 组件内部数据结构改成 chain-first：先拿 chain 列表，再根据 selected chain 使用该 chain 的 tokens。
   - 未来接真实接口时，可以只在用户选中某条 chain 后再请求该 chain 的 token 列表，而不是一次性请求全部 token。

### UI 细节
- Chain 按钮显示：chain logo + chain name。
- Token 按钮显示：token symbol + 当前 chain name；列表里只出现当前 chain 的 tokens。
- 保留当前余额、MAX、汇率、review/sign/processing/result 后续流程，不改变 deposit 业务流程。
- 去掉目前截图中那种“USDC Ethereum、USDT Ethereum、ETH Ethereum、USDC Arbitrum...”全部混排列表。

### 技术实现
- 修改 `src/components/deposit/CrossChainDeposit.tsx`：
  - 将当前单个 `<Select value={`${fromChain}-${fromToken}`}>` 拆成两个 selector。
  - 增加 `handleChainChange(chainId)`，负责设置 chain、选择默认 token、清空 amount。
  - token 列表渲染改为 `SOURCE_TOKENS[fromChain]`，不再遍历所有 chains。
  - 选择器弹层添加 `max-h`/滚动样式，避免长列表撑出视口。
- 如需要，同步更新 `src/hooks/useMockWallet.ts` 的 mock 数据结构/默认 token，确保切链后余额显示稳定。
- 运行 TypeScript 检查，确认两端编译通过。