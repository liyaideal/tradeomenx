

# Style B 卡片紧凑化

## 分析

当前卡片偏高的原因：
1. 外边距 `p-3.5` 偏大
2. 标题到 outcome 的 `mb-3` 间距过大
3. Outcome 容器内边距 `py-2` + 行间距 `space-y-1.5` 累积高度
4. 底栏 `pt-2 mt-1` 双重间距

## 调整（仅 MarketCardB.tsx）

| 位置 | 当前 | 改为 |
|------|------|------|
| 卡片内边距 | `p-3.5` | `p-3` |
| 标题到 outcome | `mb-3` | `mb-2` |
| Outcome 容器内边距 | `px-2.5 py-2` | `px-2 py-1.5` |
| Outcome 行间距 | `space-y-1.5` | `space-y-1` |
| 底栏间距 | `pt-2 mt-1` | `pt-1.5 mt-0.5` |

层次感保留（底色容器、字体大小差异不变），只收紧间距。

## 改动范围

仅 `src/components/events/MarketCardB.tsx`，约 5 行微调

