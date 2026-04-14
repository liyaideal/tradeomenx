

# 桌面筛选栏优化 + 排序跟随时间段

## 改动

### 1. `FilterChips.tsx` — 移除 Chain & Leverage 筛选，排序选项跟随时间段

- 删除 Chain 下拉（`All Chains`）和 Leverage 下拉（`All Leverage`）
- 从 `FilterState` 中移除 `chain` 和 `leverage` 字段
- 排序选项从固定的 `24h Change` 改为通用的 `Change ↓`、`Volume ↓`（实际排序依据由当前 `chgTimeframe` 决定）
- 移除 `funding` 和 `price` 排序选项（无实际数据支撑），保留 `volume`、`change`、`oi`
- `FilterChips` 接收 `chgTimeframe` prop 用于显示当前时间段标签（如 `Volume ↓` 旁可显示 `(1H)` 等）

### 2. `EventsPage.tsx` — 排序逻辑跟随 chgTimeframe

- 排序时使用 `getChange(row, chgTimeframe)` 和 `getVolume(row, chgTimeframe)` 而非固定的 `volume24h` / `change24h`
- 将 `chgTimeframe` 传给 `FilterChips`
- 清理 `chain` / `leverage` 相关引用

### 3. `MobileActiveFilterDrawer`（同文件）— 同步移除 chain/leverage，排序选项对齐

| 文件 | 改动 |
|------|------|
| `FilterChips.tsx` | 删除 chain/leverage 下拉及 FilterState 字段；简化排序选项为 Volume/Change/OI；接收 chgTimeframe prop |
| `EventsPage.tsx` | 排序逻辑用 getChange/getVolume 替代固定 24h 字段；传 chgTimeframe 给 FilterChips；删除 chain/leverage 初始值 |

