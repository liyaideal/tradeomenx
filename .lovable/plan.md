

# 恢复移动端 Events 页面右上角 Resolved 入口

## 问题
移动端 EventsPage 的 MobileHeader 只传了 `showLogo`，没有提供右上角的 Resolved 切换入口。桌面端的 EventsDesktopHeader 有 "Resolved" 导航链接，但移动端丢失了。

## 方案
在 EventsPage 中，给移动端 MobileHeader 传入 `rightContent`，渲染一个导航到 `/resolved` 的按钮（使用 Lucide 的 `CheckCircle2` 或 `Archive` 图标 + "Resolved" 文字），点击跳转到 `/resolved` 页面。

## 修改文件

### `src/pages/EventsPage.tsx`
- 在移动端 MobileHeader 添加 `rightContent` prop
- 渲染一个小按钮，包含图标 + "Resolved" 文字，点击时 `navigate("/resolved")`
- 样式保持与 MobileHeader 右侧其他按钮一致（text-muted-foreground, text-xs）

