## 目标

把 pending airdrop 的倒计时从按钮"下方一行"挪到"按钮内部"，让按钮自带紧迫感，颜色与按钮风格统一，不再额外占垂直空间。

## 新按钮布局

按钮内文案改为两段式（结构 `Activate · 47h 6m`）：

- 左：闪电图标 + `Activate`
- 中间：一根低透明度竖分隔（`opacity-40`）
- 右：font-mono 的剩余时间 `47h 6m`

样式细节：

- 整颗按钮维持 `btn-primary` / 紫色主调，不改主色。
- 倒计时部分用 `font-mono`，颜色 `text-primary-foreground/80`（默认状态稍弱化，避免抢主标）。
- 当 `urgent`（< 1h）：整颗按钮变体切到 `bg-trading-red hover:bg-trading-red/90`，倒计时部分变 `text-white font-semibold`，整体给紧迫信号；图标也跟着继承色。
- 按钮宽度撑开（去掉之前固定 h-7 紧凑约束之外，按需要给一点 `min-w-[120px]`），确保 `47h 6m` 不换行。
- 加载中（`isActivating`）只显示 `Loader2 + Activating…`，隐藏倒计时段。

提取一个共享小组件 `src/components/ActivateAirdropButton.tsx`：

```
ActivateAirdropButton({ expiresAt, onClick, isActivating, variant: "table" | "trading" })
```

- 内部用 `useCountdown`。
- `variant="table"`：复用 shadcn `Button`，紫色 `btn-primary`，高度 `h-7`，文字 `text-xs`。
- `variant="trading"`：复用 `DesktopTrading.tsx` 里原生 `<button>` 的外观（`border border-primary/50 text-primary hover:bg-primary/10`），urgent 时切到红色边框 + 红色文字（保持 outline 风格，与该表其他按钮一致，不强行变实心）。
- 内部只渲染按钮，调用方负责包裹 `td` / cell。
- isExpired 时返回 `null`（让外层按既有逻辑去隐藏整行，无需改）。

## 受影响文件

- 新增：`src/components/ActivateAirdropButton.tsx`
- 修改：
  - `src/pages/PortfolioAirdrops.tsx`：移除内部 `PendingExpiresIn` 组件 + 改用 `ActivateAirdropButton variant="table"`，去掉外层 `flex-col` 包裹，恢复成单按钮 cell。
  - `src/pages/DesktopTrading.tsx`：移除本地 `PendingExpiresIn` + `useExpiryCountdown`（如果仅此一处用），改用 `ActivateAirdropButton variant="trading"`。
  - `src/components/AirdropPositionCard.tsx`（移动端卡片）：同样把按钮下那行 `Expires in {timeLeft}` 拿掉，让 Activate 按钮也走 `ActivateAirdropButton variant="table"`（移动卡片宽度足够），但保留卡片顶部 header 的 Clock 标签作为宏观提示。

## 不做的事

- 不改 `useCountdown` 的逻辑、阈值、刷新频率。
- 不改 banner 文案。
- 不改 expiry 行为或 72h 规则。
- 不改其他按钮颜色 / 整体按钮 token。

## 验收

- 桌面 airdrops 表格、交易页 PENDING 行、移动卡片：Activate 按钮内部右侧直接显示 `47h 6m`，颜色与按钮和谐。
- 剩余 < 1h：按钮整体（或边框）变红，倒计时加粗。
- 按钮下方不再有额外一行黄字。
- 激活中显示 `Activating…`，不再显示倒计时。