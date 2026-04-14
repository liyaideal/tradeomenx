

# Event 级 24h Chg 字段加 ⓘ Tooltip 说明

## 改动

在 `MarketListView.tsx` 的表头 `24h Chg` 旁加一个 ⓘ 图标，hover 时显示 tooltip 解释口径："Based on the market with highest 24h volume"。

子表头行的 `24h Chg` 不加 tooltip（子行是 market 自身的值，无歧义）。

### 文件

| 文件 | 改动 |
|------|------|
| `MarketListView.tsx` | 表头第 4 列加 `<Info>` 图标 + `<Tooltip>` 组件，tooltip 文案说明取值口径 |

