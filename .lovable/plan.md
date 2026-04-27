我看明白了，而且你指出的是当前实现里最关键的漏洞：现在 UI/preview/service 虽然已经区分了 reduce/close，但仍然把用户输入的 amount、ui_price、quantity、margin 绑得太死，导致“成交侧名义本金”和“新增风险保证金”没有被彻底拆开。

## 要修正的核心原则

下单时必须分成两套概念：

```text
traded notional
= 用户实际点击侧成交的 qty * ui_price
= 用于成交金额、手续费、成交记录展示

opening risk notional
= 只有新增净风险的 slice 才计算
= 用于 opening IM 校验
```

风险分类必须先发生：

```text
canonicalize -> q_before / dq_req / q_after -> classify -> margin
```

而不是先用：

```text
required_IM = qty * ui_price / leverage
```

## 当前代码问题

我已检查当前实现，问题主要在这些点：

1. `TradeForm.tsx` 和 `DesktopTrading.tsx` 的 `orderCalculations` 仍然把 `amount` 当作 margin 输入，再推出 `quantity = amount * leverage / ui_price`。
2. `positionIntent.ts` 的分类可以识别 reduce/close，但 `blocked-cross-zero` 目前直接 `incrementalMargin: 0`，没有表达 cross-zero 里的 reduce slice 和 increase remainder。
3. `OrderPreview.tsx` 和 desktop dialog 传给 `executeTrade` 的仍然是 `rawOrderCalculations.marginRequired`，对 reduce/close/cross-zero 的边界容易再次混淆。
4. `tradingService.ts` 现在在 opposite position 分支里强制要求 `validated.margin === 0`，这适合“禁止 cross-zero”的当前产品策略，但服务层仍缺少明确的 canonical risk slice 计算，容易和 UI 不一致。
5. `Close & Continue` 当前用 `existingQty * currentPrice / leverage` 回填 amount，这在 BUY NO 平 YES Long 的例子里会用 0.90 计算 amount，不符合“按 qty 平仓，opening IM = 0”的模型。

## 修复方案

### 1. 重构 `positionIntent.ts` 为 risk-slice 模型

保留当前产品策略：cross-zero 不允许一笔完成，用户必须先 close 到 0。

但分类结果要更完整：

```ts
kind:
  | "open"
  | "add"
  | "reduce"
  | "close"
  | "blocked-cross-zero"

risk fields:
  qBefore
  dqReq
  qAfter
  reduceQty
  closeQty
  increaseQty
  tradedNotional
  openingNotional
  incrementalMargin
  releasedMargin
  realizedPnl
```

计算规则：

```text
PURE_RISK_REDUCING / FLAT_CLOSE:
  openingNotional = 0
  incrementalMargin = 0
  releasedMargin = proportional old margin

BLOCKED_CROSS_ZERO:
  reduceQty = existingQty
  increaseQty = requestedQty - existingQty
  openingNotional = increaseQty * canonical increase price
  incrementalMargin = openingNotional / leverage
  但 UI/service 阻止执行，只用于提示说明

PURE_RISK_INCREASING:
  openingNotional = requestedQty * canonical opening price
  incrementalMargin = openingNotional / leverage
```

### 2. 修正表单计算：拆开 `tradedNotional` 和 `marginRequired`

移动端 `TradeForm.tsx` 和桌面端 `DesktopTrading.tsx`：

- `Notional val.` 显示用户点击侧成交名义本金：`qty * ui_price`。
- `Margin req.` 显示 `orderIntent.incrementalMargin`。
- `Total` 对 open/add 是 `incrementalMargin + fee`。
- `Total` 对 reduce/close 是只扣手续费，或显示 `Fee only`。
- reduce/close 的下单 quantity 必须以用户要平的 shares 为核心，而不是用 opening margin 反推。

短期最小改动：保持现有 amount 输入文案不大改，但内部改成：

```text
open/add: amount 仍代表 opening margin
reduce/close: amount 用来换算 close qty，但 marginRequired 强制来自 intent = 0
```

同时修正 `Close & Continue`：

```text
目标：把 requestedQty 设置成 existingQty
amount 回填 = existingQty * ui_price / leverage
但 preview/service 发送 margin = 0，因为 intent 是 close
```

也就是说，amount 只是为了复用当前 UI 的数量推导，不再代表 reduce/close 的 opening margin。

### 3. Preview 只传“意图后的 margin”，不传 raw opening margin

移动端 `OrderPreview.tsx`：

- 确认前重新 classify。
- `tradeData.margin` 改成 `orderIntent.incrementalMargin`。
- `effectiveTotalCost` 改为：
  - open/add: `incrementalMargin + fee`
  - reduce/close: `fee`
  - blocked-cross-zero: blocked
- 订单明细增加：
  - `Traded notional`
  - `Opening notional`
  - `Released margin`（reduce/close 时）
  - `Realized PnL est.`（reduce/close 时）

桌面 preview dialog 同步同样逻辑。

### 4. Service 层做同一套安全校验

`tradingService.ts` 需要不再信任前端传来的 margin，而是在服务层根据数据库 open position 重新 canonicalize 并分类：

- 找 canonical same-side / opposite-side open position。
- 如果 opposite-side 且 `quantity <= existingSize`：
  - 只允许 `validated.margin === 0` 或直接忽略前端 margin，以服务端计算为准。
  - reduce/close，释放 margin + realized PnL - fee。
- 如果 opposite-side 且 `quantity > existingSize`：
  - 继续阻止：`Close existing position first before opening the opposite side.`
  - 不创建有效 position。
- 如果 no opposite position：
  - 用 canonical opening price 计算 expected opening margin。
  - 校验 `validated.margin` 与 expected opening margin 一致。

重点：service 层也要明确区分：

```text
trade.price / trade.amount / trade.quantity = 成交记录
position.margin = 仅新增/剩余风险保证金
```

### 5. 修正成交记录与余额扣减

- `trades.margin` 对 reduce/close 写 0。
- `trades.amount` 继续记录点击侧成交 notional 或当前 UI 的 order cost，需要统一命名含义。
- `balanceDelta`：
  - open/add: `-(incrementalMargin + fee)`
  - reduce/close: `releasedMargin + realizedPnl - fee`
- 避免 preview 先用 raw margin 扣一次、service 又按 reduce/close 返回余额 delta 导致重复或错误。

### 6. 增加针对你这个例子的回归验证

重点覆盖：

```text
已有 YES Long 100 @ 0.10, 10x, margin 1U
用户 BUY NO 100 @ 0.90
canonical = SELL YES 100 @ 0.10
kind = close
incrementalMargin = 0
releasedMargin ≈ 1U
realizedPnl = 0
balanceDelta ≈ +1U - fee
```

以及：

```text
BUY NO 50 @ 0.90 -> reduce, incrementalMargin 0
BUY NO 100 @ 0.90 -> close, incrementalMargin 0
BUY NO 150 @ 0.90 -> blocked-cross-zero, requires close first
空仓 BUY NO 100 @ 0.90 -> open short YES, margin based on canonical/opening risk model
```

## Expected result

修完后：

- 用户平仓不会再因为“没有 9U 可用资金”被阻止。
- UI 的 Notional 仍可展示 90U traded notional。
- Margin req. 会正确显示 0U。
- Preview 和实际执行都会用同一套 intent/risk-slice 逻辑。
- 反向穿零仍然被禁止，只能先 close 到 0，再开反方向仓位。