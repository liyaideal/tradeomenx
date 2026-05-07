## 调整 /rewards 公告弹窗

两个问题一起改：

### 1. 去掉 logo 外圈
当前是「Logo + 圆形 ring + bg-primary/10 背景」，看着像贴纸徽章。改成**裸 logo**，更克制：用 `Logo size="xl"` 直接居中放在内容顶部，不加任何包裹。

### 2. 移动端改用 MobileDrawer 抽屉（符合规范）
当前 mobile + desktop 都用同一个 `Dialog`，移动端应该用项目内已有的 `MobileDrawer`（底部抽屉）。

实现：
- 抽出 `pausedContent`（裸 Logo + 标题 + 描述）共用
- Desktop：`Dialog` + `[&>button]:hidden` + 阻止所有关闭交互（不变）
- Mobile：`MobileDrawer` 用 `open={true}` + `onOpenChange={() => {}}` + `showHandle={false}` + `hideCloseButton={true}`，无 X、无拖拽手柄、点遮罩不关

### 改动文件
- `src/pages/Rewards.tsx`（仅这一个文件）

确认后立即应用。
