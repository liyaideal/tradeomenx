## 目标
将 `/hedge`（`/campaign/world-cup-polymarket-hedge`）的 Hero 重新分区，解决右侧图形区域太空、左侧标题文字换行过多问题，同时保留复古足球海报视觉。

## 方案
采用已确认的 **Asymmetric Split Poster** 方向：
- 左侧文案区占 65%，右侧图形区占 35%。
- 在右侧加上浅色纹理背景，让图形不再“飘”在空白里。
- 把 LIVE stats strip 从文案区底部抽出来，放到整个海报 frame 的底部，占满宽度。
- 桌面端 headline 因可用宽度增加而减少 awkward 换行；移动端保持现有行为（隐藏图形，保证 CTA 可达）。

## 实施步骤

1. **重构 `src/components/hedge/HedgeHero.tsx`**
   - 保持 `HedgePosterFrame` 作为外层海报框。
   - 内部改为上下两层：
     - 上层：左右分栏（`lg:flex-row`，左侧 `lg:w-[65%]`，右侧 `lg:w-[35%]`，中间加 ink 竖线）。
     - 下层：通栏 stats strip（黑底、三列、ink 分隔线）。
   - 右侧栏给 `bg-[#F3F2E7]` 并加 subtle dot pattern，居中放置缩小后的足球靶心图形（圆、`26` 水印、菱形、黄色方块、`HEDGED` stamp）。
   - 保留现有文案、H1 SEO 标题、`*not guaranteed` 脚注、CTA 组件和 alt text。

2. **图形尺寸调整**
   - 将圆环从 `h-72 w-72` 缩小到 `h-56 w-56 md:h-64 md:w-64`，配合 35% 栏宽。
   -  stamp、菱形、黄色方块等比微调，避免与文字区重叠或溢出。

3. **移动端保持**
   - 右侧图形在 `md` 以下继续隐藏（或按需要改为堆叠），确保 headline 与 CTA 不被压缩。
   - 底部 stats strip 在移动端保持三列紧凑版。

4. **`/campaign-style-guide` Playground 补全**
   - 在 Playground 新增 **Hero Layout** 区块，提供 PresetRail：
     - `Desktop`：在 1440px 宽容器渲染，展示 65/35 分区。
     - `Mobile`：在 375px 宽容器渲染，展示隐藏图形后的堆叠版。
   - 保持现有 Retro Poster tab 其余内容不变。

5. **Memory / 规范同步**
   - 更新 `.lovable/memory/design/retro-poster-campaign-style.md`，记录 Hero 构图规则：桌面 65/35 分栏、右侧 dotted texture 背景、底部通栏 stats strip。

6. **验证**
   - 桌面预览截图确认无溢出、标题换行自然、右侧无大片死区。
   - 移动预览截图确认 headline 不换行断裂、CTA 可点击、stats strip 不越界。

## 不变项
- 继续使用页级复古海报硬编码色板（`#FDFCF0` / `#0E0E0E` / `#E11D48` / `#1D4ED8` / `#FACC15`），按项目约定不加入全局 `tailwind.config.ts` 或 `index.css`。
- 不修改页面 section 顺序、不删除/新增其他 section、不改文案合同。