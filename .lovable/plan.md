
# /settings/transparency 三处调整方案

你提的三点结论：**全部合理，建议照改**。下面按问题逐一确认改动范围与文案。

---

## 1. Liquidation Audit → 区分"清算"与"结算"两种场景

### 问题确认
你说的对：
- **清算（Liquidation）**：市场未结束，价格（概率）波动导致保证金不足强平。此时没有 Oracle 可对照，因为"概率"不是外部世界客观事件，没有任何预言机会喂这个数。
- **结算（Settlement）**：事件出最终结果，所有 Yes/No 价格被强制设为 1 或 0，平台按结算价对未平仓位平仓。这时才有 Oracle / 第三方信源可对照（即 Settlement Audit 已经覆盖的场景）。

当前 `LiquidationAudit` 文案把两者混在一起，技术上站不住脚。

### 改法（文案 + 逻辑都只在前端展示层）

**A. 入口文案改造（TransparencyPage 卡片）**
- `subtitle`: `PositionLiquidated Event Audit` → `PositionLiquidated Event Audit`（保持）
- `description` 改为：
  > 审计强制清算事件：核对链上 markPrice 与触发时的保证金率，确认清算是按合约规则、而非人为操作触发。

  ❌ 不再提"与第三方预言机价格对照"。

**B. `LiquidationAudit.tsx` 内部**
- 入口介绍段（line 50-52）：
  > Retrieve the on-chain `PositionLiquidated` event and verify the forced closure was triggered by the contract's maintenance margin rule — not by manual intervention.
- 进度步骤去掉 `Oracle Feed`，改为：
  1. Select Position
  2. On-Chain Log
  3. Margin Analysis
  4. Conclusion
- **Module B "Fair Market Price (Oracle)" 整块删除**。
- Module C Conclusion 文案重写，只讲：
  - 触发时 markPrice / mark probability
  - 你的 marginRatio 跌破 maintenanceMarginRate
  - 合约自动执行，无人工干预，链上可验证

**C. 结算场景已经在 Settlement Audit 里覆盖，无需重复。**
如果未来希望让用户也能审计"事件结算导致的强平"，可以在 Settlement Audit 中加一条"我持仓在结算时被按 0/1 平仓"的子流程，但这次先不动。

### Hook 改动
`useLiquidationAudit.ts` 删除 oracle 相关字段（`oraclePrice` / `oracleSource` / `oracleTimestamp` / `oracleFeedAddress` / `deviation` / `deviationPercent`），`conclusion` 改为只基于 `marginRatio < maintenanceMarginRate` 判定。

---

## 2. Asset Verification 字段：中间态 → 结果态

### 问题确认
你说的对：
- `Open Positions`（当前仓位市值）和 `Total Equity`（净资产）是**毫秒级浮动**的派生量。
- Base 出块 1s、延时极端 15s，链上记录这种字段没意义，对账时也对不齐——用户一刷新数字就变了，反而像是数据不准。
- **Margin（保证金）** 和 **Total Assets（总资产 = 余额 + 占用保证金）** 是结果态：由"开仓/平仓/出入金/资金费扣收"这类离散事件决定，相对稳定。

### 改法

**`MerkleProofVerification.tsx` line 132-143 三宫格字段调整：**

| 旧 | 新 |
|---|---|
| Available Balance | Available Balance |
| Open Positions | **Margin（已占用保证金）** |
| Total Equity | **Total Assets（= Available + Margin）** |

底部 Cryptographic Details 区域不变（leafHash / batchId / oldRoot / newRoot 等本来就是结果态）。

**Hook `useMerkleVerification.ts`：**
- `positionsValue` 重命名为 `margin`
- `totalEquity` 重命名为 `totalAssets`，公式 `balance + margin`
- 写入 `asset_verifications` 表时字段名保持不变（避免 schema 迁移），只是语义上对应 margin / totalAssets，由展示层负责映射

文案补一句小提示（hover or 副标题）：
> 仅展示结果态字段。浮动盈亏、当前仓位市值是实时派生数据，不在链上承诺范围内。

---

## 3. Trade Verification 对手盘：隐藏 UID，只展示角色

### 问题确认
你说的对：用户看到 makerUid / takerUid 是 mock 出来的十六进制串，但实际撮合方可能是风控或 AMM，暴露 UID 既不真实、又会引发"我对手是平台自己？"的猜疑。

### 用户会怀疑吗？
**不会，只要文案到位。** 行业里 Binance / Bybit 永续合约成交明细里**根本不展示对手盘身份**，只有用户自己的 Role（Maker/Taker）和手续费档位。你给一个 Role 标签，反而比假地址更可信。

### 改法

**`TradeVerification.tsx` line 159-182 "Counterparty UIDs (Anonymized)" 整块替换为：**

```
┌─ Execution Role ─────────────────┐
│ Your Role          [Taker]       │
│ Match Type         AMM / Orderbook │
│                                  │
│ ℹ 撮合对手方由平台撮合引擎匹配，    │
│   可能是 AMM 流动性池或其他用户。   │
│   出于隐私保护，对手方身份不公开。   │
└──────────────────────────────────┘
```

字段：
- **Your Role**: `Taker` 或 `Maker`（根据 trade 的 `order_type` 推断：market → Taker，limit 且立即成交 → Taker，limit 挂单成交 → Maker）
- **Match Type**: 统一显示 `Liquidity Pool` 或 `Order Matching`（不细分 AMM/风控）
- 底部一行说明

**Hook `useTradeVerification.ts`：**
- `OnChainTradeLog` 移除 `makerUid` / `takerUid`
- 新增 `userRole: "Taker" | "Maker"` 和 `matchType: string`
- `dbFields` 表格里去掉对手方相关行（如果有）

---

## 影响范围汇总

修改文件：
1. `src/components/transparency/LiquidationAudit.tsx` — 文案改写、删除 Oracle 模块、步骤精简
2. `src/hooks/useLiquidationAudit.ts` — 删除 oracle 字段
3. `src/pages/TransparencyPage.tsx` — Liquidation 卡片 description 改写
4. `src/components/transparency/MerkleProofVerification.tsx` — 三宫格字段名改 Margin / Total Assets
5. `src/hooks/useMerkleVerification.ts` — 字段重命名、公式调整
6. `src/components/transparency/TradeVerification.tsx` — 对手盘 UID 块替换为 Role
7. `src/hooks/useTradeVerification.ts` — 移除 maker/taker UID，新增 role / matchType

不影响数据库 schema、不影响其它页面。

---

## 待你确认

1. **Liquidation 第三个步骤的命名**：`Margin Analysis` 还是 `Maintenance Margin Check`？
2. **Asset Verification 中文/英文标签**：现状是英文（`Available Balance` / `Open Positions` / `Total Equity`），新字段是否继续英文 `Margin` / `Total Assets`？
3. **Trade Verification 的 Match Type 措辞**：要不要统一只写 `Order Matching`，不暴露 AMM 这个词？AMM 在做市商语境里偏技术。
