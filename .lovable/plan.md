## 方案 B：满铺背景 + 左侧渐变遮罩

把上传的 OmenX 金币图作为 Mainnet Launch banner 的整张背景层，左侧用深色渐变压暗保证文字可读，右侧自然露出主英雄币。Hedge banner 暂不动（等它自己的图）。

### 视觉效果预期

```text
┌──────────────────────────────────────────────────┐
│ [Mainnet Launch] [Live] [Reward ledger]          │
│                                       ░▓▓▓▓▓███ │
│ First qualifying trade                ░▓▓███████ │
│ unlocks campaign rewards.             ░██ OMENX█ │  ← 金币图
│                                       ░██ COIN █ │     满铺
│ Trade on mainnet, qualify once...     ░▓▓███████ │
│                                       ░▓▓▓▓▓███ │
│ [$5K Activation] [$2-50] [$200]                  │
│                          [Ends 7d 12h] [JOIN →] │
└──────────────────────────────────────────────────┘
   ↑ 左侧 60% 是渐变遮罩压暗的金币堆
   ↑ 右侧 40% 露出主英雄币
   无外框、无矩形边、无"贴纸感"
```

### 实施步骤

1. **导入图片资产**
   - 把上传的 `ChatGPT_Image_May_5_2026_12_14_51_PM-2.png` 复制到 `src/assets/mainnet-launch-coin.jpg`（转 JPG 减小体积，约 200-400KB）
   - 在 `CampaignBannerCarousel.tsx` 顶部 `import coinBg from "@/assets/mainnet-launch-coin.jpg"`

2. **改 Mainnet Launch banner 的渲染结构**（仅 launch banner，hedge 保持不变）
   - 在 banner `<button>` 内部最底层加一个绝对定位的 `<img>`：`absolute inset-0 h-full w-full object-cover object-right opacity-90`
   - 在 img 上叠加左→右的渐变遮罩：`absolute inset-0 bg-gradient-to-r from-mainnet-surface via-mainnet-surface/85 to-mainnet-surface/10`
   - 再叠加一层从底到顶的轻微暗化 `bg-gradient-to-t from-background/40 to-transparent` 让金属计数 chips 区可读
   - 删除 banner 原本的 `bg-mainnet-surface` 纯色背景
   - 现有的网格背景层 `bg-[linear-gradient(...)]` 透明度调到 `opacity-20`，避免和金币图打架

3. **删除右侧 `renderVisual('launch')` 占位**
   - 因为图已经满铺，右侧那块"九宫格 Trophy/Network/Arrow"图标占位就不再需要
   - 在 grid 列定义里 launch banner 改成单列布局：文字+CTA 占满左 60%，右 40% 留给图自然透出
   - hedge banner 保持原 2 列布局不动

4. **响应式处理**
   - Mobile（`isMobile` 时）：图改用 `object-position: right -40px center` 让主币更靠近右边缘，遮罩范围加大到 `from-mainnet-surface via-mainnet-surface/95 to-mainnet-surface/30`，保证小屏文字依然清晰
   - 加 `min-h` 保持 desktop 236px / mobile 190px 不变

5. **CTA 按钮和 Countdown 视觉调整**
   - 现在它们叠在金币图上，给 Countdown 加 `backdrop-blur-md bg-background/60` 加强可读性
   - JOIN CTA 已经是实色金黄底，不需要改

6. **QA 检查点**
   - Desktop 1024px+：左侧文字不被金币遮挡、英雄币完整可见
   - Mobile 375px：渐变足够强、文字 100% 可读、不会糊成一团
   - 在 1021px（用户当前 viewport）上确认视觉效果

### 技术细节

**改动文件**：
- `src/components/campaign/CampaignBannerCarousel.tsx`（核心改动）
- `src/assets/mainnet-launch-coin.jpg`（新增图片资产）

**渐变遮罩公式**（关键）：
```
desktop: from-mainnet-surface 0% → /85 40% → /10 100%
mobile:  from-mainnet-surface 0% → /95 50% → /30 100%
```
左边 0-40% 完全压暗保证文字 4.5:1 对比度，40%-100% 渐变释放图像。

**为什么不影响 hedge banner**：在 `renderVisual` 之外、banner `<button>` 层级判断 `banner.visual === 'launch'` 才插入背景图层，hedge 走原逻辑。

### 后续可选

- 如果效果好，hedge banner 出图后用同样手法处理
- 把这个"全铺背景 + 渐变遮罩"做成 `CampaignBannerFrame` 的一个 variant，未来活动复用
