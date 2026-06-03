## 问题

对于 single-market binary event，DB 里 option label 始终是 `Yes`/`No`，但带 `side_labels` 时（如 UFC：Pereira / Ankalaev）UI 应展示队名别名。当前 voucher 与 airdrop 相关界面多处还在直接渲染 `Yes`/`No` 或原始 `optionLabel`，与 memory `single-market-binary-ui` 不一致。

Memory 规则复习：
- 单 market binary：outcome 名（含 sideLabels 别名）就是 side；持仓/airdrop 行 **Side 列留空**，颜色挂在 Contracts/Outcome 主标签上。
- Buy `Yes` long → outcome long；Buy `No` long → outcome long（不再翻转）。

## 改动范围（voucher / airdrop 链路一次性收齐）

### 1. `src/components/vouchers/EventPickerList.tsx`
- `PickedOption` 增加 `displayLabel: string`（binary 走 sideLabels 别名，否则等于 `optionLabel`）。
- `onSelect` 时把 `displayLabel` 一起传出。
- 列表内已展示别名（之前已修），保留。

### 2. `src/components/vouchers/RedeemVoucherContent.tsx`
- Dialog summary（line 84-95）binary 分支：用 `picked.displayLabel` 替换 `picked.optionLabel`；颜色仍按 yes(green)/no(red) 判定（基于原始 `optionLabel`）。
- Inline sticky bar（line 145-159）同上。
- 占位 hint `Select Yes or No on a market above to continue.` → `Select an outcome on a market above to continue.`
- Non-binary 分支保持不变。

### 3. `src/components/AirdropPositionCard.tsx`
- 通过 `useEventSideLabelsLookup()`（按 `counterEventName` 查）拿到 `{ isBinary, labels }`。
- 副标题（line 102-112）：
  - binary 且有 labels：显示 `labels[yes|no]`（按 `counterOptionLabel` 的 yes/no 判定别名）。
  - binary 无 labels：显示 `counterOptionLabel`（即 Yes/No）。
  - 非 binary：保持现状 `optionLabel · Yes/No`。

### 4. `src/pages/PortfolioAirdrops.tsx`（desktop table，line 335-377）
- 用同一个 lookup。
- "Counter" 列 option label：binary 时用别名（如有）。
- "Side" 列：binary 行**留空**（移除 Yes/No badge），颜色改挂在 Counter 列 option label 文本上（trading-green / trading-red）。非 binary 保持原 Yes/No badge。
- Mobile 卡片复用 `AirdropPositionCard` 改动（步骤 3）。

### 5. `src/components/DesktopPositionsPanel.tsx`（airdrops 行，line 371 附近）
- 同步步骤 4：airdrop 子表的 Side 单元格对 binary 行留空，outcome 颜色挂在 Contracts。

### 6. `src/components/positions/CloseVoucherDialog.tsx` + `CloseVoucherDrawer.tsx`
- 调用方传给 `CloseVoucherContent` 的 `optionLabel`：binary + 有 labels 时传别名（用 lookup 解析）。`CloseVoucherContent` 内部不变。

## 不动的部分

- `src/lib/tradingTerms.ts` 的 `Yes/No` 默认映射保留（基础默认值）。
- 非 binary（多 outcome / 数值）市场逻辑全部保持原样。
- Trade 面板、Positions 主表已遵循 sideLabels，不在本次范围内。

## 验收

- `/vouchers` redeem inline 栏 + dialog summary：UFC 类显示 `Pereira` 或 `Ankalaev`，不再出现 `· No`。
- `/portfolio/airdrops` mobile 卡片：binary 副标题只显示 `Ankalaev`，颜色 red；不再出现 `No · Yes`。
- `/portfolio/airdrops` desktop 表：binary 行 Side 列为空，Counter 列 option 文本带颜色。
- `DesktopTrading` airdrops 子表同步。
- Close voucher dialog/drawer 标题中的 Position 行使用别名。
- 非 binary 事件视觉无变化。
