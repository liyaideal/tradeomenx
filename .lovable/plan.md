

## H2E Banner 图片融合方案

当前问题：图片像"膏药"贴在 banner 中央 — 有硬边框、独立阴影、明显的容器感，与卡片割裂。

### 融合策略

把图片从"独立卡片"变成"卡片背景的一部分"，让它和紫色渐变、文字内容融为一体。

#### 桌面端改造

1. **去除图片容器边框/阴影** — 删除 `rounded-xl overflow-hidden bg-black shadow-2xl ring-1`，让图片直接呈现
2. **图片定位为卡片右半侧背景层**：
   - 用 `absolute inset-y-0 right-0 w-1/2` 定位
   - `object-cover object-left` 让图片从中间向右铺开
   - 加 `mask-image: linear-gradient(to right, transparent 0%, black 30%)` 让图片左边缘自然淡入卡片背景
   - 叠加 `bg-gradient-to-r from-card via-card/80 to-transparent` 渐变蒙版，确保左侧文字区域可读
3. **布局改为 2 列**（去掉中间图片列）：
   - 左列（占 60%）：badges + 标题 + 副文案 + CTA，z-index 高于图片
   - 右列（占 40%）：`$100` 数字浮在图片之上，加 `drop-shadow-2xl` 提升对比度
4. **图片色调融合**：加一层 `bg-primary/20 mix-blend-overlay` 让图片色调向紫色品牌色靠拢

#### 移动端改造

1. **去掉图片块的硬边框** — 移除 `aspect-[2/1] bg-black` 的独立块
2. **图片作为整卡背景**：
   - `absolute inset-0 w-full h-full object-cover opacity-40`
   - 上层叠加 `bg-gradient-to-b from-card/95 via-card/80 to-card/95` 让文字始终可读
   - 顶部 badges 直接浮在背景图上方
3. 整体高度由内容决定，不再强制 2:1 比例

### 实现细节

**文件**：仅修改 `src/components/hedge/HedgeEntryBanner.tsx`，不涉及其他文件

**关键 CSS 技巧**：
- `mask-image` + `linear-gradient` 实现图片边缘羽化
- `mix-blend-overlay` / `mix-blend-soft-light` 让图片融入紫色主题
- 多层 `bg-gradient` 蒙版确保文字对比度
- `drop-shadow` 替代 `text-shadow` 让 `$100` 数字在图片背景上有立体感

### 预期效果

- 图片不再是独立元素，而是卡片背景的一部分
- 紫色 glow + 图片 + 文字三者融合成统一视觉
- `$100` 数字像浮在场景里，而不是挤在图片旁边
- 整体冲击力保留，但视觉更高级、不"膏药感"

### 不改动

- 不换图片资源
- 不改文案
- 不改 CTA 行为
- 不改 badges 内容

