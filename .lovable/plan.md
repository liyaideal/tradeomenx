

# Style B 卡片高度压缩

## 分析高度来源

当前卡片垂直结构：
- 顶部行（Star + Badge + Expiry）：`mb-2`
- 标题行：`mb-2`
- Outcome 容器：`py-1.5` + CHG 标签行 + 数据行 × 3 + `space-y-1` + `mb-2`
- 底栏：`pt-1.5 mt-0.5`

新增的 CHG 标签行虽然用了 `-mb-0.5`，但仍占了一行高度，是卡片变高的直接原因。

## 压缩方案

| 位置 | 当前 | 改为 | 节省 |
|------|------|------|------|
| 顶部行 margin | `mb-2` | `mb-1.5` | ~2px |
| 标题 margin | `mb-2` | `mb-1.5` | ~2px |
| Outcome 容器内边距 | `py-1.5` | `py-1` | ~4px |
| Outcome 行间距 | `space-y-1` | `space-y-0.5` | ~4px (3行) |
| Outcome 底部 margin | `mb-2` | `mb-1.5` | ~2px |
| 底栏 | `pt-1.5 mt-0.5` | `pt-1` 去掉 mt | ~4px |

总计约压缩 **~18px**，视觉层次不变（底色容器、字体大小、CHG 标签都保留）。

## 改动范围

仅 `src/components/events/MarketCardB.tsx`，约 6 行间距微调。

