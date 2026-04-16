

# Style B 卡片层次感优化

## 问题分析

当前 Style B 卡片"平面感"的根本原因：
1. **间距均匀**：顶部 `mb-1.5`、标题 `mb-2`、outcome `mb-2` 几乎等距，缺乏节奏感
2. **内边距偏小**：`p-3` 整体偏紧凑，内容贴边
3. **标题不够突出**：`text-sm` (14px) 和 outcome 的 `text-[11px]` 差距不大
4. **Outcome 区域没有背景分层**：数据行直接浮在卡片上，缺少"容器感"
5. **底栏过于轻**：和内容区无明显视觉断层

## 具体调整（仅 MarketCardB.tsx）

### 间距节奏
- 外边距 `p-3` → `p-3.5`，给内容更多呼吸
- 顶部行到标题 `mb-1.5` → `mb-2`
- 标题到 outcome `mb-2` → `mb-3`，拉开主标题和数据的距离

### 字体层次
- 标题 `text-sm` → `text-[15px]`，微调 1px 让标题更突出
- 标题 `leading-snug` → `leading-tight`，让标题更紧凑有力

### Outcome 区域加底色
- 给 outcome 列表包裹一层 `bg-white/[0.03] rounded-lg px-2.5 py-2`，形成半透明容器感
- 单 outcome（无 children）同样加底色容器

### 底栏加强
- `pt-1.5` → `pt-2 mt-1`，增加与内容区的间距

## 改动范围

仅 `src/components/events/MarketCardB.tsx`，约 10 行改动

