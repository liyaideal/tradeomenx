计划如下：

1. 调整 Polymarket 连接弹窗的流程
   - 用户点击 Settings 里的 Polymarket `Connect`，不再先让用户手动输入地址。
   - 弹窗第一步改成“Connect wallet to detect address”，用户点击后拉起浏览器钱包授权。
   - 授权成功后，把钱包返回的 `0x...` 地址自动填入 `Polymarket Wallet Address`。
   - 地址输入框改为不可编辑，只作为确认展示，避免用户填错 Polygon/Polymarket 地址。

2. 保持后续签名验证逻辑不变
   - 用户看到自动识别的地址后，点击 `Sign & Connect`。
   - 继续使用现有 EIP-712 签名流程。
   - 签名时仍校验当前 signer 地址必须等于自动获取的地址。
   - 验证成功后继续写入现有 connected account 数据，不改数据库结构。

3. Desktop 和 Mobile 同步优化
   - `src/components/settings/ConnectedAccountsCard.tsx`：Settings 页面的桌面 Dialog 和移动 Drawer 都使用新流程。
   - `src/components/hedge/PolymarketConnectDialog.tsx`：H2E landing page 里的独立 Polymarket 连接弹窗也同步使用同样的新流程，避免两个入口体验不一致。

4. 交互文案建议
   - 初始状态：
     - 标题保持 `Connect Polymarket`
     - 描述改为说明“Connect the wallet you use on Polymarket. We’ll detect the address automatically.”
     - 主按钮：`Connect Wallet`
   - 地址获取成功后：
     - 显示只读地址框
     - 辅助说明：`Address detected from your wallet. This cannot be edited.`
     - 主按钮切换为 `Sign & Connect`
   - 如果没有浏览器钱包：提示 `No wallet detected. Please open this page in a wallet-enabled browser or install MetaMask.`

技术实现细节：
- 使用现有 `ethers` 的 `BrowserProvider` 和 `window.ethereum.request({ method: "eth_requestAccounts" })` 获取授权地址，不新增后端或数据库变更。
- 新增一个前端状态，例如：
  - `walletAddress`
  - `isDetectingWallet`
  - `addressDetected`
  - `connectionStep: "detect" | "input" | "signing" | "verifying"` 或等价命名
- `Sign & Connect` 按钮只有在地址已被钱包授权检测出来后才可用。
- Demo mode 下也模拟“授权获取地址”步骤，自动填入 demo 地址，后续流程保持当前 mock 验证逻辑。
- 完成后运行 TypeScript 检查，确认两个入口都没有类型错误。