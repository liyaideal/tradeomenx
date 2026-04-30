同意，这个应该做成全局规范：tooltip 内容文字统一左对齐，不跟随表头/数值列的右对齐。表头本身可以右对齐，但弹出的解释文本必须左对齐。

Implementation plan:

1. Update `DESIGN.md`
   - 在 Component Patterns 里新增 `Tooltips` 规范。
   - 明确规则：
     - Tooltip content must always be left-aligned.
     - Tooltip trigger/header can align with its table column, but the popup text must not inherit right alignment.
     - Use `text-left`, `leading-relaxed`, and a readable max width.
     - Multi-line tooltip content should use vertical spacing, not centered/right aligned blocks.
   - 给出标准 class 示例：`text-left text-xs leading-relaxed max-w-72`。

2. Fix current `/portfolio/airdrops` tooltip alignment
   - 在 `HeaderWithInfo` 的 `TooltipContent` 上补 `text-left`。
   - 保留表头右对齐逻辑：`Value` / `Entry Price` 表头仍然靠右，因为列是数值列。
   - Tooltip 内容统一左对齐，不再出现一会儿左、一会儿右的视觉问题。

3. Keep future implementation clear
   - `DESIGN.md` 会说明：以后所有解释型 tooltip 默认左对齐。
   - 如果有特殊 tooltip 需要不同对齐，必须在组件内明确说明原因，不能默认继承父容器 alignment。

Technical details:

- Files to update:
  - `DESIGN.md`
  - `src/pages/PortfolioAirdrops.tsx`
- No backend/database changes needed.