

## 修复 SocialProof 移动端展示 + FinalCTA 与 Footer 间距过大

### 问题 1：SocialProof 卡片在移动端被截断（看图）
- 移动端使用横向 snap-scroll，但卡片 `min-w-[280px]` + 第一张卡 `snap-start` 时正好落在屏幕左缘，右侧只露出半截卡，**第一眼看上去像 bug**——用户不知道这是可滑动列表
- 卡片内文字 `text-sm` + `p-4` 在 280px 宽里被截，"$10 hedg" 这样断字，没有视觉收尾
- 缺少 affordance（无 dots 指示器、无右侧渐隐遮罩、卡片不够"露半张"暗示可滑动）

### 问题 2：FinalCTA 与 Footer 之间空白过大（看图）
- `HedgeFinalCTA` 有 `pb-24`（96px），是为了避开 `HedgeMobileFloatingCTA`
- 同时 `HedgeLanding` 的 `<main>` 又加了 `pb-20`（80px）
- 两者叠加 → CTA 卡片底部到 Footer 之间出现 ≈ 176px 空白
- FloatingCTA 实际高度只有 ≈ 60px + safe-area，不需要这么多让位

---

### 改动

#### A. `HedgeSocialProof.tsx` — 修复移动端横滑展示

1. **卡片宽度改用 `min-w-[85vw] max-w-[320px]`**：每张卡占屏幕 85%，下一张明显"露一角"，传达可滑动信号
2. **加右侧渐隐遮罩**：在滚动容器右上方覆盖一个 `pointer-events-none` 的渐变蒙层（mobile only），暗示后面还有内容
3. **卡片内部增加 `min-h`**：让三张卡高度一致，视觉收尾干净
4. **文本紧凑**：`text-sm leading-relaxed` 改 `text-[13px] leading-relaxed`，避免字号大引起的截断感
5. **底部加滚动指示器**（mobile only）：3 个小圆点（纯视觉，不交互），`flex justify-center gap-1.5 mt-4 md:hidden`
6. **section padding 缩小**：`py-12 md:py-20` → `py-10 md:py-20`

#### B. `HedgeFinalCTA.tsx` — 移除多余底部 padding

- 把 `py-12 pb-24 md:py-24` 改为 `py-10 md:py-24`
- 保留卡片本身的视觉，只移除 section 的额外底部空白
- FloatingCTA 的让位由 `HedgeLanding` 的 `<main>` 上的 `pb-20` 统一负责，避免双重叠加

#### C. 不改动

- `HedgeLanding.tsx` 的 `pb-20 md:pb-0`（已经够 FloatingCTA 让位）
- 桌面端布局（FinalCTA 桌面 `md:py-24` 不变；SocialProof 桌面 grid 不变）
- FloatingCTA 自身、Footer 自身

### 预期效果

- 移动端 "Receipts, not promises" 部分：第一张卡完整显示，右侧露出第二张卡的边缘 + 渐隐蒙层，下方 3 个圆点指示器，用户立刻知道可以左右滑
- FinalCTA 卡片底部到 Footer 之间空白从 ≈ 176px 收紧到 ≈ 80px，视觉节奏正常，FloatingCTA 仍不遮挡

