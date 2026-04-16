

# Style A 紧凑 + 审美优化

## 对比参考图的问题

参考图特点：标题独占一行、字号大且醒目；10X badge 和外链图标在标题行右侧但视觉上更靠右上角；三列数据区清晰但不臃肿；整体留白恰到好处。

当前问题：
1. 标题行 `mb-3` 太大，和数据区之间空隙过多
2. 三列数据值 `py-2.5` 过高，显得松散
3. "View N Markets" 和底栏之间间距冗余
4. 整体卡片高度偏高，不够紧凑

## 调整项（仅 MarketCardA.tsx）

| 位置 | 当前 | 改为 | 原因 |
|------|------|------|------|
| 卡片内边距 | `p-4` | `px-4 py-3.5` | 上下稍收紧 |
| 顶行底margin | `mb-1.5` | `mb-1` | 收紧 |
| 标题行底margin | `mb-3` | `mb-2` | 过大 |
| 标题字号 | `text-lg` | `text-base` | 稍小更精致 |
| 10X badge 位置 | `mt-0.5` | `mt-0.5` 不变 | — |
| 三列表头内边距 | `px-3 py-1.5` | `px-3 py-1` | 表头更紧凑 |
| 三列数据值内边距 | `px-3 py-2.5` | `px-3 py-2` | 收紧 |
| 数据区底margin | `mb-2` | `mb-1` | 收紧 |
| "View Markets" | `py-1.5` | `py-1` | 收紧 |
| 底栏 | `mt-1.5 px-3 py-2` | `mt-1 px-3 py-1.5` | 收紧 |
| 底栏圆角 | `rounded-lg` | `rounded-md` | 更精致 |
| 数据区圆角 | `rounded-lg` | `rounded-md` | 统一 |
| 卡片hover | 仅 border 变色 | 加 `hover:shadow-lg hover:shadow-primary/5` | 增加质感 |
| 背景渐变 | 单一线性 | 加微妙的 `border-t border-white/[0.06]` 顶部高光线 | 增加层次感 |

总计压缩约 **20px** 高度，同时通过 hover shadow 和顶部高光线增加视觉质感。

## 改动范围

仅 `src/components/events/MarketCardA.tsx`，不动 B/C。

