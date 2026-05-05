## 问题诊断

当前方案的问题确实是结构性的，不是调参能解决的：

1. **整张底图不可复用**：mainnet 用了 OmenX 金币摄影图，下次 hedge / 交易赛 / 推荐活动每个都要单独出一张高质量摄影图，成本高且风格难统一。
2. **底图 + 文字遮罩 → 桌面发空**：桌面 banner 文字只占 60%，右侧靠图片"自然填满"，但图片任意比例都很难刚好衬托文字。
3. **倒计时 + CTA 浮在右下角**：脱离了主信息区（左上），视线要从左上跳到右下，且和 `$5K Weekly pool` 不在一条线上，结构感差。
4. **Mobile `$5K` 和倒计时重叠**：因为底部是 `flex-wrap` 同一行，左下放 metric、右下放倒计时+CTA，窄屏必然撞。
5. **没有"banner 规范"**：现在 mainnet 一种结构、hedge 一种结构，将来第三个活动又得新设计。

## 解决方案：定义一套 `CampaignBanner` 模版

所有活动 banner 强制走同一套两栏骨架，不再用整张背景图。视觉差异化通过**右侧视觉槽 + 主题色**承载，不通过整张底图。

### 统一骨架（桌面 + 移动同结构）

```text
┌─────────────────────────────────────────────────────────────┐
│ [eyebrow] [status]                                          │  ← 顶部 meta 行
│                                                             │
│ Title (≤ 7 词)                          ┌──────────────┐    │
│                                         │              │    │
│ $5K  Weekly pool                        │ 视觉槽       │    │
│ ─── 一行 metric ───                     │ (品牌色块)   │    │
│                                         │              │    │
│ [JOIN NOW →]   Ends 22d 21h            └──────────────┘    │
│ ─── CTA + 副信息（如倒计时）同一行 ───                       │
└─────────────────────────────────────────────────────────────┘
   左 60% (信息列，固定结构)              右 40% (视觉槽，按活动定制)
```

移动端：右侧视觉槽收成顶部一条 80px 高的窄横幅或者直接隐藏，**所有信息都在左列纵向堆叠**，不再底部并排，彻底消除重叠。

### 规范：每个活动配置必填项

```ts
type CampaignBannerConfig = {
  id: string;
  href: string;
  // 文案（强约束字数）
  eyebrow: string;          // ≤ 2 词，活动代号
  title: string;            // ≤ 7 词，主张
  status?: { text, tone };  // Live / Ending soon / Upcoming
  // 一个核心数字（不可多）
  heroMetric: { value, label };
  // CTA
  ctaLabel: string;         // ≤ 2 词
  // 倒计时（可选）
  countdown?: boolean;
  // 主题色（驱动 metric / CTA / 边框 / 视觉槽底色）
  theme: "gold" | "primary" | "green" | "violet";
  // 右侧视觉槽（不再是整张背景图）
  visual: ReactNode;        // 由活动自己提供组件
};
```

### 视觉槽（右 40%）的可复用范式

不是整张摄影图，而是**结构化插画**，三种范式可选，将来活动直接挑一种：

1. **Icon Tile Grid**：3 个 lucide icon 方块（mainnet 现在的 fallback 就是这种），最通用。
2. **Diagram**：1-3 个最小化业务示意（hedge 现在的 ShieldCheck 那种），适合机制类活动。
3. **Hero Object**：可选小尺寸品牌物件（如金币缩略图、奖杯、卡牌），但**只占视觉槽内部**，不再做整张背景。mainnet 可以放当前金币图但裁剪到 240×160 的视觉槽里，外部不再有底图遮罩。

主题色 + 视觉槽 = 每个活动有差异；骨架不变 = 可复用。

### 改动清单

1. **重写 `src/components/campaign/CampaignBannerCarousel.tsx`**：
   - 移除 `MainnetLaunchBackground`、`mainnetCoinBg` 整张底图逻辑、`isLaunch` 分支特殊样式、底部右下角浮动 CTA。
   - 改为统一两栏 grid `md:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]`，左列信息、右列视觉槽。
   - 左列垂直顺序固定：`meta 行 → title → heroMetric → CTA + countdown 同一行（移动端纵向堆）`。
   - `theme` 字段驱动 `text-mainnet-gold` / `border-mainnet-gold` 等 class（用 map 对象，不再 `isLaunch` 三元）。
2. **`banners` 数据**：
   - Mainnet：`theme: "gold"`，视觉槽用 Hero Object（金币缩略图，src 复用 `mainnetCoinBg` 但裁切进 240×160 的槽里）。
   - Hedge：`theme: "primary"`，视觉槽用现有 ShieldCheck Diagram。
3. **移动端**：
   - 右视觉槽 `hidden sm:block`（窄屏完全隐藏，只保留信息列），彻底解决 `$5K` 与倒计时重叠。
   - CTA 改为占满宽度的按钮，倒计时放在 CTA 上方一行，不再 absolute。

### 技术细节

- 删除 `useLayoutEffect` + `ResizeObserver` 的 `objectPosition` 自动计算逻辑（不再需要）。
- 删除 `absolute bottom-4 right-4` 的浮动 CTA 块，全部改为正常文档流，靠 grid 对齐。
- `theme` map：
  ```ts
  const themeMap = {
    gold:    { border: "border-mainnet-gold/25", metric: "text-mainnet-gold", cta: "bg-mainnet-gold text-background", surface: "bg-mainnet-surface" },
    primary: { border: "border-primary/25",      metric: "text-primary",      cta: "bg-primary text-primary-foreground", surface: "bg-background" },
    // green / violet 留给将来活动
  };
  ```
- 同步更新 memory `mem://design/campaign-landing-design-system.md`：明确"homepage banner 必须使用 CampaignBanner 统一骨架，禁止整张背景摄影图，视觉差异通过 theme + 右侧视觉槽承载"。

### 输出预期

- 桌面：左信息列结构紧凑不再发空（因为右侧有等高视觉槽撑场），CTA 在信息流末尾自然落位，不再飘在右下角。
- 移动：单列纵向堆叠，无重叠，CTA 占满宽度，符合主流交易所 app 的 banner 形态（Binance / OKX / Bybit 都是这种）。
- 复用：将来上交易赛 / 推荐 / 节日活动，只需提供 `theme` + 视觉槽组件 + 5 个文案字段，不需要再设计整张图。
