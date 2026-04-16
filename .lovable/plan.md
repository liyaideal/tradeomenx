

# 新建 Style A 卡片

## 参考图布局分析

参考图的布局特点（从上到下）：
1. **顶行**：Star + NEW badge + Category badge
2. **标题行**：事件名称 + 10X leverage badge + 外链图标
3. **三列数据行**：TOP MARKET | 24H CHG | PRICE — 带背景容器，列间竖线分隔
4. **View N Markets** 链接（居中）
5. **底栏**：Total Vol 左 + Expires 右，带独立背景条

## 新建文件

`src/components/events/MarketCardA.tsx`

### 布局结构

```text
┌─────────────────────────────────────────┐
│ ☆  NEW   Crypto                    4mo  │  顶行
│                                         │
│ XRP price on August 31, 2026?    10X 🔗 │  标题行
│                                         │
│ ┌───────────┬──────────┬──────────┐     │
│ │ TOP MARKET│ 24H CHG  │  PRICE   │     │  三列数据 (bg-white/[0.04])
│ │ Above $3.0│  ↓ -5%   │  0.65    │     │
│ └───────────┴──────────┴──────────┘     │
│         View 7 Markets >                │  链接行
│                                         │
│ ┌ Total Vol. $100.5M    Expires 4mo > ┐ │  底栏 (独立背景条)
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 细节

- 三列数据区：`bg-white/[0.04] rounded-lg`，列间用 `border-r border-border/20` 分隔
- TOP MARKET 显示 `topMarket.label`（无 children 时显示 CHG）
- 24H CHG 列标题跟随 `chgTimeframe`，显示 `TF_LABELS[chgTimeframe]`
- PRICE 显示 topMarket 对应 child 的 `markPrice`
- "View N Markets >" 仅 children > 1 时显示，否则隐藏
- 底栏用 `bg-white/[0.03] rounded-lg` 独立背景条
- 10X badge: `bg-trading-yellow/20 text-trading-yellow text-[10px] font-bold px-1 rounded`（mock leverage）
- 与 B/C 共享相同的 props 接口和 category 背景图

## 修改文件

1. **ViewToggle.tsx**: `ViewMode` 加回 `"grid-a"`，dropdown 加 Style A 选项
2. **MarketGridView.tsx**: 导入 `MarketCardA`，`viewMode === "grid-a"` 时使用
3. **EventsPage.tsx**: 
   - `getStoredView` 支持 `"grid-a"`
   - 移动端视图切换按钮加 A 选项
   - `effectiveView` 支持 `grid-a`

## 不改动

- `MarketCardB.tsx` — 不动
- `MarketCardC.tsx` — 不动

