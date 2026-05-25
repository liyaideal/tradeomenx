# Mobile 端 binary 别名（sideLabels）漏改清单与修复

## 背景

`TradingEvent.sideLabels` + `getDisplayOptionLabel` + `UnifiedPosition.displayOption` 这套别名基础设施已经就位。Desktop 大部分文案已切换到别名（如 "Alex Pereira" 替代 "Yes"），但 **mobile 端**仍有多处硬编码 `Yes` / `No`，最显眼的是 /trade/order 的 **Buy Yes 提交按钮**。下面是排查后的全部漏网之鱼，以及统一的修复策略。

## 修复策略

按"显示语义"分两档：

- **A. 方向标签同时也是 option 标识**（如 binary 单 market 的 Yes/No 切换按钮、提交按钮、Mark 价旁边的方向 chip、订单簿方向）→ **替换成别名**，用 `binaryMode.yesLabel/noLabel` 或 `sideLabels.yes/no`，无别名时回退 "Yes" / "No"。
- **B. 已经独立展示了 option 名（`displayOption`）的卡片，再额外挂一个"Yes/No"侧别 chip**（PositionCard / OrderCard / AirdropPositionCard / Portfolio / HomeDiscover / PositionAlertCard）→ 当 `displayOption !== option && (option === "Yes" || option === "No")` 时（即已经渲染了别名作为 option 名），**隐藏冗余侧别 chip**；其他情况保持原 "Yes"/"No"。

## 具体改动点（mobile 优先）

### A. 文案替换为别名

| 文件 | 行 | 现状 | 改为 |
|---|---|---|---|
| `src/components/TradeForm.tsx` | 520 | `getIntentLabel(orderIntent, side)` 渲染 "Buy Yes" | 传入 `sideLabels`，在 getIntentLabel 内或在按钮处对 `intent.canonical.optionLabel` 走 `getDisplayOptionLabel` |
| `src/pages/OrderPreview.tsx` | 79, 227 | "Side: Yes/No"、"Buy Yes" 提交按钮 | 同上，用 `sideLabels` 翻译 |
| `src/pages/TradingCharts.tsx` | 119 | Mark 价旁的方向 chip 硬编码 Yes/No | 取 `selectedEvent.sideLabels` 翻译 |
| `src/pages/TradingCharts.tsx` | 302, 315 | 图例文字 "Yes"/"No" | 同上 |

`getIntentLabel` 签名扩展为可选第三参 `sideLabels?: { yes; no }`，binary 单 market 时把 canonical.optionLabel("Yes"/"No") 映射为别名；非 binary 不变。

### B. 隐藏冗余侧别 chip（mobile 列表）

下列文件里 `{type === "long" ? "Yes" : "No"}` 形式的小 chip，旁边已经有 `{displayOption}` 在显示别名（如 "Alex Pereira"）。对 binary 单 market 这是 100% 重复信息：

- `src/components/PositionCard.tsx` (L208, L339)
- `src/components/OrderCard.tsx` (L85, L138, L185)
- `src/components/AirdropPositionCard.tsx` (L93) — `counterSide`
- `src/components/positions/ClosePositionDialog.tsx` (L45) — 描述文案 "Yes/No"
- `src/pages/Portfolio.tsx` (L482, L625, L788, L928) — mobile sections
- `src/components/home/HomeDiscover.tsx` (L143)
- `src/components/home/feed/cards/PositionAlertCard.tsx` (L53)

实现：在这些组件里加判定 `const isBinaryAlias = displayOption !== option && (option.toLowerCase() === "yes" || option.toLowerCase() === "no");`，`isBinaryAlias` 为 true 时不渲染侧别 chip / 文本片段，否则保持当前 "Yes"/"No"。ClosePositionDialog 的 description 改成同样的条件渲染。

### C. 不动

- `glossaryTerms.ts`、`StyleGuide.tsx`、`StyleGuide/sections/*` — 说明文档与 demo，保留字面 "Yes/No" 才对。
- 各种 `toast` description 里 "position opened for ${displayOption}" 已经在用 displayOption，"Yes"/"No" 是方向语义，可以保留。
- `SettlementShareCard` / `SettlementPoster` — 已用 `sideLabels` 三元，不动。

## 文档同步

- **DESIGN.md** §Single-Market Binary Trade Toggle：追加"别名传播规则"段落——所有展示"方向"的 UI（按钮、chip、表格列）在 binary 单 market 且事件配有 `sideLabels` 时必须显示别名而非 Yes/No；当外层已展示 `displayOption` 别名时，**禁止**再挂冗余 Yes/No 侧别 chip。
- **Memory** `mem://design/single-market-binary-ui`：把上述规则追加进去。

## 不动的地方

- `eventUtils.ts` / `positionIntent.ts` 的核心数据流不动，只对 `getIntentLabel` 增加可选 `sideLabels` 参数。
- Desktop 已改过的部分不重做。
- 持仓 / 订单的底层 type === "long" / "short" 语义不变，只动展示层。
