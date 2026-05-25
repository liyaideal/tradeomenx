# 二元事件 No→Yes 转换逻辑分析

## 1. 现状回顾

### 1.1 这条转换逻辑现在在哪
共有 4 处把"No 边交易"映射回"Yes 市场反向仓位"：

1. **`src/services/tradingService.ts:156-166`**（写库的真实路径）
   - `isNoOption = optionLabel === "no"` → `positionOptionLabel = "Yes"`、`positionSide` 翻转（buy→short, sell→long）、`canonicalClosePrice = 1 − price`。
2. **`src/lib/positionIntent.ts:40-50`** `toCanonicalOrder` — 预览/preview/intent 分类共用的规范化函数，同样把 No 选项映射到 Yes 轴。
3. **`src/lib/orderUtils.ts:33-40`** `orderToPosition` — Order → Position 转换时翻方向。
4. **`src/components/BinaryEventHint.tsx`** + 调用方（TradeForm / OrderPreview / DesktopTrading）— UI 文案"This opens a Yes position on the Yes market"。

### 1.2 这条逻辑当初存在的两个动机
- **A. 数据统一**：`yes_price + no_price = 1`，"Buy No" 与 "Sell Yes" 在数学上等价，把所有持仓压到 Yes 轴可以避免同一事件出现 2 条对冲性持仓、共享同一根 K 线/订单簿。
- **B. 文案补救**：旧 UI 是"Long/Short on 双价"，No 边做多还要在 Yes 轴显示 short，于是塞了 `BinaryEventHint` 解释"为什么你买 No 却显示成 short"。

## 2. 现在的 UI 模型已经变了

从截图和 `TradeForm` 看，交易界面已经不再有 Buy/Sell 切换，只有 **Yes / No 两个按钮**，CTA 是 `Buy Yes - to win $0` / `Buy No - to win $0`。也就是说：

- 用户视角里**只有"买 Yes"和"买 No"两种动作**，没有 short。
- 平仓走持仓卡片上的 Close/Reduce 入口，而不是反向 Sell。

在这个模型下，动机 B（文案补救）**完全失效**——继续把 Buy No 内部翻成 `option=Yes, side=short` 反而会让以后任何"按 option 维度展示"的地方都对不上号。

## 3. 两条路线对比

### 路线 X：**移除转换**（你倾向的方案）
- Buy Yes → `option_label="Yes", side="long", entry=yes_price`
- Buy No  → `option_label="No",  side="long", entry=no_price`
- PnL 公式不变：`(mark − entry) × size`，但 mark 直接用各自一侧的价格。
- 同一事件可以同时持有 Yes 仓和 No 仓（数学上对冲，但账上是两条独立记录）。

**优点**
- 持仓列表、Settlement、分享卡片、审计页直接显示 "No" 选项，跟用户操作 1:1 对应，不再需要 `BinaryEventHint` 解释"为什么变成 Yes"。
- `positionIntent` / `tradingService` 里的 No 分支可以删掉，代码大幅简化。
- 跟"单 market 事件也单独展示 Yes/No"的新展示逻辑天然契合。

**需要决定的副作用**
1. **保证金效率**：先 Buy Yes 100 再 Buy No 100，旧逻辑会自动减仓/释放保证金；新逻辑会变成两条独立仓位、各占保证金。
   - 选项 a：接受这个行为（最简单、最直观，跟 Polymarket 心智一致）。
   - 选项 b：保留"同事件 Yes vs No 自动 net"的撮合逻辑，但展示层仍各自为政——实现复杂度高，不推荐。
2. **结算**：事件结算时，赢的一边按 $1 兑付、输的一边归零（或按 mark 结算到 0/1）。当前 settlement 流程是按 Yes 轴 PnL 算的，需要扩展为按各自 option 结算。
3. **K 线 / 订单簿**：依然按 Yes 轴展示一条主图即可，No 边的 entry/mark 在持仓卡片里直接读 `1 − yes`。无需重做行情层。
4. **历史仓位**：Supabase 里已有的旧记录全是 `option_label="Yes"`。需要 **保留历史不动**，只对新开仓应用新规则；展示层兼容即可。

### 路线 Y：**保留转换**
- 只改文案（`BinaryEventHint` 改成"Buying No is economically equivalent to shorting Yes…"）。
- 代码零改动，但用户长期会困惑："我明明买的 No，为什么持仓里写的是 Yes / Short？"——尤其在 Yes/No 改造后，这种割裂感比以前更明显。

## 4. 我的推荐

**走路线 X，且采用副作用选项 1a（不做自动 net）**。理由：

- 跟你这次改造的整体方向一致：UI 用户心智 = 数据存储心智 = Yes/No 各自独立。
- 删除 4 处转换 + `BinaryEventHint` 后，`tradingService` 里"Buy No 自动找 Yes-short 对手仓"的复杂分支可以整段删除，bug 面积大幅缩小。
- "同事件持 Yes+No 双仓"在预测市场是合法且常见的策略（套利、对冲信息差），不该被代码偷偷合并。
- 真要做保证金优化，可以放到后续"Portfolio Margin"专项里，跟基础交易语义解耦。

## 5. 落地范围（路线 X，待你确认后执行）

### 5.1 代码改动（仅展示 + 写库逻辑，PnL/leverage/margin 公式不动）

| 文件 | 改动 |
|---|---|
| `src/services/tradingService.ts` | 删除 156–166 行的 No→Yes 翻转；`positionOptionLabel`、`positionSide`、`canonicalClosePrice` 直接用原值；`oppositeSide` 查询保持现状（仍处理同 option 内的 reduce/close）。 |
| `src/lib/positionIntent.ts` | `toCanonicalOrder` 改成"identity"——不再把 No 翻成 Yes 轴；`canonical.optionLabel` 保留原 label；`canonical.price` 直接用 clickedPrice；`getIntentLabel` 文案改成 `Reduce No / Close No` 时取自身 option。 |
| `src/lib/orderUtils.ts` | `orderToPosition` 去掉 `isNo` 翻转，`positionOption = order.option`、`positionType = order.type === 'buy' ? 'long' : 'short'`。 |
| `src/components/BinaryEventHint.tsx` | 整个组件删除；所有 import / 渲染点（TradeForm、OrderPreview、DesktopTrading）一并清理。 |
| `src/components/TradeForm.tsx` / `DesktopTradeForm.tsx` / `pages/OrderPreview.tsx` / `pages/DesktopTrading.tsx` | 移除 `showBinaryHint` 相关 state 与 UI；CTA 文案仍然根据当前选中 option 取 `Buy Yes / Buy No`（已是现状）。 |
| 持仓/订单/结算/分享卡片 | 展示层无需特殊处理 — 直接读 `option_label` 即可；之前依赖 "binary 事件强制显示 Yes" 的分支需要删掉。 |

### 5.2 不动的部分（守住底线）

- TS 类型 `side: 'long'|'short'`、`order.side: 'buy'|'sell'` — 不变。
- Supabase schema — 不变。
- PnL/notional/margin 公式（`mem://technical/pnl-formula-canonical`）— 不变。
- 颜色映射 Yes=green / No=red — 不变。
- 双价结构 `noPrice = 1 − yesPrice` — 不变，只是不再用它把 No 仓"翻译"成 Yes 轴写库。
- 历史持仓数据 — 不做迁移，老仓位继续按原 `option_label="Yes"` 展示直到结算。

### 5.3 记忆与文档

- 新建 `mem://features/binary-event-no-as-native-position.md`，记录"No 选项直接开 No 仓、不再做 Yes 轴归一化"的新规则。
- 更新 `mem://index.md` Core 里那条"Binary Events: 'Yes-only' model. Convert 'No Long' → 'Yes Short'…" 改为新表述。
- 更新 `mem://design/yes-no-terminology.md` 的"Why"段落（去掉"unify under Yes outcome"的解释）。
- `docs/changelog/` 新增 `2026-05-25-binary-no-native-positions.md`，作为这次方向改造的延伸条目。

### 5.4 验证清单
- [ ] Buy No 后 `/portfolio` 显示一条 `option=No, side=long, entry=no_price` 的持仓。
- [ ] 同事件先 Buy Yes 再 Buy No，得到两条独立持仓，各自占保证金。
- [ ] No 仓的 PnL 在 no_price 上涨时为正、下跌时为负（用户最初困惑的场景被修复）。
- [ ] 同 option 内的 reduce/close 仍然走 `tradingService` 的 oppositeSide 分支（Buy No 100 → 然后 Sell No 60 = reduce 60，剩 40）。
- [ ] Settlement / 分享卡片 / 审计页（TradeVerification、FundingRateAudit）正确显示 No 选项，不再出现"Buy No 显示成 Yes/Short"。
- [ ] 旧的 Yes-only 历史仓位仍能正常展示与结算。

## 6. 需要你拍板的两个问题

1. **同事件 Yes + No 双持仓**：接受"两条独立、各占保证金"（推荐），还是要做自动 net？
2. **历史持仓**：保持现状（推荐），还是要写迁移脚本把旧的"Yes-short（实际来自 Buy No）"反翻成"No-long"？反翻会丢失原始 trade 上下文，风险较高。

确认后我会按 §5 执行。
