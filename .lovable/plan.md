# Mobile 版 ActivationHero 适配

## 背景
`/wallet` 页面顶部的 Mainnet Activation 模块（`src/components/activation/ActivationHero.tsx`）在桌面端表现良好，但在 mobile（390px）上：
- 标题字号过大，"You're funded — make your first real trade" 换行后整块过高
- Step 1/2/3 三个卡片横向 3 列挤压严重，文字溢出
- 底部 "Browse markets" + "Why mainnet?" 两个按钮并排在窄屏下挤占空间
- 整张卡片在首屏占比过大，超出预期展示比例

## 方案
保持组件 API 不变，内部根据 `useIsMobile()` 渲染两套布局，桌面端逻辑完全不动。

### Mobile 版本设计要点（紧凑信息卡）
1. **顶部标识行**：MainnetBadge（size="sm"）+ "Activation" 标签，保持现状但缩小
2. **标题**：降到 `text-base font-semibold`，行高收紧；副标题降到 `text-xs`，最多 2 行
3. **Steps 区域**：改为单行水平 stepper（圆点 + 序号 + 简短 label），不再用 3 个卡片
   - 形态：`[1 Deposit] —— [2 Trade] —— [3 Rebates]`
   - 已完成步骤显示绿色圆点 + 删除线，未完成显示空心圆
   - 高度从 ~64px 降到 ~28px
4. **CTA**：仅保留主按钮 "Deposit now / Browse markets"（全宽，h-10）
   - "Why mainnet?" 降级为按钮下方一行带箭头的文字链接（`text-xs text-muted-foreground underline`），点击跳 `/mainnet-launch`
5. **整体内边距**：从 `p-5` 改为 `p-4`，背景光晕缩小避免溢出

### 实现细节
- 文件：仅修改 `src/components/activation/ActivationHero.tsx`
- 引入 `useIsMobile` hook，未确定 viewport 时（undefined）按桌面渲染避免闪烁
- 抽出 `DesktopLayout` / `MobileLayout` 两个内部子组件，共享 headline/subline/primaryCta 数据
- Style Guide 中如有该模块预览，同步在 Mobile Home section 里展示新版本（待确认）

### 不改动
- 业务逻辑：`useActivationState`、显示/隐藏条件、跳转路由
- 桌面端视觉
- `ActivationChecklist`（首页 mobile 用的是它，不是 ActivationHero）

## 验收
- 390px viewport：卡片高度 ≤ 240px，无文字溢出，三个 step 单行排布
- 桌面端：完全无变化
- S0 与 S1 两种文案都能正确显示
