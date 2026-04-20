

## 问题
当前 meta bar 视觉问题：
1. **像数据日志而非 UI**：纯文本 `Vol $3.45M · OI $480K · Funding -0.01% · Next 28m` 平铺直叙，没有视觉层级
2. **标签和数值混在一起**：`Vol` 和 `$3.45M` 字号颜色差异太弱
3. **分隔点 `·` 太密**：4 个字段 + 3 个点挤在一行，扫读累
4. **Funding 红色突兀**：在一片灰色文本里跳出来，但没有任何容器收拢
5. **Info 按钮像链接**：和左边数据完全脱节，右上角孤零零

## 设计思路

参考 Binance/Hyperliquid/dYdX 等专业交易所的 market stats bar 设计：
- **标签 + 数值垂直堆叠**（小标签灰色在上，数值粗体在下）
- **字段间用细竖线分隔**（不是点）
- **关键字段加微弱背景色块**（如 Funding 用淡红底）
- **Info 按钮用 ghost 风格小按钮**，和数据条形成节奏

## 推荐方案：紧凑型 Stats Strip

视觉布局（移动端 390px 宽度内）：

```
┌─────────────────────────────────────────────────┐
│ VOL      OI       FUNDING    NEXT     ┌────┐    │
│ $3.45M │ $480K  │ -0.01%   │ 28m     │ ⓘ  │    │
│                  (淡红底)              └────┘    │
└─────────────────────────────────────────────────┘
```

具体细节：
- **每个字段两行结构**：
  - 上：`text-[9px] text-muted-foreground/60 uppercase tracking-wider`（如 `VOL`、`OI`、`FUNDING`、`NEXT`）
  - 下：`text-[11px] font-mono font-medium text-foreground`（数值）
- **字段间分隔**：用 `divide-x divide-border/30` 替代 `·`，更干净
- **Funding 字段特殊处理**：负数时数值加 `text-trading-red`，背景加 `bg-trading-red/5 rounded`，让它视觉成块
- **Info 按钮**：改成 `rounded-md bg-muted/40 px-2 py-1` 的小 ghost 按钮，图标 + "Info" 文字，和左边数据形成"内容 + 操作"的节奏感
- **整体容器**：`px-3 py-2`（从 `py-1.5` 微增），`bg-muted/20` 淡背景把整条 strip 收拢成一个视觉单元，下面 `border-b border-border/30` 保留
- **响应式**：移动端 4 个字段平均分布 `flex-1`，每个 `min-w-0` 防止挤压；Info 按钮 `flex-shrink-0`

## 具体改动

**改动文件**：`src/pages/TradeOrder.tsx`（第 102-132 行的 Market Meta Bar 区块）

替换当前单行 inline 文本为结构化的 4-cell stats strip + Info 按钮：

```tsx
<div className="px-3 py-2 border-b border-border/30 bg-muted/20">
  <div className="flex items-stretch gap-0">
    {/* 4 个数据 cell, divide-x 分隔 */}
    <div className="flex-1 divide-x divide-border/30 flex">
      <Stat label="VOL" value="$3.45M" />
      <Stat label="OI" value="$480K" />
      <Stat label="FUNDING" value="-0.01%" tone="negative" highlight />
      <Stat label="NEXT" value="28m" />
    </div>
    {/* Info 按钮 */}
    <SheetTrigger>
      <button className="ml-2 flex items-center gap-1 px-2 rounded-md bg-muted/50 hover:bg-muted text-[10px]">
        <ExternalLink className="w-3 h-3" /> Info
      </button>
    </SheetTrigger>
  </div>
</div>
```

`Stat` 是个内联小组件（同文件内定义，不抽组件文件），渲染上下两行：标签 uppercase 灰色、数值粗体 mono；`highlight` 时加淡背景色。

## 不改动
- Trade form Buy/Sell 按钮
- OrderBook
- Event Info Sheet 内容
- 桌面端布局

## 一句话总结
**把"数据日志式"的纯文本一行，改成"4 cell + 竖线分隔 + 标签数值上下堆叠 + Funding 淡红高亮 + Info ghost 按钮"的专业交易所 stats strip 风格**，立刻有设计感。

