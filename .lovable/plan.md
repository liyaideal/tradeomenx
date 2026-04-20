

## 问题
移动端 `/trade` 和 `/trade/order` 的 MM 指示器盒子（带 border 的小框）与下方 Charts/Trade tab 行的 `border-b` 分隔线在垂直方向上发生视觉重叠：MM 盒子高度比 tab 文字高，导致盒子底部 border 压在那条 1px 分隔线上，看起来"贴边/挤线"。

## 根因
在 `MobileTradingLayout.tsx` 里：
- 容器：`flex items-center justify-between px-4 border-b border-border/30`
- 左边 tab 按钮 `py-2`（高度小）
- 右边 `<MobileRiskIndicator />` 是个 `px-2 py-1 rounded-lg bg-muted/50 border border-border/30` 的盒子（高度大）

两者底边对齐到容器底，而容器底就是那条 `border-b`，所以盒子边框正好压在分隔线上。

## 优化方案（最小改动，不动 MM 内部样式）

**改动文件**：`src/components/MobileTradingLayout.tsx`

**核心思路**：让 MM 盒子在垂直方向"浮"在 tab 行内，与底部分隔线之间留出呼吸空间。

具体两步：
1. 容器改为 `py-1.5`（给上下留出 6px 空间），保持 `border-b border-border/30`
2. 左边 tab 按钮的 `py-2` 改成 `py-1.5`，保持 tab 下划线（`border-b-2 border-trading-purple`）紧贴容器底边的视觉效果 —— 即把 active tab 的下划线"接"到容器的 border-b 上，这是导航栏标准做法

这样：
- MM 盒子上下各有 6px 间距，不再贴线
- Tab 的紫色下划线仍然位于容器底部（视觉上压住灰色 border-b，符合"当前 tab 选中"的标准导航语义）
- 整体 tab 行会增加约 4px 高度，可接受

## 不改动
- `MobileRiskIndicator.tsx` 内部样式（盒子本身设计没问题）
- Tab 文案、active 颜色、紫色下划线
- 桌面端布局

