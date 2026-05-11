## 问题

交易页 PENDING 行的 Action 单元格很窄，`Activate | 46h 47m` 整体太宽，导致按钮内文字折行成两段（`46h` / `47m`），视觉上很丑。Portfolio 表格列宽充足，没有这个问题。

## 方案

双管齐下：**压缩倒计时文案** + **按钮内部强制单行**，让 `trading` 变体在窄列里也能优雅显示。

### 1. `useCountdown` 增加紧凑格式

在 `src/hooks/useCountdown.ts` 返回值里新增字段 `compact`：

- `≥ 24h`：`2d 1h`（天 + 小时，省掉分钟）
- `1h ~ 24h`：`5h 30m`（保持现有格式，但 ≥ 10h 时可以只显示 `12h`，避免 `12h 47m` 太长 → 折中：≥ 10h 显示 `12h`，< 10h 显示 `5h 30m`）
- `1m ~ 1h`：`12m`（省掉秒，紧凑模式不需要每秒刷新的秒数）
- `< 1m`：`45s`

`timeLeft` 字段保持现状（Portfolio / 移动卡片继续用完整格式）。只新增 `compact`，不破坏现有调用。

### 2. `ActivateAirdropButton` 的 `trading` 变体

- 用 `compact` 替代 `timeLeft`。
- 整颗按钮加 `whitespace-nowrap`，子元素都不允许换行。
- 缩小内边距：`px-2`（原 `px-3`），分隔符竖线改用更紧凑的 `·` 中点符号，去掉前后空格，整体节省 ~10px。
- 倒计时段加 `tabular-nums` 让数字宽度稳定。

最终形态示意：

```
[⚡ Activate · 46h]
[⚡ Activate · 12m]   (urgent，红色)
```

### 3. `table` 变体保持不变

Portfolio 表格 / 移动卡片继续用完整 `timeLeft`（`46h 47m`），因为列宽够，信息更精确，体验更好。

## 受影响文件

- `src/hooks/useCountdown.ts`：新增 `compact` 字段。
- `src/components/ActivateAirdropButton.tsx`：`trading` 变体改用 `compact` + `whitespace-nowrap` + 紧凑分隔符 + 缩小 padding。

## 不做的事

- 不改 Portfolio / 移动卡片的显示。
- 不改 `useCountdown` 的刷新频率逻辑、urgent 阈值。
- 不改按钮主色、urgent 红色样式。
- 不改 expiry / 72h 业务逻辑。

## 验收

- 交易页 PENDING 行按钮一行显示 `⚡ Activate · 46h`，不再折行。
- 剩余 < 1h 时显示 `⚡ Activate · 12m`，红色 outline。
- Portfolio / 移动卡片仍然显示完整 `46h 47m`。
