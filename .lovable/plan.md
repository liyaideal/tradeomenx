

## 前端 Demo 流程：Connect External Account

### 目标
让整个 Connect Polymarket 流程在前端可以完整走通（使用 mock 数据），方便给研发演示，后端验证接口由研发后续对接。

### 当前问题
- `handleConnectWallet` 依赖真实的 MetaMask/Web3 provider 和后端 edge function
- 没有 Web3 钱包时直接报错，无法演示
- hook `useConnectedAccounts` 查询真实数据库，demo 环境无数据

### 计划

#### 1. 添加 Demo 模式到 `useConnectedAccounts`
在 hook 中添加一个 `DEMO_MODE = true` 常量（后续研发对接时改为 false）：
- 当 `DEMO_MODE` 开启时，`verifyAndConnect` 不调用 edge function，而是模拟 1.5 秒延迟后将地址写入本地 state
- `disconnect` 同理，从本地 state 移除
- 使用 `useState` 管理 mock 的 `accounts` 列表，不查数据库

#### 2. 修改 `ConnectedAccountsCard` 的连接流程
将 `handleConnectWallet` 改为 demo 模式下的分步流程：

**Step 1 — 输入地址**（已有）
- 用户输入 0x 地址

**Step 2 — 模拟签名**
- 点击 "Sign & Connect" 后，显示 "Waiting for wallet signature..." 状态（1.5 秒动画）
- 不调用真实 MetaMask，只做视觉演示

**Step 3 — 验证中**
- 显示 "Verifying on-chain..." 状态（1 秒动画）

**Step 4 — 成功**
- Toast 提示 "Wallet connected and verified"
- 关闭弹窗，平台行显示 Connected badge + 缩略地址
- Disconnect 按钮可用

整个流程保留真实签名的 UI 步骤和文案，只是跳过真实的 Web3 调用。

#### 3. 文件变更

| 文件 | 变更 |
|------|------|
| `src/hooks/useConnectedAccounts.ts` | 添加 `DEMO_MODE` 分支，mock verifyAndConnect / disconnect / accounts state |
| `src/components/settings/ConnectedAccountsCard.tsx` | `handleConnectWallet` 添加 demo 分步动画（signing → verifying → success），移除对 `window.ethereum` 的硬依赖 |

#### 4. 研发对接时
只需将 `DEMO_MODE` 改为 `false`，所有真实的 EIP-712 签名 + edge function 调用代码已经存在，无需重写。

