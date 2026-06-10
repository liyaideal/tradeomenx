## 目标
让 `WorldCupTeaserPanel` 摆脱"AI 默认模版"感，加入世界杯专属视觉锤。**仅改这一个组件**，不动 Live 面板和 launcher。

## 1. 大力神杯底图

**素材**：用 imagegen 生成一张大力神杯剪影 PNG（透明背景，金色，正面 3/4 角度），存 `src/assets/trophy-silhouette.png`，通过 `lovable-assets` 上传成 CDN 资产（避免 binary 进 repo）。

**集成**：在卡片内层（`bg-[#0c0c0e]` 那一层）多加一层绝对定位的奖杯图，参数：
- `right: -20%; bottom: -15%`，旋转 -8°，缩放到约 380px
- `opacity: 0.18`，`mix-blend-mode: screen`
- 叠一层径向金光 `radial-gradient(circle at 75% 70%, rgba(250,204,21,0.25), transparent 55%)` 在奖杯后面
- `pointer-events: none`，所有现有前景元素（倒计时、opening match、CTA）层级保持在上

视觉效果：金色奖杯从右下背后透出，倒计时数字飘在奖杯前面，整张卡变成"奖杯本体 + 数据浮层"。

## 2. 倒计时翻牌微动画

改写 `Cell` 组件：
- 监听 `value` 变化，旧值上滑淡出 / 新值从下滑入，180ms `cubic-bezier(0.4, 0, 0.2, 1)`
- 用一个简单的 `useEffect + useState` 跟踪 `prevValue`，配合两个绝对定位的 span 做 enter/exit
- 中间那条 `bg-black/60` 横线（翻牌轴）保留，强化机械翻牌质感
- 不引入第三方动画库，纯 CSS keyframes 加在组件内 `<style>` 里

避免每帧都跑动画（秒每秒变，分钟每分钟才变），只在值真的变化时触发。

## 3. 国旗轻微飘动

把现在两个静态 `<div>` 国旗换成 SVG（更可控）。给 SVG 加 CSS：
```css
@keyframes flag-wave { 0%,100% { transform: skewY(-1deg) scaleX(1); } 50% { transform: skewY(1deg) scaleX(1.02); } }
animation: flag-wave 3.5s ease-in-out infinite;
transform-origin: left center;
```
墨西哥旗和南非旗用不同的 `animation-delay`（0s / 0.7s）错峰，避免同步像机械摆动。

## 4. Playground 同步

`WorldCupSection.tsx` 的 teaser preset 区已经覆盖 4 个时间档（30d / 2d / 90m / 45s），不动；自动继承新视觉。Live 面板不动。

## 不动的部分
- Live 面板（`WorldCupPanel`）
- `SportsLauncher`
- 桌面/移动隔离规则（`hidden md:block`）
- BottomNav

## 风险点
- 奖杯 PNG 不能抢戏：opacity 必须压到 0.15–0.20，否则倒计时数字读不清，需要在生成图后实际预览微调
- 翻牌动画在 1Hz 刷新下可能略显躁动，如果你看了觉得太花可以只保留秒位翻牌
