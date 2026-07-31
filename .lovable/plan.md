## 现状

`src/components/BottomNav.tsx` 底栏容器用的是：

```tsx
<div className="flex justify-around items-end max-w-md mx-auto">
```

`justify-around` 是**按内容宽度分配剩余空间**，不是四等分。四个按钮的内容宽度不同（"Events" 比 "Me" 宽很多，且 Me 在登录态是 24px 头像、未登录是 20px 图标），所以每个按钮的中心点不会落在 1/8、3/8、5/8、7/8 的位置——视觉上就是你看到的"左密右疏、不平衡"。

另外 `items-end` 让高度不同的按钮（头像 24px vs 图标 20px）底部对齐，图标行也会轻微错位。

## 改法

只动 `src/components/BottomNav.tsx` 的布局类，不改任何行为逻辑：

1. 容器从 `flex justify-around items-end` 改为 `grid grid-cols-4 items-center`，四列真正等宽，每个按钮的中心固定在各自 1/4 栏的中点。
2. 每个按钮加 `w-full`（或 `justify-self-stretch`），让点击热区也是等宽的 1/4，而不是只有文字那么宽。
3. 统一图标行高度：给头像/图标外层一个固定 `h-5`（或 `h-6`）的居中容器，使登录态（头像）和未登录态（User 图标）、以及三个 nav 图标的基线一致，`items-end` 换成 `items-center`。
4. 保留现有的 `scale-110` 激活动效、haptic、路由逻辑不变。

## 技术细节

- 文件：`src/components/BottomNav.tsx`，只改 `<nav>` 内 wrapper div 与 4 个 `<button>` 的 className。
- `max-w-md mx-auto` 保留，窄屏下四列自适应等分。
- 缩放动效在 grid 下不会撑破布局（transform 不影响 layout 盒），无需额外处理。
