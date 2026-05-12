## 原因诊断

`MainnetBadge` 组件 prop `responsive` 默认 `true`，应用 `hidden sm:inline-flex`，在 <640px 视口直接 CSS 隐藏。`Logo` 组件渲染胶囊时未传 `responsive={false}`，所以走默认值 → 移动端永远看不到。

注释说明历史原因是"避免 header overflow on narrow viewports"——上一轮 desktop header 还很挤时设的保险。但移动端首页 header 现状是：左 Logo（h-5）+ 大段空白 + 右 avatar/menu，完全有空间放胶囊（约 70px 宽）。

## 方案

让 `Logo` 在所有视口都显示 Mainnet 胶囊，去掉移动端隐藏逻辑。

### 改动

**`src/components/Logo.tsx`** (line 26)
- 把 `<MainnetBadge size={badgeSize} />` 改成 `<MainnetBadge size={badgeSize} responsive={false} />`

这样所有用 `<Logo>` 渲染的位置（desktop header / mobile header）胶囊都会显示，是品牌信号的一致呈现。

### 不动

- `MainnetBadge` 组件本身保留 `responsive` prop 和默认 `true` 的行为，便于后续在窄边角场景仍能复用 (例如 ActivationHero)
- ActivationHero 用法不变（它显式传 `size="md"`，没传 responsive，但它在 hero 内有充裕空间，胶囊本来也能显示在 sm+；保持行为）
- Mobile header layout 不动

### 验证

- 移动端 390px 首页 `/` 可见 OMENX logo 右侧的绿色 Mainnet 胶囊
- 移动端 detail 页（带 back + Logo）也能见
- 桌面端无变化
- header 不出现换行/溢出
