

# 卡片样式 A/B 版本选择器

## 方案

扩展 `ViewMode` 类型，将 grid 拆分为 `grid-a` 和 `grid-b`。在 `ViewToggle` 的 Grid 按钮上添加下拉菜单，点击可选择 A/B 两种卡片样式。

```text
桌面端 ViewToggle:
  [≡ List] [⊞ Grid ▾]
                ├─ Style A (current) ✓
                └─ Style B
```

## 改动

| 文件 | 改动 |
|------|------|
| `ViewToggle.tsx` | `ViewMode` 改为 `"list" \| "grid-a" \| "grid-b"`；Grid 按钮改为 Popover/DropdownMenu，点击展开两个选项（Style A / Style B），当前选中项打勾；外观上 grid 选中态不变，只是点击时弹出子菜单 |
| `MarketGridView.tsx` | 接收 `viewMode` prop，根据 `grid-a` 渲染现有 `MarketCard`，`grid-b` 渲染占位的 `MarketCardB`（先用现有卡片 + 角标 "B" 占位，等你提供 B 版设计后替换） |
| `MarketCardB.tsx` | 新建占位组件，暂时复用 `MarketCard` 并加一个 "B" 标记，后续替换 |
| `EventsPage.tsx` | `view` 状态类型对齐新 `ViewMode`；`isMobile` 时默认 `grid-a`；localStorage 持久化包含 a/b；`effectiveView` 判断 `grid-a \| grid-b` 都走 `MarketGridView` |
| `FilterChips.tsx` | `ViewToggle` 引用已更新，无需额外改动（props 透传） |

移动端：强制 grid 模式，但也可通过某个入口切换 A/B（如长按或小下拉），或暂时只用 A。

