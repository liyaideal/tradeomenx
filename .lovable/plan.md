

# 移动端卡片 A/B 样式切换

## 改动

**文件：`src/pages/EventsPage.tsx`**

1. 移除 `isMobile` 时强制 `grid-a` 的逻辑，改为允许 `grid-a` / `grid-b` 切换
2. 在移动端标题右侧的工具栏（第 262 行附近，ChgTimeframePicker 旁边）加一个简易的 A/B 切换按钮
3. 切换按钮用两个小文字按钮 `A` / `B`，外包一个 `rounded-lg border` 容器，选中态用 `bg-primary/20 text-primary`
4. `effectiveView` 在移动端不再固定为 `grid-a`，跟随 `view` state

**具体 UI**：在 ChgTimeframePicker 和 MobileActiveFilterDrawer 之间插入一个紧凑的分段按钮：

```text
[ 1H ▾ ]  [A|B]  [≡]
```

约改 20 行代码，无新文件。

