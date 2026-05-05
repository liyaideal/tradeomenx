## 背景

上一轮我把 prompt 完全通用化是错的。正确口径是：

- **Subject 不描述**（subject = 上传的参考图，pixel-faithful 保留）
- **Environment 必须 per-campaign 描述**（金币堆 vs 紫色雾舱是世界观基础，不写 AI 只会给一片黑）

模板要保留 3 个 slot：`SCENE_CONTEXT` / `LIGHT_DIRECTION_AND_COLOR` / `DOMINANT_COLOR`，但严格限定这 3 个 slot **只描述环境，不准描述 subject 的形状/材质/文字**。

## 改动

### 1. `.lovable/memory/design/campaign-banner-template.md`

替换 "Reusable AI prompt template" 整段（L47-L77）：
- 加一段说明：模板分"固定脚手架"+"per-campaign 环境块（3 slot）"两部分；3 个 slot 只描述环境，绝不描述 subject
- prompt 正文里把 "Scene extension" 段改成包含 `{SCENE_CONTEXT}`，"Lighting & color" 段改成包含 `{LIGHT_DIRECTION_AND_COLOR}` + `{DOMINANT_COLOR}`
- 主视觉锚定保持 right 25-32%，allow slight tilt
- 左 60% 纯黑、21:9、所有 hard constraints 不变
- 加 "Slot examples" 小节，给 Mainnet / Hedge 两个示例填法

### 2. `scripts/validate-banner-prompt.mjs`

- 新增必含规则 `scene-context-described`：检测 prompt 是否包含具体的环境描述（关键词如 `pile of`, `coins`, `fog`, `bokeh`, `surface`, `floor`, `particles`, `mist` 等任一），防止又退回成空泛的 "extend the surrounding environment"
- 新增必含规则 `light-direction-described`：检测光线描述（`rim light`, `from upper-`, `falloff`, `underglow` 等任一）
- 新增必含规则 `monochrome-color-stated`：检测 `monochromatic` + 颜色词（`gold`, `purple`, `violet`, `green`, `cyan` 等）
- 现有 `aspect-21-9` / `right-anchor-25-32` / `left-black-zone` / `extend-only` / `pixel-faithful-preservation` / `preserve-text-logos` / `no-new-additions` / 4 条 forbidden 全部保留

### 3. 自测

把模板里 Mainnet 示例填好后跑校验脚本，确保 PASS。

### 4. 给用户两份成品 prompt

执行完模板更新后，直接在回复里输出：
- **Mainnet 21:9 prompt**：填好 mainnet slot（金币堆 + warm gold rim light + warm gold）
- **Hedge 21:9 prompt**：填好 hedge slot（紫雾 + neon purple rim light + electric violet）

两份 prompt 都先跑一遍校验脚本，PASS 后才给用户。

## 不动的部分

- `CampaignBannerCarousel.tsx` 不动（CSS 已经是 `object-cover object-right`，21:9 源图直接生效）
- 现有 `banner-mainnet-launch.jpg` / `banner-hedge.jpg` 等用户拿到新 21:9 图后回传，我替换文件即可
