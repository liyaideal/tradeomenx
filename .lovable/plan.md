## 全平台 Long/Short、Buy/Sell 残留扫描结果

经过全量扫描，过去这轮已经覆盖了 ~37 个文件。剩余出现可以分成 3 类:**A 类（必须改 / 上轮漏掉的用户可见文案）**

1. `src/pages/CampaignStyleGuide/Playground.tsx:128` — 卡片标签仍写死 `Long`，应改为 `Yes`。
2. `src/components/transparency/TradeVerification.tsx:65, 128` — 链上交易验证页把 `side === 'buy'` 渲染为 `LONG / SHORT`，应改为 `YES / NO`。
3. `src/components/transparency/FundingRateAudit.tsx:92, 119, 239, 252` — 资金费率审计页:
   - `pos.side.toUpperCase()` 直接输出 `LONG / SHORT` → 改用 `sideLabel()` 输出 `YES / NO`。
   - 第 252 行 `"Longs pay Shorts" / "Shorts pay Longs"` → 改为 `"Yes pays No" / "No pays Yes"`。
4. `src/components/DesktopOrderBook.tsx:542-556`（注释 `Buy/Sell Ratio` 不重要，但 UI 上的 `B / S` 角标和文案语义仍是 Buy/Sell 方向比例）— 改为 `Y / N`，tooltip/注释顺带改为 `Yes/No Ratio`，保持绿/红配色不变。

**B 类（特例 — 建议保留，请确认）**

5. `src/components/hedge/HedgeLiveExample.tsx`、`HedgeKeyRules.tsx`、`HedgeSocialProof.tsx` — 这是 Polymarket 对冲落地页：
   - 左侧卡片 `YES (long)` 描述的是用户在 **Polymarket** 持有的多头仓位（外部平台术语）。
   - 右侧 `SHORT` 描述的是 OmenX 上配对的对冲方向。
   - 文案语义是"Polymarket 多头 ↔ OmenX 空头"的对冲叙事，如果整页改为 Yes/No，会让"为什么需要对冲"的逻辑读不通。
   - **建议保留**，因为这是跨平台对比内容；如需统一，需要重写整段叙事。
6. `src/data/glossaryTerms.ts:75, 126, 141` — 词条 `Yes / No (Long / Short)` 与 Order Book 解释里的 `Buy orders (bids) / sell orders (asks)`。这是教育性术语映射，**建议保留**（用户需要理解底层等价关系）。
7. `src/pages/TermsOfServicePage.tsx:27` — `"Yes corresponds to a long position and No to a short position"`，法律文档里的术语映射说明，**建议保留**。
8. `src/components/withdraw/SellToFiat.tsx` — `Sell USDC` 指的是法币出金里的"卖出 USDC"，与交易方向无关，**保留**。
9. `src/components/OrderBook.tsx` 内 `Asks (Sell orders) / Bids (Buy orders)` 都是代码注释，不影响 UI。

**C 类（纯代码 — 不动）**

- `tradingTerms.ts / positionIntent.ts / orderUtils.ts / stores/* / hooks/*` 里的 `'long' | 'short'`、`'buy' | 'sell'` 都是底层数据模型字段，必须保留。
- 所有 `// comment` 形式的 Buy/Sell/Long/Short 都是开发者注释，不影响 UI。
- `month: "short"`、`for as long as`、`long titles` 等是英文常用词，无关。

---

### 本次拟执行的改动（仅 A 类）

| 文件 | 改动 |
|---|---|
| `src/pages/CampaignStyleGuide/Playground.tsx` | `Long` 标签 → `Yes` |
| `src/components/transparency/TradeVerification.tsx` | `LONG / SHORT` → `YES / NO`（2 处） |
| `src/components/transparency/FundingRateAudit.tsx` | `LONG / SHORT` → `YES / NO`（3 处）；`Longs pay Shorts` → `Yes pays No`（1 处） |
| `src/components/DesktopOrderBook.tsx` | `B / S` 角标 → `Y / N`，颜色保持 green/red |

不动 B 类与 C 类。

---

### 请确认

- B 类 5（hedge 落地页保留 Polymarket long vs OmenX short 的对比叙事）是否同意保留？
- B 类 6/7（glossary 与 ToS 中的术语映射说明）是否同意保留？

确认后我会在 build 模式下一次性改完 A 类 4 个文件，并 rg 复查残留。