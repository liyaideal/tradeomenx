## /settings/transparency 中 outcomeId → marketId 重命名

### 现状盘点

`outcomeId` 在 transparency 模块共有 6 处用户可见引用：

| 文件 | 位置 | 当前展示 |
| --- | --- | --- |
| `TransparencyPage.tsx` | 首页 Trade Audit 卡描述 | `...TradeLogged events (eventId, outcomeId, makerUid, takerUid, ...)` |
| `TransparencyPage.tsx` | 首页 Funding Rate 卡描述 | `...FundingRate event log (eventId, outcomeId, fundingRate)` |
| `TradeVerification.tsx` | 字段对照表 | 行标签 `Outcome ID`、字段 key `outcomeId` |
| `FundingRateAudit.tsx` | 链上字段表 | 行标签 `outcomeId` |
| `SettlementAudit.tsx` | 结算结果区 | 大标题 `winningOutcomeId`、文案 `Outcome index: N`、结论中的 `(index N)` |

### 重命名建议

**建议改成 `marketId`**，理由：
1. 项目里"每个选项 = 一个可交易市场"已是用户既有心智（Polymarket/Kalshi 同款），`marketId` 比 `outcomeId` 更直觉。
2. 数据库主键本身就叫 `option_id`，对外统一成 `marketId` 比 `outcomeId` 更贴近实际数据模型。
3. `outcome` 一词在 Settlement Audit 上下文里语义混淆——"winning outcome" 同时指"获胜结果"和"获胜的那个市场"，容易让用户误解。

### 改动范围

仅做 **用户可见字符串** 的替换，**底层 TypeScript 字段名 `outcomeId` 保持不变**（避免影响 hook / 类型 / mock 数据结构）：

1. `TransparencyPage.tsx` 两段描述里 `outcomeId` → `marketId`
2. `TradeVerification.tsx` 字段对照行 label `Outcome ID` → `Market ID`（key 内部仍叫 `outcomeId`）
3. `FundingRateAudit.tsx` 表格行 label `outcomeId` → `marketId`
4. `SettlementAudit.tsx`：
   - `winningOutcomeId` 标题 → `winningMarketId`
   - `Outcome index: N — settles at $1.00` → `Market index: N — settles at $1.00`
   - 结论里 `(index N) was declared the winner` 保持，或改成 `(market index N)` 更明确

### 待确认

- **Settlement Audit** 里"获胜市场"的语境，建议把 `winningOutcomeId` 改成 **`winningMarketId`** 还是保留为 `winningOutcomeId`（因为它语义上确实是"获胜的那个 outcome/market"）？  
  推荐 `winningMarketId`，全站统一，但如果你想保留链上事件原始命名（更"链感"），也可以例外保留。

- 是否同步把首页描述里的 `TradeLogged` / `FundingRate` 字段列表里的其他 camelCase 字段（`eventId`、`makerUid`、`takerUid`）也审视一遍？本次默认 **只动 outcomeId**，其他不动。
