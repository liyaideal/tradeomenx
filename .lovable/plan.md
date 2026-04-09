

## 联动模拟数据：Settings 扫描结果 ↔ Portfolio Airdrops Tab

### 问题
当前 `useConnectedAccounts` 的 demo 数据和 `useAirdropPositions` 的 mock 数据是完全独立的。Settings 页面可能显示 "positionsDetected: 3"，但 Portfolio 的 Airdrops tab 里的 mock 数据与 connected account 状态无关——无论是否连接了账户，mock airdrops 都会显示。需要把两边的数据联动起来。

### 计划

#### 1. 让 `useAirdropPositions` 感知连接状态
**文件**: `src/hooks/useAirdropPositions.ts`

- 引入 `useConnectedAccounts` 获取 `activeAccounts` 和 `isDemoMode`
- Demo 模式下：只有当 `activeAccounts.length > 0` 时才返回 MOCK_AIRDROPS，否则返回空数组
- 这样用户在 Settings 连接 Polymarket 后，Portfolio 的 Airdrops tab 才会出现模拟仓位

#### 2. 给 `ConnectedAccount` 添加扫描统计字段
**文件**: `src/hooks/useConnectedAccounts.ts`

- 接口扩展：添加 `positionsDetected: number`、`airdropsReceived: number`、`scanStatus: "scanning" | "complete"`
- `demoVerifyAndConnect` 中：新建账户初始 `scanStatus: "scanning"`，3 秒后自动更新为 `scanStatus: "complete"`, `positionsDetected: 3`, `airdropsReceived: 2`

#### 3. Settings 已连接状态展示扫描进度和统计
**文件**: `src/components/settings/ConnectedAccountsCard.tsx`

已连接的 platform 行扩展为：
- **Scanning 中**: 显示 "Scanning positions..." + spinner
- **Scan 完成**: 显示统计信息（Positions detected: 3, Airdrops received: 2），与 Portfolio 的 mock 数据对应
- 保留 Disconnect 按钮

#### 4. MOCK_AIRDROPS 数量与 positionsDetected 对齐
确保 `useAirdropPositions` 中的 MOCK_AIRDROPS 数组有 3 条数据（已有 3 条），其中 2 条 status 为 activated/pending（对应 airdropsReceived: 2）。调整一条 mock 数据的 status 使计数一致。

### 文件变更汇总

| 文件 | 变更 |
|------|------|
| `src/hooks/useConnectedAccounts.ts` | 扩展接口 + demo 扫描模拟 + setTimeout 自动更新统计 |
| `src/hooks/useAirdropPositions.ts` | 引入连接状态，demo 模式下根据 activeAccounts 决定是否返回 mock 数据 |
| `src/components/settings/ConnectedAccountsCard.tsx` | 已连接状态展示扫描动画和统计数字 |

