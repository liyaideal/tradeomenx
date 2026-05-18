## 问题

上次实现 Partial Close 时移动端也用了 `Popover`，违反了 `DESIGN.md` 和 `/style-guide` 里的规范：**移动端所有底部弹层必须使用 `MobileDrawer`**（带拖拽 handle、安全区 padding、统一圆角）。

## 改动方案

把 `ClosePositionPopover` 拆成「逻辑/UI 内容」+「容器」两层，桌面继续用 Popover，移动端用 MobileDrawer，两端共用同一份内部表单。

### 1. 拆分组件

- 新建 `src/components/positions/ClosePositionForm.tsx`
  - 抽离现在 `ClosePositionPopover.tsx` 里的全部内容：标题/方向/合约数、25/50/75/100% 快捷比例、Slider、Close price / Realized PnL / Released margin / Remaining size、底部 `Close all` / `Close XX%` 按钮
  - Props：`position`, `onConfirm(qty)`, `onCancel`, `fullCloseOnly?`
  - 不包含任何 Popover/Sheet 容器

- 改造 `src/components/positions/ClosePositionPopover.tsx`
  - 桌面版容器，仅保留 `<Popover><PopoverTrigger>{children}</PopoverTrigger><PopoverContent>` 包裹 `<ClosePositionForm />`
  - 保留现有 props，桌面调用方无需改动

- 新建 `src/components/positions/ClosePositionDrawer.tsx`
  - 移动端容器，使用 `MobileDrawer`：
    - `title="Close position"`
    - `description` 显示方向 + 合约数（替代原 Popover 内的副标题）
    - 内容渲染 `<ClosePositionForm />`，确认后关闭抽屉
  - Props：`open`, `onOpenChange`, `position`, `onConfirm`, `fullCloseOnly?`

### 2. 调用方调整

- `src/components/PositionCard.tsx`（移动端 Position 卡片）
  - 移除 `ClosePositionPopover` 引用
  - 用 `useState` 管理 `closeOpen`，Close 按钮 `onClick={() => setCloseOpen(true)}`
  - 渲染 `<ClosePositionDrawer open={closeOpen} ... />`

- `src/pages/TradeOrder.tsx`（移动端订单页）
  - 同上：把 `ClosePositionPopover` 替换为 `ClosePositionDrawer` + state 触发

- `src/components/DesktopPositionsPanel.tsx`
  - **不动**，继续用 `ClosePositionPopover`（桌面版）

### 3. 视觉/交互细节（对齐 style-guide）

- Drawer 高度：`auto`，让内容自适应；showHandle 默认 true
- Form 内部按 `MobileDrawerActions` 的间距规范处理底部按钮（`pt-2 gap-2`，full width）
- 触摸目标按钮 `h-11`，符合移动端最小命中区域
- 抽屉关闭后清理本地 ratio 状态

## 不动的部分

- 所有 hooks（`partialClosePosition`、`partialClosePositionInDb`、store）保持不变
- 业务逻辑（Realized PnL、Released margin 计算）保持不变
- 桌面 Popover 视觉/位置不变