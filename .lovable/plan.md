

# 移除 Style A/C，仅保留 Style B

## 改动概要

社区投票选择了 Style B，移除 A 和 C 卡片样式。视图切换简化为 List / Grid 两种模式（Grid 固定使用 Style B）。

## 文件改动

### 1. `ViewToggle.tsx` — 简化 ViewMode
- `ViewMode` 改为 `"list" | "grid"`
- 移除 dropdown，改为简单的 List/Grid 两个按钮

### 2. `MarketGridView.tsx` — 只用 MarketCardB
- 移除 MarketCardA 和 MarketCardC 的 import
- 直接使用 `MarketCardB`，不再根据 viewMode 选择组件

### 3. `EventsPage.tsx`
- `getStoredView`: 非 `"list"` 一律返回 `"grid"`
- 移除 mobile 端的 A/B/C 切换按钮组，改为 List/Grid 切换（或直接固定 grid，因为移动端之前就是 grid）
- `effectiveView` 简化：mobile 固定 `"grid"`，desktop 按 view state
- 移除所有 `grid-a`/`grid-c` 引用

### 4. `FilterChips.tsx` — ViewMode 类型自动跟随

### 5. `HotShelf.tsx` — ViewMode 类型自动跟随

### 6. 删除文件
- `src/components/events/MarketCardA.tsx`
- `src/components/events/MarketCardC.tsx`

## 不改动
- `MarketCardB.tsx` — 不动
- `MarketListView.tsx` — 不动

