## 移除注册后强制引导到 Reward Center

### 现状

`src/components/rewards/RewardsWelcomeModal.tsx` 当前是**强制阻断式**弹窗：
- Dialog 的 `onOpenChange={() => {}}`（点外面/Esc 无效）
- Dialog 设置了 `hideCloseButton`（无关闭按钮）
- MobileDrawer 的 `onOpenChange={() => {}}` 注释写着 "keep open, user must navigate"
- 用户唯一出口是点 "Go to Rewards Center" 跳转

每个登录后未领取宝箱的用户进首页都会被卡住，体验上是硬引导。

### 改动目标

弹窗仍然弹出（保留运营曝光），但允许用户关闭跳过，关闭后本次会话不再打扰。

### 改动（只动 `src/components/rewards/RewardsWelcomeModal.tsx`）

**1. 加入会话级关闭状态**
```tsx
const [dismissed, setDismissed] = useState(false);
const shouldShow = !!user && !hasClaimed && !isLoading && !isAuthFlowOpen && !dismissed;
```
使用组件内 `useState`（而非 localStorage）→ 关闭后本次会话不再弹；下次刷新或重新登录如果还没领取，仍会再弹一次（保留运营提醒），但绝不会卡住用户。

**2. Dialog 允许关闭**
```diff
- <Dialog open={true} onOpenChange={() => {}}>
-   <DialogContent ... hideCloseButton>
+ <Dialog open={true} onOpenChange={(open) => !open && setDismissed(true)}>
+   <DialogContent ...>  {/* 移除 hideCloseButton，恢复右上角 X */}
```
点 X、点遮罩、按 Esc 都可以关闭。

**3. MobileDrawer 允许关闭**
```diff
- <MobileDrawer open={true} onOpenChange={() => {/* keep open */}} ... hideCloseButton={false}>
+ <MobileDrawer open={true} onOpenChange={(open) => !open && setDismissed(true)} ... hideCloseButton={false}>
```
（`hideCloseButton={false}` 已经存在，关闭按钮本身已渲染，只需让 onOpenChange 真的生效。）

**4. 在 CTA 下方增加一个 ghost "Maybe later" 按钮**（可选但推荐，让"跳过"的可点击区域更明确）
```tsx
<Button onClick={handleGoToRewards} ...>Go to Rewards Center</Button>
<Button variant="ghost" size="sm" onClick={() => setDismissed(true)} className="mt-2 text-muted-foreground">
  Maybe later
</Button>
```

**5. 更新文件顶部 JSDoc 注释**：从"必须领取才能消失"改为"未领取的用户每次会话首次访问时弹出，可关闭跳过"。

### 不改动

- `useTreasureDrop`、`FloatingRewardsButton`、`useAuthFlowStore` 等其他逻辑
- 弹窗内容（gift box / 三步说明 / 主 CTA）保持原样
- AuthDialog/AuthSheet 的注册流程不动（auth flow store 仍正常抑制弹窗）
- EventsPage / MobileHome 的挂载位置不动

### 预期效果

- 登录后未领取宝箱的用户依然会看到弹窗 → 保留转化曝光
- 用户可以通过右上角 X、点遮罩、按 Esc、或点"Maybe later"关闭 → 不再被硬阻断
- 关闭后本次会话不再打扰；下次会话仍会提醒一次
- 已领取宝箱的用户行为完全不变（弹窗本来就不显示，由 `FloatingRewardsButton` 接管）
