# Fix withdraw history + mobile Transaction History layout + design spec

## Problem 1 — Withdraw 不进 Transaction History ✅ 已确认

`useWithdraw.submitWithdrawalMutation` 是 mock，没写 `transactions` 表。

### 修复
在 `src/hooks/useWithdraw.ts` 验证通过后向 `transactions` 表 insert：

- `user_id` / `type: 'withdraw'` / `amount: -amount` / `description: 'Withdrawal to wallet'` / `status: 'processing'` / `network` / `tx_hash: null`

用 insert 返回的 `id` 替换本地 `wd-${Date.now()}`，并 `queryClient.invalidateQueries(['wallet-fund-transactions'])`，让 `/wallet` 立即出现新记录。失败不写库。

## Problem 2 — 移动端 Transaction History 排版叠在一起

390px 下当前是单行 flex：图标 + 描述 + 类型徽章 + 状态图标 + 金额 + chevron 全部抢同一行宽度，描述被截成 `Bri...`、徽章和金额贴脸。

### 修复（仅 `isMobile` 分支重排，桌面端保持不变）

每行改为两层结构：

```text
[icon]  Withdrawal to wallet                  -$2,000.00
        20/05/2026, 17:05  [Cross-Chain In] *    v
```

- **第一行**：左 = `icon` + 描述 `truncate flex-1`；右 = 金额 `shrink-0 font-mono text-right`
- **第二行**（描述下方、与描述左对齐）：左 = 日期 + 类型徽章 + 状态图标 `text-xs flex-wrap gap-1.5`；右 = chevron（可展开时）
- 展开详情区不变

## Problem 2.5 — 同步更新设计规范（DESIGN.md §8.2）

当前 `DESIGN.md` §8 "Transaction Card Layout" 只有一句 `flex items-center justify-between …` 无法约束移动端排版，所以这次顺手把规范补齐：

替换/扩展 §8 中 `### Transaction Card Layout` 段，新增子节 **Transaction History Row Spec**，明确：

1. **Desktop（`md+`）**：单行
   - `flex items-center justify-between p-4`，左侧 `icon + 描述 + 类型徽章 + 状态图标`，右侧 `金额 + chevron`
2. **Mobile（`<md`）**：两层
   - 第一行：`icon` (40×40 圆) + 描述 (`text-sm font-medium truncate flex-1`) + 金额 (`text-sm font-semibold font-mono shrink-0`)
   - 第二行：描述下方（`pl-[52px]` 与图标对齐），`text-xs text-muted-foreground flex items-center flex-wrap gap-1.5`，依次 `date · type badge · status icon`，chevron 右对齐
3. **共用**：
   - 徽章 `inline-flex rounded-full border px-1.5 py-0 text-[10px] font-semibold`
   - 状态图标 `w-3.5 h-3.5`，`processing` 加 `animate-spin`
   - 金额绿/红依正负，`font-mono`
   - 仅 `hasDetails(tx)` 时显示 chevron 且整行可点击展开

同时在 `mem://index.md` Core 末尾追加一行：

```
- **Transaction Rows:** 桌面单行；移动两层（描述+金额在上，date/badge/status 在下）。详见 DESIGN.md §8 Transaction History Row Spec。
```

## Files to Change

- `src/hooks/useWithdraw.ts` — insert `transactions` + invalidate query
- `src/components/wallet/TransactionHistory.tsx` — `isMobile` 分支两层布局
- `DESIGN.md` — 扩展 §8 Transaction Card Layout 为 Transaction History Row Spec
- `mem://index.md` — Core 加一条引用规范的核心规则

## Validation

- 提交一次提现 → Transaction History 立即出现 `Withdrawal to wallet` processing 行
- 390px：描述完整可读，金额不被遮挡，徽章/状态/日期落在第二行
- 桌面端布局未变
- DESIGN.md 新规范与实现一致
