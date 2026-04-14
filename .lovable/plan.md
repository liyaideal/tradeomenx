

# 恢复 EventsPage 移动端右上角的 Status Dropdown

## 问题
原来的设计规范是：EventsPage 和 ResolvedPage 的移动端 Header 右上角都使用 `MobileStatusDropdown` 组件，用户可以通过下拉菜单在 "Active" 和 "Resolved" 之间切换。

上次修改错误地把 EventsPage 的 `MobileStatusDropdown` 替换成了一个普通按钮，破坏了原有设计规范。

## 修改

### `src/pages/EventsPage.tsx`
- 将移动端 MobileHeader 的 `rightContent` 从普通 `<button>` 改回 `MobileStatusDropdown`
- 使用 `statusFilter="active"`，当用户选择 `resolved` 时导航到 `/resolved`
- 导入 `MobileStatusDropdown` 从 `@/components/EventFilters`
- 移除不再需要的 `CheckCircle2` 图标导入

这样 EventsPage 和 ResolvedPage 的移动端头部行为完全一致，都通过下拉菜单切换状态。

