

# Style A 视觉调整

## 对比参考图的问题

参考图中数据区的值字体明显更大（约 14-16px），而当前代码中所有值都是 `text-[11px]`，显得拥挤且不突出。标题也需要稍大，整体间距需要更宽松。

## 调整项（仅 MarketCardA.tsx）

| 位置 | 当前 | 改为 |
|------|------|------|
| 卡片内边距 | `p-3` | `p-4` |
| 标题字号 | `text-[15px]` | `text-lg` (~18px) |
| 标题行底部 margin | `mb-2` | `mb-3` |
| 三列表头字号 | `text-[9px]` | `text-[10px]` |
| 三列表头内边距 | `px-2 py-1` | `px-3 py-1.5` |
| 三列数据值字号 | `text-[11px]` | `text-sm` (~14px) |
| 三列数据值内边距 | `px-2 py-1.5` | `px-3 py-2.5` |
| 三列数据区底部 margin | `mb-1.5` | `mb-2` |
| "View N Markets" | `text-[11px] py-1` | `text-xs py-1.5` |
| 底栏内边距 | `px-2.5 py-1.5` | `px-3 py-2` |
| 底栏字号 | `text-[10px]` | `text-[11px]` |
| 底栏 top margin | `mt-1` | `mt-1.5` |
| 10X badge | `text-[10px] px-1 py-0.5` | `text-[11px] px-1.5 py-0.5` |
| ExternalLink 图标 | `h-3 w-3` | `h-3.5 w-3.5` |

核心思路：数据值区域放大到 14px，与表头的 10px 形成明显的层级对比，匹配参考图的视觉比例。

## 改动范围

仅 `src/components/events/MarketCardA.tsx`，不动 B/C。

