# Resolved 页筛选区整理

## 背景

当前 `/resolved` 页面的筛选/切换有两处入口，存在冗余：

1. 页面标题下方独立一行的 `ResolvedViewToggle`（All Resolved / My Settled）
2. 下方的 `ResolvedFilters`（Time Range / Search / Category / Sort）

同时列表已改为按结算时间分组的卡片网格（This Week / Earlier This Month / MMMM YYYY），`Time Range` 与 `Sort by Settlement Time` 已经和分组逻辑重复。

## 目标

- 把 All Resolved / My Settled 切换收编进筛选区，作为筛选区的"主视图"控件，桌面与移动端一致。
- 精简过时筛选项，让筛选区只保留真正有用的维度。
- 不改动数据层（`useResolvedEvents`、grouping、卡片）行为。

## 改动

### 1. 桌面筛选栏（`ResolvedFilters`）

新布局（单行 + 自适应换行）：

```text
[ All Resolved | My Settled ]   Search: [____]   Category: [All ▾]
```

- 左侧：视图切换 Segmented（沿用 `ResolvedViewToggle` 的样式与逻辑，但作为筛选栏的第一个控件）。
- 中部：`Search`（保留）。
- 右侧：`Category`（保留）。

删除项：

- `Time Range`（All / This Month / This Quarter / This Year）——与分组标题（This Week / Earlier This Month / MMMM YYYY）信息重复。
- `Sort By`（Settlement / Volume / Name）——网格已严格按结算时间倒序分组，提供其他排序会破坏分组结构；如果之后想加，再单独评估。

### 2. 移动端筛选 Drawer（`MobileResolvedFilterDrawer`）

- Drawer 顶部新增一组 Segmented：All Resolved / My Settled。
- 保留：Search、Category。
- 删除：Time Range、Sort By。
- Reset 行为相应更新（重置视图为 All、清空 search、category 回到 all）。

入口仍是 Header 右侧的 Filter 图标；视图切换不再单独占一行。

### 3. 页面（`ResolvedPage.tsx`）

- 移除标题下方独立那行的 `<ResolvedViewToggle />`。
- 将 `viewMode` / `handleViewChange` 作为 props 传给桌面 `ResolvedFilters` 和移动 `MobileResolvedFilterDrawer`。
- 未登录用户点击 "My Settled" 仍触发 `AuthDialog`（逻辑保留，仅触发位置变成筛选区内的 Segmented）。
- 删除未再使用的 state：`timeRange`、`sortBy`，以及它们传入 `useResolvedEvents` 的参数。

### 4. `useResolvedEvents`

- 入参中移除 `timeRange` 和 `sortBy` 的使用（保留 `category`、`search`）。
- 内部仍按 `settled_at desc` 返回，配合 grouping 使用。
- 不破坏 hook 的对外签名时，可保留参数但忽略；如果只此一处调用，则直接精简签名（倾向后者）。

### 5. 组件文件

- `ResolvedViewToggle.tsx` 不删除，作为内嵌控件继续被 `ResolvedFilters` 复用。
- `ResolvedFilters.tsx`、`ResolvedPage.tsx`、`useResolvedEvents.ts` 做对应更新。

## 不改动

- `ResolvedGroupedGrid` / `ResolvedMarketCard` / `resolvedGrouping`
- 数据库、迁移、PnL/grouping 逻辑
- 路由 `?view=mine` 行为（继续作为 viewMode 的来源/出口）

## 验收

- 桌面：标题下只有一行筛选条，左侧是 All/Mine 切换，中间 Search，右侧 Category；切换 Mine 未登录会弹出 AuthDialog。
- 移动：Header 右侧 Filter 图标打开 Drawer，第一项是 All/Mine 切换，下方是 Search、Category；不再有独立的切换行。
- 网格仍按 This Week / Earlier This Month / MMMM YYYY 分组展示，URL `?view=mine` 与 UI 同步。
