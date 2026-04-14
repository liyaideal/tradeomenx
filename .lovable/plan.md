

# 移动端时间段切换器压缩方案

## 问题

移动端 390px 宽度下，7 个 Tab 已经撑满横向空间，`ChgTimeframePicker`（三个平铺按钮）无论放 Tabs 行还是标题行都太挤。

## 方案

移动端将 `ChgTimeframePicker` 压缩为一个 **下拉按钮**，只显示当前选中值（如 `24H ▾`），点击弹出小菜单选择。桌面端保持三个平铺按钮不变。

```text
移动端标题行:
┌─ Explore Events ──────── [24H▾] [🔽] ─┐
│ Real-time markets...                    │
├─ All  Hot  Watchlist  Crypto  Macro ... ┤

桌面端 (不变):
├─ All  Hot  Watchlist ... ── [1H 4H 24H] ┤
```

## 改动

| 文件 | 改动 |
|------|------|
| `ChgTimeframePicker.tsx` | 新增 `compact` prop；当 `compact=true` 时渲染为 Popover 触发器（按钮显示 `24H ▾`），点击展开三个选项；`compact=false`（默认）保持现有平铺样式 |
| `EventsPage.tsx` | 移动端：将 compact 版 picker 移入标题行右侧（filter 按钮左边）；桌面端：保持 picker 在 Tabs 行且 `compact=false`；Tabs 行在移动端不再渲染 picker |

只改布局和组件的渲染模式，数据逻辑不变。

