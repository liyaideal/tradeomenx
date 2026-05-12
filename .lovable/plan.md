## 背景

当前 desktop header logo 使用 `Logo size="lg"`（h-6 = 24px），这是 DESIGN.md 当前规定的"Desktop navigation"标准尺寸。但由于上一轮 header 精简后元素减少、左右留白变多，24px 在视觉权重上偏弱，品牌存在感不足。

Logo 尺寸阶梯（`src/components/Logo.tsx`）：
- sm: h-4 (16px)
- md: h-5 (20px) — 移动端默认
- lg: h-6 (24px) — 当前 desktop
- xl: h-8 (32px) — 当前用于 landing / footer

## 方案

将 desktop header logo 从 `lg` 升级到 `xl`（24px → 32px），并同步更新 DESIGN.md 规范，让规范和实现保持一致。Mobile 不变，仍用 md。

### 视觉效果对照

```text
当前 (lg / h-6 = 24px):
  [OMENX](24)  [MAINNET]   Events  Insights  Leaderboard  Portfolio

调整后 (xl / h-8 = 32px):
  [ OMENX ](32)  [MAINNET]   Events  Insights  Leaderboard  Portfolio
```

字号上 nav text 是 14px 左右，logo 32px 与之形成更明确的主次对比，品牌感更强；同时 32px 仍在标准尺寸阶梯内，无需新增 size。

### 修改清单

1. **`src/components/EventsDesktopHeader.tsx`** (line 93)
   - `<Logo size="lg" />` → `<Logo size="xl" />`
   - `MainnetBadge` 会自动跟随升到 `md` size（Logo.tsx 已有逻辑：xl/lg 都给 md badge），无需额外改动

2. **`DESIGN.md`** (line 454)
   - 将 "Desktop navigation | `lg` (h-6) | Left side of top nav" 改为 "Desktop navigation | `xl` (h-8) | Left side of top nav"
   - 在 Marketing / landing 行加注，避免与 desktop nav 混淆（例如 landing hero 可继续用 xl，但若需更大可后续考虑新增 2xl）

3. **memory `mem://design/project-design-specification`**：如指向 DESIGN.md，无需变更；若内联了尺寸表，需同步该一行。

### 不动的部分

- Mobile header logo（保持 md / h-5）
- sm/md/lg 三档定义本身（其它地方仍在用）
- Header 上的 nav 项、布局、间距
- MainnetBadge 自身样式

### 验证

- 1024px / 1440px 视口下截图，确认 logo 与 nav text 主次关系清晰、不挤占 nav 空间
- 移动端截图确认未受影响
