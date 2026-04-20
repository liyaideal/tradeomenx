

## 看图诊断

当前 `/trade/order` 顶部从上到下：
1. **Tab 行**：`Charts | Trade` + 右边 `MM 0.08%` 盒子
2. **Stats 行**：`Vol $3.45M  OI $480K  Funding -0.01  ⓘ` ← 4 个内容挤一行还要带 Info 按钮，注定截断

用户提议：**把 Info 按钮移到 MM 旁边的 Tab 行**，让 Stats 行只放 3 个数据字段，空间立刻宽松。

## 这个思路对不对？

**完全对**。因为：
- Tab 行右侧只有一个 `MM 0.08%` 小盒子，**右侧还有空间**容纳一个图标按钮
- Stats 行少了 Info 按钮的占位（约 28px + gap），3 个字段（Vol / OI / Funding+Next）每个能拿到 ~110px，足够完整显示
- Info 按钮和 MM 都是"市场状态/元信息"，**语义上就该在一起**（顶部辅助信息区），下面的 Stats 是"实时市场数据"，Trade form 是"操作区"——三层职责清晰
- 这是大多数专业交易所（Hyperliquid / dYdX）的标准做法：顶部一行放 symbol meta + info icon，下面一行放 stats，再下面才是下单区

## 设计方案

### Tab 行（MobileTradingLayout.tsx）右侧布局
```
                                 [ ⓘ ]  [MM 0.08%]
```
- Info 按钮放在 MM 盒子**左边**（紧贴 MM）
- 两者之间 `gap-2`
- Info 按钮样式：`w-7 h-7 rounded-full` ghost 风格，hover 时浅灰底
- Info 图标 `w-3.5 h-3.5`，颜色 `text-muted-foreground`

### Stats 行（TradeOrder.tsx）简化
```
Vol $3.45M    OI $480K    Funding -0.01% / 28m
```
- 移除右侧 Info 按钮和 SheetTrigger
- 3 个字段全宽展开，`gap-4` 间距更舒展
- 字号可以从 `text-[11px]` 提到 `text-[12px]`，可读性更好
- 不再需要 `overflow-x-auto` 兜底（空间够了）
- 整体保持 `border-b` 分隔线

### 关键技术点：Info Sheet 触发位置迁移

Sheet 组件本身在 `TradeOrder.tsx` 里（包含 `EventInfoContent`），但触发器要放到 `MobileTradingLayout.tsx` 的 Tab 行——这意味着：

**两个选项**：
- **A**：把整个 Sheet（含 SheetTrigger）下沉到 `MobileTradingLayout.tsx`，让所有用 layout 的页面都能用（更通用，但 layout 需要知道 selectedEvent—它本来就有）
- **B**：在 `MobileTradingLayout` 里只暴露一个回调 `onInfoClick`，由页面注册回调；layout 渲染按钮，页面控制 Sheet 开关状态

**推荐 A**：因为 `MobileTradingLayout` 已经持有 `selectedEvent`，直接渲染 `EventInfoContent` 最干净，TradeOrder.tsx 那边可以彻底移除 Sheet 逻辑。其他用 layout 的页面（如 TradingCharts）也能复用这个 Info 入口，一致性更好。

## 具体改动

### 1. `src/components/MobileTradingLayout.tsx`
- Tab 行右侧：在 `MobileRiskIndicator` 左侧加一个 `Sheet` + `SheetTrigger`（圆形 Info 按钮）
- Sheet 内容：渲染 `EventInfoContent` with `selectedEvent`
- 顺序：`[Info Sheet 按钮] [MM 盒子]`

### 2. `src/pages/TradeOrder.tsx`
- 删除当前 Stats 行里的 `Sheet / SheetTrigger / SheetContent / EventInfoContent` 相关代码（约 102-138 行）
- 删除未用到的 imports：`Info`、`Sheet*`、`EventInfoContent`
- Stats 行简化为：3 个字段 inline + `gap-4` + `text-[12px]`，全宽 div，无右侧按钮

### 3. 视觉示意

```
┌──────────────────────────────────────────────────┐
│ Charts  Trade                       ⓘ   MM 0.08% │ ← Tab 行
├──────────────────────────────────────────────────┤
│ Vol $3.45M    OI $480K    Funding -0.01% / 28m   │ ← Stats 行（无截断）
├──────────────────────────────────────────────────┤
│  [   Buy 0.2500   ]  [   Sell 0.7500   ]         │ ← TradeForm
│  ...                                             │
```

## 不改动
- TradeForm Buy/Sell 按钮
- OrderBook
- `EventInfoContent` 组件本身
- 桌面端布局
- MobileRiskIndicator 内部样式

## 一句话总结
**把 Info 按钮上提到 MM 旁边**，Stats 行减负为 3 个字段全宽展示，彻底解决截断；语义上 Info + MM 同属"市场状态辅助区"，下面 Stats 是"实时数据区"，层次更清晰。

