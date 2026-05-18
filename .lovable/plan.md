# Mobile /wallet 视觉一致性梳理

## 现状梳理（mobile 390px）

| 模块 | 当前状态 | 主要问题 |
|---|---|---|
| ActivationHero | 刚做了 mobile 紧凑版 | OK |
| BalanceCard | 桌面端样式直接复用 | 数字 `text-4xl` 偏大、装饰光晕过强；4 个 sub-card 多行排布；按钮 h-12 |
| H2eRewardsCard | 已有 mobile 专属时间线（`sm:hidden`） | 标题用 `text-sm font-semibold`，与其它模块标题不对齐 |
| PendingConfirmations | **无 mobile 适配**，桌面卡片直接搬 | 内边距、字号、按钮都是桌面尺寸 |
| SavedAddressesList | 标题 `text-lg font-semibold` + AddressCard | 标题层级与其它模块不一致；卡片底部 Set Default + Delete 两个 ghost 按钮过于松散 |
| TransactionHistory | 有 mobile 分支 | 风格基本 OK，但卡片外层圆角/内边距与其它模块不统一 |

整体不协调的根因：
1. **视觉权重失衡**：BalanceCard 像 hero，下方模块都很"轻"，对比强烈
2. **标题层级混乱**：三种 — 没标题 / `text-sm font-semibold` / `text-lg font-semibold`
3. **容器规范不一**：圆角混用 `rounded-2xl`/`rounded-xl`，内边距 `p-6`/`p-4`/`p-3`
4. **节奏**：`space-y-6` 全局间距 OK，但模块内部留白差异让节奏断

## 改造方案（仅 mobile 分支，桌面端不动）

### 1. 建立 mobile 卡片标准
所有顶层卡片统一：
- 容器：`rounded-2xl border border-border/50 bg-card p-4`
- 模块标题：`text-sm font-semibold text-foreground`（与图标 16px 同行），右侧次要信息用 `text-xs text-muted-foreground`
- 模块间距：保持 `space-y-4`（从 6 收一档），更紧凑

### 2. BalanceCard（mobile）瘦身
- 主数字 `text-4xl` → `text-3xl`，仍保留 `font-mono font-bold`
- 顶部装饰从两个发光圆斑减为一个、模糊度降低；保留 primary 渐变身份
- Total Equity 头部图标缩到 24px，去掉圆形背景，纯图标 + 文字一行
- 4 个 sub-card 统一改为 2 列 `gap-2`，padding 从 `p-3` → `p-2.5`，字号 `text-xs`，数值 `text-sm`
- Deposit / Withdraw 按钮 `h-12` → `h-11`，与 ActivationHero CTA 对齐

### 3. H2eRewardsCard（mobile）对齐标题样式
- 外层容器统一：`rounded-2xl border-border/50 bg-card p-4`（去掉 `border-primary/20 bg-primary/5`，改为内部用 primary 强调进度条/锁定标）
- 标题保留现有 `Gift + Hedge Airdrop Rewards`，已是 `text-sm font-semibold` ✓
- 标题右侧补一个简洁的 `Earned $X.XX` 摘要，避免下方信息过密

### 4. PendingConfirmations 新增 mobile 适配
- 容器套用标准卡片
- 标题加上：`<Clock /> Pending confirmations · {count}`
- 每条 tx 用紧凑两行排版（金额 + network · 状态 / 进度条 + 时间），按钮 ghost、icon-only
- 不展开时只显示前 1 条 + "X more"，减少首屏占位

### 5. SavedAddressesList（mobile）层级降级
- 标题从 `text-lg font-semibold` → `text-sm font-semibold`，与其它模块对齐
- 整体外层套标准卡片容器，让所有地址 + Add Address 按钮在一个卡片内
- AddressCard 内部：地址行字号收紧；底部 Set Default / Delete 改成 icon-only 按钮放在卡片右上角，节省垂直空间
- "Add Address" 按钮高度从默认 → `h-10`，与其它 CTA 节奏一致

### 6. TransactionHistory（mobile 分支）容器对齐
- 把外层 wrapper 改为标准卡片样式
- 标题 `Transaction History` 统一到 `text-sm font-semibold`

### 7. 全局节奏
- 外层 `<div className="px-4 py-6 space-y-6">` → `space-y-4`（更紧凑、节奏一致）
- 页面底部 `pb-24` 保留（BottomNav 占位）

## 不改动
- 业务逻辑 / 数据流
- 桌面端 `if (!isMobile)` 分支
- ActivationHero（刚改完）
- 弹窗/Drawer 行为

## 验收
- 390 viewport：所有顶层模块视觉权重接近，标题字号一致，圆角/内边距统一
- BalanceCard 仍是视觉焦点但不再"撑破"
- PendingConfirmations 不再像桌面卡片硬搬
- SavedAddresses 一屏内能看到至少 2 个地址 + 添加入口
