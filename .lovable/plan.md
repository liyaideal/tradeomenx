# /settings/transparency 显示文案：buy/sell → long/short

## 背景

排查 transparency 模块所有页面，只有 **Trade Verification** 子页会向用户展示交易方向，目前显示为 `BUY` / `SELL` 徽章。

平台核心模型是永续合约 Long/Short（链上枚举本来就是 `Open Long / Close Short`），UI 里再用 `BUY/SELL` 既不一致也不准确。结论：**应该统一改为 LONG / SHORT**。

数据库 `trades.side` 字段值仍保留 `buy/sell`，只改前端显示，不动业务逻辑。

## 涉及位置（共 3 处）

| 文件 | 位置 | 现状 | 改为 |
| --- | --- | --- | --- |
| `TradeVerification.tsx` L68 | 交易列表里的方向徽章 | `BUY` / `SELL` | `LONG` / `SHORT` |
| `TradeVerification.tsx` L133 | 验证结果摘要里的方向 | `BUY` / `SELL` | `LONG` / `SHORT` |
| `useTradeVerification.ts` L148 | 字段对照表 "Side" 行的 DB 值 | `BUY` / `SELL` | `LONG` / `SHORT` |

颜色保留：long = emerald（绿），short = red（红）。

链上一侧的 `sideLabel`（`Open Long / Close Short`）和 `chainRaw`（枚举数字）保持不变 —— 那是链上原始字段，本来就该是这个样子，正好和 DB 侧的 LONG/SHORT 形成"业务侧 vs 链上侧"的清晰对照。

## 不改的部分

- 数据库 schema、`trades.side` 的实际值（`buy/sell`）
- `SIDE_ENUM` 的 key（仍以 `buy/sell` 做查表）
- transparency 其他子页（Asset / Funding / Settlement / Liquidation / Merkle）不涉及 buy/sell

## 验收

进入 /settings/transparency → Trade Verification：
- 交易列表的方向徽章显示 `LONG` / `SHORT`
- 选中一笔后，结果页头部方向徽章显示 `LONG` / `SHORT`
- 字段对照表 Side 行：DB 值 = `LONG` / `SHORT`，Chain 值 = `Open Long` / `Close Short`，Raw = `0` / `3`
