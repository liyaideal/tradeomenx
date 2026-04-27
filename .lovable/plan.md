我建议 desktop 的 Order Preview 不再用移动端那种“单列长清单”，改成更适合弹窗的结构：信息分组 + 双列密度布局 + 底部重点结算卡。

## 建议方案

1. **顶部保留核心摘要**
   - Event 和 Option 放在最上方，但减少行高。
   - Side 用绿色/红色 badge 展示，避免占一整行。
   - Intent 也放成 badge，例如 `Close` / `Reduce` / `Open`，让用户一眼知道这是平仓还是开仓。

2. **中间改为双列字段网格**
   - 把现在逐行展示的字段改成 2-column compact grid。
   - 左右两列分别显示：
     - Trade: Type、Margin type、Leverage、Order Price
     - Notional: Order Cost、Traded notional、Opening notional、Margin required
   - 每个字段用小卡片/单元格，不再每行一条 border，这样弹窗高度会明显下降。

3. **风险/资金变化单独做重点区块**
   - 对 `reduce` / `close` 类型，突出展示：
     - Margin required: `0.00 USDC`
     - Released margin est.
     - Realized PnL est.
   - 对 `open` / `add` 类型，突出展示：
     - Margin required
     - Estimated Liq. Price
   - 这样用户不会把 `traded notional` 和 `opening notional` 混在一起。

4. **TP/SL 和 Liq Price 降级显示**
   - TP/SL 没设置时不需要占很大空间，可以显示在底部 secondary row。
   - `Estimated Liq. Price` 只有真正开仓/加仓时重点显示；纯平仓时可以弱化，因为平仓订单的 liq price 实际意义不大。

5. **底部按钮固定在弹窗内底部**
   - 按钮保持当前语义，例如 `Close Short - to win $10,000`。
   - 但减少上方字段高度后，整体不需要依赖滚动。

## 目标效果

```text
Order Preview                         X

XRP price on August 31, 2026?
$1.00 - $2.00        [Buy | Long] [Close]

Trade                         Notional
Type        Market            Order cost        149.42
Margin      Cross             Traded notional   1494.22
Leverage    10X               Opening notional  0.00
Price       0.1300            Margin required   0.00

Position impact
Released margin est.   +xxx.xx USDC
Realized PnL est.      +/−xx.xx USDC
Estimated Liq. Price   0.1183 USDC / or muted for close

[ Close Short - to win $10,000 ]
```

## Technical notes

- 修改位置：`src/pages/DesktopTrading.tsx` 的 desktop Order Preview Dialog。
- 不改 mobile `/order-preview` 页面，保持移动端长列表结构，因为 mobile 全页滚动是合理的。
- 保留现有 `orderIntent`、`displayCalculations`、`orderDetails` 的计算逻辑，只调整 desktop 弹窗渲染层。
- 为了避免再出现字段含义混淆，UI 文案会继续保留 `Traded notional` 和 `Opening notional` 的分离。
- 如果当前 intent 是 `reduce` 或 `close`，弹窗会显示资金释放/PnL 区块；如果是 `open` 或 `add`，显示开仓保证金/强平价区块。