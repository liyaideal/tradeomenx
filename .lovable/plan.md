# Long/Short + Buy/Sell → 全部 Yes/No 化

## 背景
- 底层数据语义已统一到"Yes 市场的 long / short"，但 UI 同时存在 **Long/Short** + **Buy/Sell** 两套方向词，又叠加 `long + short = 1` 双价展示，导致用户出现"开 short、价格涨却显示亏"的反直觉。
- 决定：**展示层取消 Long/Short 与 Buy/Sell 的区分，统一为 Yes / No**。
  - Buy = Long → **Yes**
  - Sell = Short → **No**
- 底层 `side: 'long' | 'short'`、order `side: 'buy' | 'sell'`、Supabase 列、PnL 公式**全部不动**，只换展示文案。

## 映射表（仅展示层）

| 现有 UI 文案 | 新 UI 文案 |
|---|---|
| Long / Buy / Long Position / Open Long | **Yes** |
| Short / Sell / Short Position / Open Short | **No** |
| Buy Long / Sell Short | **Buy Yes / Buy No** |
| Close Long / Close Short | **Close Yes / Close No** |
| Reduce Long / Reduce Short | **Reduce Yes / Reduce No** |
| Long Price / Short Price | **Yes Price / No Price** |
| Long Order / Short Order | **Yes Order / No Order** |

颜色保持：Yes = trading-green，No = trading-red。

## 改动清单

### 1. 词典层
`src/lib/tradingTerms.ts`
- `LONG: "Long"` → `LONG: "Yes"`
- `SHORT: "Short"` → `SHORT: "No"`
- `BUY: "Buy"` → `BUY: "Yes"`，`SELL: "Sell"` → `SELL: "No"`
- 新增 helper：
  ```ts
  export const sideLabel = (s: 'long'|'short') => s === 'long' ? 'Yes' : 'No';
  export const orderSideLabel = (s: 'buy'|'sell') => s === 'buy' ? 'Yes' : 'No';
  ```

### 2. Intent / Order utils
- `src/lib/positionIntent.ts` → `getIntentLabel`：`Buy Long / Sell Short` → `Buy Yes / Buy No`；`Close/Reduce Long/Short` → `Close/Reduce Yes/No`
- `src/lib/orderUtils.ts`：任何 `buy/sell`、`long/short` 渲染字符串走 helper

### 3. 交易表单 / 行情区 / 订单簿
- `TradeForm.tsx`、`DesktopTradeForm.tsx`、`OrderPreview.tsx`
- `OrderBook.tsx`、`DesktopOrderBook.tsx`：买卖盘表头 / 行内标签 Buy→Yes、Sell→No
- 双价行标题 `Long / Short` → `Yes / No`
- CTA 按钮：`Buy Long / Sell Short` → `Buy Yes / Buy No`

### 4. 持仓 / 订单 / 结算
- `PositionCard.tsx`、`DesktopPositionsPanel.tsx`
- `positions/{ClosePositionForm,ClosePositionDialog,ClosePositionDrawer,PositionDetailContent}.tsx`
- `pages/{Portfolio,PortfolioAirdrops,SettlementDetail,OrderPreview}.tsx`
- `AirdropPositionCard.tsx`
- 所有 `position.type === 'long' ? 'Long' : 'Short'`、`order.side === 'buy' ? 'Buy' : 'Sell'` → Yes/No

### 5. 分享 / Home / 卡片
- `share/SettlementPoster.tsx`、`settlement/SettlementShareCard.tsx`
- `EventCard.tsx`、`events/MarketListView.tsx`
- `home/HomeDiscover.tsx`、`home/feed/cards/PositionAlertCard.tsx`
- `BinaryEventHint.tsx`：tooltip 改为统一 Yes/No 心智表述

### 6. Style Guide / Playground
- `pages/StyleGuide.tsx`、`StyleGuide/sections/{CommonUI,Forms,MobileHome,Transparency}.tsx`
- `pages/CampaignStyleGuide/Playground.tsx`
- 所有 demo（含 Order/Trade 示例）同步 Yes/No

### 7. 透明度 / 审计 / 图表
- `hooks/useLiquidationAudit.ts`、`useTradeVerification.ts`：返回字段中的展示字符串改 Yes/No；列 key 不动
- `pages/TradingCharts.tsx`：图例 / 标题
- `services/tradingService.ts`：用户可见日志 / 描述字符串

### 8. 文案 / 内容
- `data/glossaryTerms.ts`：
  - "Long" → "Yes (Long)"，"Short" → "No (Short)"，新增 "Buy / Sell" 重定向到 Yes/No 词条
  - 解释里写明"OmenX 把买 Yes = 做多 Yes 市场、买 No = 做空 Yes 市场，所有方向均以 Yes 市场为基准"
  - 保留旧 anchor id（`#long`/`#short`/`#buy`/`#sell`）做 SEO 兼容
- `pages/TermsOfServicePage.tsx`：仅在描述用户操作处改 Yes/No，金融定义保留 long/short 学术词
- `index.css`：仅注释更新

## 不改动
- DB 列 `side`、`order.side`、TS 类型 `'long'|'short'` / `'buy'|'sell'`
- `positionIntent` canonical 逻辑、`isNoLabel` 转换、PnL 公式
- 双价 `long+short=1` 计算结构（仅替换列标签）
- 颜色 token（trading-green / trading-red 继续按 Yes/No 分配）

## 验证（1021×777）
1. /trade：CTA = "Buy Yes / Buy No"；双价行 = "Yes Price / No Price"；OrderBook 卖一买一对应 No/Yes 颜色一致
2. /trade Positions / Orders 列：Side 列全部 Yes/No
3. /portfolio、/portfolio/settlements、/portfolio/airdrops：列表 + drawer/dialog 全部 Yes/No
4. BinaryEventHint tooltip 一致 Yes/No
5. /resolved 分享卡片、SettlementPoster：Yes/No
6. /style-guide & /campaign/style-guide：demo 全部同步
7. Glossary：可搜到 Yes (Long) / No (Short)；`#long`/`#short`/`#buy`/`#sell` anchor 仍命中
8. 控制台 / Network 无报错；Supabase 写入仍是 `side: 'long'|'short'`、`order.side: 'buy'|'sell'`
9. 全仓 `rg -n "\b(Long|Short|Buy|Sell)\b" src` 复核，仅剩注释 / 类型定义 / Glossary 注解

## 记忆更新
- `mem://index.md` Core 加一条：
  > **Direction labels:** UI 全站统一使用 Yes / No；禁止再出现面向用户的 Long/Short/Buy/Sell。底层 `side` 与 `order.side` 字段保留 `'long'|'short'`、`'buy'|'sell'` 不变。
- 新建 `mem://design/yes-no-terminology.md`：映射表、双价结构、颜色语义、Glossary anchor 兼容、`sideLabel`/`orderSideLabel` helper 用法。
- 更新 `binary-event-ui-clarification`：tooltip 文案与 Yes/No 心智对齐。
