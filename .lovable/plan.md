
# 优化 Position 详情弹窗（桌面 Dialog + 移动 Drawer）排版与 binary 适配

## 问题

`/trade` 列表点开持仓详情后弹窗（桌面 `PositionDetailDialog` + 移动 `PositionDetailDrawer`，共用 `PositionDetailContent`）有两个问题：

1. **右上角超出**：`DialogTitle` 用 `truncate` 渲染长事件名（"NBA Finals 2026 Game 7: Celtics vs Thunder"），但 Dialog 右上 X 关闭按钮（`right-4 top-4`）没给标题留 padding，长 title 会被 X 覆盖/挤压
2. **没针对 binary 单 market 优化**：header summary 区现在渲染 `"Yes 10x"` chip + 灰色队名（如 "Boston Celtics"），与新规则 `single-market-binary-ui`「outcome 颜色挂在主标签，不重复 Yes/No 字样」不一致；信息也重复

## 方案

### 1. `src/components/positions/PositionDetailDialog.tsx`
- `DialogTitle` 改：`truncate` → `pr-8 line-clamp-2 leading-snug text-base`
  - `pr-8` 给右上 X 让位
  - `line-clamp-2` 允许换两行而不是粗暴 truncate
  - `text-base` 把默认 `text-lg` 调小（事件名长，`lg` 容易撑两行 + 视觉过重）

### 2. `src/components/positions/PositionDetailContent.tsx` Header summary（line 100-121）
按 binary outcome 分支重写：

**binary 行**（`getBinaryOutcome(option) !== null`）：
```tsx
<div className="flex items-center gap-2 text-sm">
  <span className={cn("font-semibold", outcomeColor /* trading-green / trading-red */)}>
    {position.displayOption ?? position.option}   {/* 队名或 Yes/No */}
  </span>
  <span className="text-xs text-muted-foreground">{position.leverage}</span>
</div>
```
- 主标签直接是队名/Yes/No，用 outcome 颜色（绿/红）
- 不再渲染 "Yes/No · 队名" 双层 chip
- leverage 小灰字独立

**多 outcome 行**：保持现有 `"<option> <leverage>"` chip + 灰色 displayOption，但去掉重复（displayOption 与 option 相同时不渲染第二行）。

### 3. Mobile（`PositionDetailDrawer`）
- 数据/排版完全复用 `PositionDetailContent`，自动同步上面 2 的改动
- `MobileDrawer` title 在移动端宽度足够，已用 SheetTitle 自适应，不动

## 不动

- 数据层、PnL/funding 公式、Net PnL 块、Position 块、Funding 块、History 表格全部不动
- 多 outcome 事件的渲染基本不变
- 其它 Dialog（TPSL / Close / Edit）不动

## QA

- 桌面：NBA Finals binary 持仓 → 弹窗顶部 "NBA Finals 2026 Game 7: Celtics vs Thunder" 完整显示（最多两行）、不被 X 覆盖；下面 "Boston Celtics" 绿色 + "10x" 小灰字
- Buy No Thunder → 主标签 "Oklahoma City Thunder" 红色
- Bitcoin reach $150,000（多 outcome "Yes"）→ 保持现有 chip 渲染
- 移动 drawer 同样表现
- 短事件名（如 "Up >5%"）渲染不退化

## 记忆同步

不新增 memory；`mem://design/single-market-binary-ui` 已经覆盖"binary 详情类弹窗里也不再重复 Yes/No + 队名"的精神，无需更新文案。
