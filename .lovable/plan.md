## 目标
把 `WorldCupPanel.tsx`（Live/Tournament Window）改造成与 `WorldCupTeaserPanel` 一致的视觉体系，保留现有的数据结构（live + upcoming + CTA）和文案语义，不动 `WorldCupPanel.data.ts`。

## 复用的设计元素（来自 teaser）
1. **外壳**：`bg-[#0B1410]` + `border-[1.5px] border-[#2A3B2E]` + `rounded-2xl`，去掉当前那条彩色渐变描边
2. **顶部三色 host stripe**：5px 红/绿/蓝（#C8102E / #007A33 / #0033A0），覆盖原 LIVE 时仍保留
3. **舞台光晕**：两层 radial gradient 黄绿色背景层（opacity 0.3）
4. **大力神杯剪影**：右上角小尺寸（≈42% 宽，max 180px），rotate(8deg)，opacity 0.55，mix-blend screen，配 halo
5. **Header**：圆形金边奖杯图标（Trophy icon）+ "WORLD CUP 2026" (Bebas Neue, 黄渐变) + 副标题 "United · Mexico · Canada"；右侧 X 关闭按钮（#5F7A66 → white）
6. **分割条**：`hairline — accent label — hairline`，金色 #C9A227 Bebas Neue 小标签，分别用作 "Live Now" 和 "Coming Up Next"
7. **CTA**：纯金底 #E8C547，深色文字 (#3A2E08)，"OPEN OMENX SPORTS"（Bebas Neue, tracking-[0.2em]）+ 箭头
8. **底部状态条**：绿色脉冲点 #1D9E75 + uppercase 小字 "Tournament in progress" 之类

## Live 区块改造
- LIVE 徽章保持红底白字 + pulse，但圆角和阴影对齐 teaser tone
- 分钟数：金色 #C9A227 mono 字体（替换原 green-400）
- 比分行：保留三栏，国旗用与 teaser 相同的「带白色边框 + 圆角 + 内部 overflow-hidden + shimmer 扫光 overlay」结构（复用 `wc-shimmer-overlay`），仍按 `live.homeFlag.primary` 渲染主色（或简单平铺主色，不展开多色 svg，避免改 data 文件）
- 比分字体保留 Anton，颜色 white，冒号用 #C9A227

## Coming Up Next 列表
- 分隔条改成金色 hairline + label 样式
- 行内：双国旗 chip（同上结构）+ 队名 mono → 改为 Anton 小号 white；时间 pill 保留 mono，背景换成 `bg-[#13231A] border border-[#2C4434] text-[#7FA088]`
- hover 背景换成 `bg-white/[0.02]`，保留可点击

## 文件改动
- 只改 `src/components/world-cup/WorldCupPanel.tsx`
- 复制 teaser 的 `<style>` 块（wc-shimmer / wc-trophy-glow 关键帧）和 trophy 资源 import (`trophyAsset`)
- 不动 `WorldCupPanel.data.ts`、`WorldCupTeaserPanel.tsx`、`WorldCupPortal.tsx`

## 验证
- `/style-guide` 的 LIVE (TOURNAMENT WINDOW) 4 种 preset（Live + Upcoming / Pre-match no live / Between matches / Single live）逐个截图，确认：
  - 三色 stripe + 奖杯剪影都不挡 CTA 与 LIVE 比分
  - 没有 live 时上半区只剩 Coming Up Next，奖杯仍在右上
  - 单场 live、无 upcoming 时也能正常居中
