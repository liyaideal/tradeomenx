## Banner 视觉升级：贴纸图 → 全卡场景背景图

### 核心思路

把右侧的占位 visual（`HeroObjectVisual` / `DiagramVisual`）从"贴在右边的方块"改成"整张卡片的电影感背景图 + 左侧暗色渐变遮罩保证文字对比度"。这样图不再像贴纸，而是 banner 本身的环境。

参考你刚生成的 OMENX 金币图就是目标质感：主体在右 35-40%，左侧自然过渡到纯黑，整张图作为一个连续的世界。

### 视觉结构

```text
┌─────────────────────────────────────────────────┐
│ [背景图层：全卡 cover，object-position: right]  │
│ [遮罩层：from-surface from-30% via-surface/85 via-55% to-transparent，左→右] │
│ [网格层：原 dotted grid，opacity 15%]           │
│ ┌───────────────────┐                           │
│ │ chip              │                           │
│ │ Title             │   ← 文字落在纯黑遮罩区     │
│ │ $5K Weekly pool   │      对比度足够            │
│ │ [CTA] Ends 2d 5h  │                           │
│ └───────────────────┘                           │
└─────────────────────────────────────────────────┘
```

### 改动清单

**1. 资源**

- 新生成的金币图保存到 `src/assets/banner-mainnet-launch.jpg`
- Hedge banner 等你给图后再加 `src/assets/banner-hedge.jpg`

**2. `src/components/campaign/CampaignBannerCarousel.tsx**`

- `CampaignBannerConfig`：把 `visual: ReactNode` 改为 `backgroundImage?: string`，保留 `visual` 作为兜底（无图时回退到现有占位组件）
- 卡片内部布局重写为 3 层：
  - **底层背景图**（仅 desktop）：`<img src={backgroundImage} className="absolute inset-0 h-full w-full object-cover object-right" />`
  - **遮罩层**：`bg-gradient-to-r from-mainnet-surface from-30% via-mainnet-surface/85 via-55% to-transparent`，颜色按 theme 动态选（gold→`mainnet-surface`，其余→`background`）
  - **网格层**：原 dotted grid，opacity 从 30% 降到 15%
- 右侧 visual 分栏槽位删掉，左信息列变成单列 `max-w-[60%]`
- **Mobile 不渲染背景图**，保持现在纯文字版式（避免小屏被挤压）

**3. 配置**

- Mainnet banner 配 `backgroundImage: bannerMainnet`
- Hedge banner 暂保留 `DiagramVisual` 兜底，等图就位再换

**4. 模板文档 `.lovable/memory/design/campaign-banner-template.md**`

- 加「背景图规范」段落（见下方"复用规范"）
- 加 banner 图生成 prompt 模板（见下方"Prompt 模板"）

---

## 复用规范：未来新 banner 图必须满足的硬约束

写进 banner template 文档，作为接图的验收标准：

1. **画幅**：16:9，最小 1600×900
2. **主体位置**：在右侧 35-40% 区域，可轻微出血到右边缘
3. **左侧暗区**：左 50% 必须是纯黑或可融入 surface 的极暗色，**不能有光斑、粒子、字体、UI 残留**
4. **光源**：单一方向（通常右上或右侧），暖色调（gold 系）或主题霓虹色（如 hedge 的紫），整图 monochromatic
5. **景深**：浅景深，主体清晰、背景虚化（参考金币图后面那堆模糊的币）
6. **禁止**：文字、logo、UI 卡片、图表、边框、圆角、drop shadow、贴纸描边、emoji、任何"被框起来"的元素
7. **文件**：jpg，<400KB，命名 `banner-{campaign-id}.jpg`，放 `src/assets/`

---

## Prompt 模板：未来跟我要 prompt 时的标准产出

下次你说"我要做 X 活动的 banner，给我 prompt"，我会按这个模板填空给你，你拿去配上活动主视觉图喂给 nano banana / gemini-3-pro-image-preview，生成完直接发给我替换：

```
[Image-to-image edit]

Reference image: [活动主视觉图 — 你上传]

Task: Transform this reference into a cinematic 16:9 banner background.

Subject: Keep the [主体描述，例如"gold OMENX coin with all engravings (OMENX, MAINNET, 2026)"] from the reference exactly as it is — preserve all materials, engravings, branding, and lighting character.

Composition:
- Aspect ratio 16:9, minimum 1600x900
- Place the subject anchored to the RIGHT 35-40% of the frame, slightly tilted, can partially bleed off the right edge
- Add environmental context behind/beneath the subject: [场景描述，例如"a pile of out-of-focus gold coins on a dark reflective surface"], shallow depth of field
- LEFT 55-60% of the frame must fade to PURE SOLID BLACK (#0A0A0A) — no light spill, no particles, no objects, no text. This is the text reservation zone.
- Single [光源方向 + 颜色，例如"warm gold rim light from upper-right"], cinematic, slightly desaturated, monochromatic [主色调] + black palette

Hard constraints (do not violate):
- NO added text, letters, numbers, logos, watermarks
- NO UI elements, cards, charts, icons, shields, badges
- NO frames, borders, rounded corners, drop shadows, sticker outlines
- NO additional foreground objects in the left 55%
- Output must feel like one continuous environmentally-lit scene, not a subject pasted onto a background
- Preserve the engravings/branding that exist on the original subject (those are product identity, not overlay text)
```

填空位（每次新 banner 我只需要替换这 4 处）：

- `[主体描述]` — 比如"purple neon protective chamber with violet particles"
- `[场景描述]` — 比如"faint volumetric purple fog and ground reflections"
- `[光源方向 + 颜色]` — 比如"neon purple rim light from upper-right"
- `[主色调]` — 比如"violet/purple"

---

## 工作流（plan 跑完之后你的迭代节奏）

1. 你想做新 banner → 告诉我活动名 + 主视觉图
2. 我按上面模板给你填好 prompt
3. 你拿 prompt + 主视觉图喂 AI 生图，挑一张满意的发我
4. 我把图存进 `src/assets/banner-{id}.jpg`，在 `banners` 数组里加一项配 `backgroundImage`，完工

不再需要重新讨论"图怎么放、要不要遮罩、左边怎么留白"——这些都已经被组件结构和 prompt 模板锁死了。

---

## 需要你确认

1. Hedge banner 的图你**这次一起跑**还是**先只接 Mainnet**？
  - 一起跑：我顺便给你 Hedge 的 prompt（紫色防护舱 + 霓虹紫光）
    &nbsp;
2. Mobile 要显示背景图，但 `object-position: left`