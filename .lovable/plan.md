建议加，而且最好用表头 tooltip，而不是在表格里塞长文案。这样信息完整，但 UI 不会变重。

Implementation plan:

1. Add compact info icons to desktop table headers
   - 在 `/portfolio/airdrops` 的 desktop table 表头加小 `Info` 图标。
   - Hover 后显示英文说明。
   - 不影响 mobile 卡片布局。

2. Rename `Price` header to `Entry Price`
   - 当前这个字段实际是 OmenX 空投仓位的入场价格，所以表头改成 `Entry Price` 更清楚。

3. Tooltip copy in English
   - `Value`: `Before activation, this is the fixed $10 face value. After activation, it reflects current price × quantity.`
   - `Entry Price`: `Entry price of the OmenX airdrop position.`
   - `Source`: `Polymarket source position price.`
   - `Status`: explain all states:
     - `Pending`: waiting for user activation.
     - `Activated`: activated and waiting for event resolution or source position close.
     - `Expired`: not activated within 72 hours.
     - `Settled`: activated and already settled. Settlement happens when the event resolves or the Polymarket source position is closed.

4. Keep settled reason badge short
   - Continue using `Resolved` for event resolved.
   - Continue using `Closed` for user closed/polymarket source closed.
   - Tooltip will provide the detailed explanation, so the badge can stay short and not wrap.

Technical details:

- Main file: `src/pages/PortfolioAirdrops.tsx`
- Add `Info` from `lucide-react`.
- Add `Tooltip`, `TooltipTrigger`, `TooltipContent` from `@/components/ui/tooltip`.
- Create a small local helper component like `HeaderWithInfo` to avoid repeating markup in every table header.
- No backend/database changes needed.