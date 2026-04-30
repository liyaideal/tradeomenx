我理解你的反馈：现在 `/mainnet-launch` 的问题不是功能错，而是视觉语言太模板化：大渐变、火箭插画、过多 icon/card、强营销口号堆叠，让它看起来像 AI 默认生成的 crypto landing page。

我已经阅读了 `awesome-design-md` 的结构和几个相关 design-md 参考。它的核心不是照抄某个品牌，而是先定义清楚：视觉氛围、色彩角色、字体层级、组件风格、布局原则、深度、Do/Don't、响应式规则。接下来我会按这个方式重做这页。

## 设计方向

把 Mainnet Launch 从“AI 活动页”改成更像高端交易所/金融产品的 campaign microsite：

- 主视觉从卡通火箭改为“terminal / launch window / trading grid / orbital ledger”的抽象系统图。
- 色彩从高饱和金橙渐变改为克制的黑、炭灰、暖金、少量 amber 作为交易激励信号。
- 页面结构减少一屏一堆卡片，改为更有节奏的 editorial + dashboard 混合布局。
- 保留你确认过的业务逻辑：现有交易数据计算 volume、Event 1、Event 2、倒计时、CTA 登录逻辑、首页 banner 轮播。
- 继续遵守项目规范：不在 UI 使用 emoji，视觉插画用 CSS/SVG/Lucide 完成。

## 具体改造范围

### 1. 建立页面级 design spec

我会在代码里固化一套活动landing page专用视觉规则（在以后的活动landing page可复用，产品有自己的style-guide和design.md，活动的视觉规则和产品的不要混在一起），而不是继续散落使用随机渐变和 card 样式：

- Palette：near-black canvas、graphite panels、warm gold accent、muted amber glow、green/red 只用于 trading 状态。
- Typography：更强的数字/交易终端感，标题减少超粗字体，使用更紧的 tracking 和更克制的 weight。
- Surfaces：少圆角、少阴影、更多细线、grid、坐标、分隔符。
- Motion：移除火箭浮动类动效，改为低频扫描线/脉冲/进度线。

### 2. 重做 Hero 和视觉插画

替换当前：

- 大标题 + 金色口号 + 三个统计卡 + 火箭 SVG

改为：

- 左侧：活动状态、核心规则、主 CTA、倒计时，用更少但更精确的文字。
- 右侧：抽象 launch console 视觉：
  - campaign window 时间轴
  - 5K threshold marker
  - rebate ladder nodes
  - volume signal lines
  - OX monogram / mainnet status
- 不再出现火箭、漂浮金币、sparkle 这类 AI 味强的元素。

### 3. 重做奖励结构展示

把 RewardLadder 从普通表格卡片改成更有交易产品感的 ladder / ledger 模块：

- Event 1 作为“activation threshold”模块。
- Event 2 作为横向或纵向 volume ladder。
- 明确标注 non-cumulative，但不让说明文字破坏视觉。
- 用户进度仍然用现有 volume 数据高亮当前档位。

### 4. 重做 Progress Dashboard

保留只在登录且达成 5K 后展示的逻辑，但视觉改为更像账户状态面板：

- Total Volume
- Event 1 Status
- Current Tier
- Next Unlock
- Time Left

减少大块彩色卡片，改为高密度、低装饰、数字优先的 trading dashboard。

### 5. 重做 How It Works / Rules / FAQ

减少“3 steps + icons”的 AI 模板感：

- How It Works 改成 timeline 或 instruction strip。
- Key Rules 改成 compact rule matrix。
- FAQ 保留内容，但视觉改成更轻的 disclosure list，减少大圆角 card 感。

### 6. 重做首页 banner carousel 的 Mainnet slide

当前 banner 也有同样问题：火箭 icon、强渐变、普通营销卡片。会同步改为更像 campaign ticker：

- Mainnet Launch 第一张仍然优先。
- 保留 H2E 第二张。
- Mainnet slide 使用 compact launch console / reward ticker 风格。
- 保留倒计时、Join Now、ref 参数透传。

## 技术细节

会主要修改这些已存在文件：

- `src/pages/MainnetLaunch.tsx`
- `src/components/mainnet-launch/Hero.tsx`
- `src/components/mainnet-launch/LaunchVisual.tsx`
- `src/components/mainnet-launch/RewardLadder.tsx`
- `src/components/mainnet-launch/ProgressDashboard.tsx`
- `src/components/mainnet-launch/HowItWorks.tsx`
- `src/components/mainnet-launch/KeyRules.tsx`
- `src/components/mainnet-launch/FAQ.tsx`
- `src/components/mainnet-launch/FinalCTA.tsx`
- `src/components/campaign/CampaignBannerCarousel.tsx`
- 必要时微调 `src/index.css` 和 `tailwind.config.ts` 中的 mainnet token/animation

不会改动：

- 现有交易 volume 计算 hook 的核心逻辑
- 登录弹窗和登录后跳转逻辑
- 数据库结构
- H2E banner 图片本身

## 验收标准

改完后 `/mainnet-launch` 应该满足：

- 第一眼不再像通用 AI landing page。
- 没有火箭/金币/sparkle 这类廉价活动页视觉。
- 仍然清楚表达唯一转化目标：完成第一笔 ≥5,000 USDC volume 交易。
- desktop 和 mobile 都有明确层级，不拥挤、不像模板。
- 首页 banner 的 Mainnet slide 与 landing page 风格一致。
- 所有 CTA、倒计时、进度、ref 保留原逻辑。