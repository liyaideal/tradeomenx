

# 新建 MarketCardC：恢复截图版卡片样式

## 截图中的卡片布局

```text
┌─────────────────────────────────────┐
│ ☆  [Finance]  NEW             5mo  │
│ Japan Nikkei 225 closing price Q3  │
│                                     │
│ 24H CHG      24H VOL    TOTAL VOL  │  ← 灰色小标签
│ ▲ +7.44%     $12.4M     $193.9M    │  ← 数据值
│                                     │
│ View 6 Markets                  →  │  ← 底部导航
└─────────────────────────────────────┘
```

特点：没有 outcome 缩略表，只有 event 级别的 3 个统计字段（CHG / Vol / Total Vol）横排，底部 "View X Markets" CTA。

## 改动

### 1. 新建 `src/components/events/MarketCardC.tsx`
- 复用 MarketCard 的 props 接口（`market, isWatched, onToggleWatch, chgTimeframe`）
- 顶行：Star + Badge + NEW + 右侧 expiry
- 标题：`text-sm font-semibold line-clamp-2`
- 三列统计行：`24H CHG` / `24H VOL` / `TOTAL VOL`，标签用 `text-[10px] text-muted-foreground uppercase`，值用 `text-xs font-mono`，CHG 带颜色箭头
- 底行：`View {childCount} Markets` 左对齐（text-primary），ChevronRight 右对齐；单 market 事件显示 `Trade →`
- 背景渐变与 MarketCard 一致

### 2. 修改 `src/components/events/ViewToggle.tsx`
- `ViewMode` 类型加 `"grid-c"`
- 下拉菜单加 "Style C" 选项

### 3. 修改 `src/components/events/MarketGridView.tsx`
- `viewMode === "grid-c"` 时使用 `MarketCardC`

共 3 个文件，1 新建 2 修改。

