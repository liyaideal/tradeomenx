

## 看图诊断

截图里两个问题非常明确：

### 问题 1：Funding 文字溢出到右侧 OrderBook 区
图里 `Funding -0.01% / 28m` 的 `28m` 直接压在了右边 OrderBook 的 `Price` 列上面。

**根因**：当前 Stats 行 (`<div className="px-3 py-2 border-b">`) 在**左面板的 div 里**，但用了 `whitespace-nowrap`，当 4 个字段（Vol / OI / Funding / 28m）总宽度超过左面板宽度（屏宽 - 120px OrderBook = ~270px）时，文字会突破左面板边界（因为 `flex-1 min-w-0` 没生效或 overflow 没截住），视觉上"漂"到右栏 OrderBook 上方。

**实际原因更可能是**：左面板是 `flex-1 min-w-0`，但 Stats 行内部的 `gap-4 + text-[12px] + whitespace-nowrap` 内容超出后没有 `overflow-hidden`，导致内容溢出但容器没裁剪。

**修法**：
- Stats 行容器加 `overflow-hidden`，硬截
- 字号从 `text-[12px]` 降回 `text-[11px]`
- gap 从 `gap-4` 降到 `gap-3`
- Funding 和 28m 之间的 `/` 用更紧凑的写法（`gap-0.5` 而不是 `mx-1`）
- 实在不行加 `overflow-x-auto scrollbar-hide` 兜底（之前删掉了，现在加回来）

### 问题 2：Info 图标 vs MM 模块风格不统一

当前：
- Info：`w-7 h-7 rounded-full` 圆形 ghost，**透明背景，只有图标**
- MM：圆角矩形带背景色块（`bg-muted/50`），里面 `MM` label + `0.08%` 数值

视觉上一个像"裸图标"，一个像"数据徽章"，并排放在一起确实别扭。

**修法**：把 Info 也做成和 MM 同款的"徽章式"按钮：
- 容器：`rounded-md bg-muted/50 px-2.5 py-1` 同 MM 模块
- 内容：`Info` 图标 (`w-3 h-3`) + `Info` 文字（`text-[10px] uppercase tracking-wider text-muted-foreground` 同 MM 的 `MM` label 风格）
- 不需要数值，因为 Info 本身就是入口
- hover 态：`hover:bg-muted` 加深

这样两个模块视觉重量对齐，并排成一组"市场状态徽章"。

## 设计方案

### Tab 行右侧（MobileTradingLayout.tsx）

调整前后对比：
```
Before:    [ ⓘ ]   ┌MM     ┐
                   │0.08%  │
                   └───────┘

After:     ┌──────┐ ┌MM     ┐
           │ⓘ Info│ │0.08%  │
           └──────┘ └───────┘
```

Info 按钮新样式：
```tsx
<button className="flex items-center gap-1 rounded-md bg-muted/50 hover:bg-muted px-2.5 py-1 transition-colors">
  <Info className="w-3 h-3 text-muted-foreground" />
  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Info</span>
</button>
```

- 高度和 MM 模块一致（`py-1` + 内容高度）
- 圆角 `rounded-md` 一致
- 背景 `bg-muted/50` 一致
- label 字号/字重/颜色一致（参考 `MobileRiskIndicator` 里的 `MM` label）

需要先读一下 `MobileRiskIndicator` 确认它的真实 class，然后照抄风格。

### Stats 行（TradeOrder.tsx）防溢出

```tsx
<div className="px-3 py-2 border-b border-border/30 overflow-hidden">
  <div className="flex items-center gap-3 text-[11px] whitespace-nowrap overflow-x-auto scrollbar-hide">
    <span>Vol <span className="font-mono ml-0.5">$3.45M</span></span>
    <span>OI <span className="font-mono ml-0.5">$480K</span></span>
    <span>
      Funding <span className="font-mono text-trading-red ml-0.5">-0.01%</span>
      <span className="opacity-40 mx-0.5">/</span>
      <span className="font-mono">28m</span>
    </span>
  </div>
</div>
```

关键：**外层 `overflow-hidden`** + 内层 `overflow-x-auto scrollbar-hide` 双保险，绝不可能再溢出到 OrderBook。字号回退 `text-[11px]`、gap 回退 `gap-3`、`/` 间距压缩到 `mx-0.5`。

## 改动文件
1. `src/components/MobileTradingLayout.tsx` —— Info 按钮改成徽章式（参考 MM 模块样式）
2. `src/pages/TradeOrder.tsx` —— Stats 行加 `overflow-hidden` + 收紧间距防溢出

## 不改动
- TradeForm
- OrderBook
- EventInfoContent / Sheet 内容
- MobileRiskIndicator 本身
- 桌面端

## 一句话总结
**Stats 行加 `overflow-hidden` + 收紧间距彻底堵住溢出**，**Info 按钮升级成和 MM 一样的徽章式（带背景色块 + 小写 label）**，两个模块并排终于风格统一。

