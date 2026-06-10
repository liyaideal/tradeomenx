## 目标

1. **SportsLauncher（左下金球 pill）** 改成桌面独占；移除内部 mobile collapse 逻辑
2. **WorldCupPortal（右下悬浮 Teaser/Live 面板）** 改成桌面独占；移动端任何路由都不出现
3. 同步整理 `/style-guide` Sports launcher 小节
4. **不动 BottomNav 的 Sports 入口**（用户已做完，明令禁止改动）

## 1. `src/components/world-cup/WorldCupPortal.tsx`

把渲染结果包一层 `<div className="hidden md:block">`，确保 `/events`、未来任何挂 Portal 的页面在移动端都不渲染。这是统一收口，比改各个 Page 干净。

```tsx
export const WorldCupPortal = () => {
  const phase = getWorldCupPhase();
  if (phase === "off") return null;
  return (
    <div className="hidden md:block">
      {phase === "teaser" ? <WorldCupTeaserPanel /> : <WorldCupPanel />}
    </div>
  );
};
```

（Style-guide 里直接渲染 `WorldCupPanel` / `WorldCupTeaserPanel` 的 demo 不受影响，因为它们不走 Portal。）

## 2. `src/components/SportsLauncher.tsx`

- 删 props：`forceCollapsed`
- 删 `collapsedClass` 变量与所有 `max-[479px]:*` collapse 类
- 容器加 `hidden md:block`（从源头堵移动端）
- 顶部加注释：`/** Desktop-only. Mobile Sports entry lives in BottomNav. */`

## 3. `src/pages/StyleGuide/sections/WorldCupSection.tsx`

- 顶部段落补一句：
  - "Teaser 和 Live 面板（右下悬浮）以及 Sports launcher（左下 pill）**均为桌面独占**。移动端 Sports 入口由 BottomNav 独立维护，不在此页演示。"
- `LAUNCHER_PRESETS` 移除 `collapsed`，剩 `default / hovered / dismissed`
- `SportsLauncherPlayground` 移除 `forceCollapsed` prop 传递
- 小节标题改成：`Sports launcher (desktop only · floating, bottom-left)`

## 4. Memory

更新 `.lovable/memory/features/sports-launcher.md`：
- 明确 "Desktop only (≥md breakpoint). Mobile Sports entry owned by BottomNav, decoupled from this component."
- 同步备注：WorldCupPortal 也是桌面独占，移动端不挂载

## 不动

- BottomNav 及其 Sports 入口
- WorldCupPanel / WorldCupTeaserPanel 组件本身（仅在 Portal 外包裹层做断点）
- 桌面端 launcher 视觉
- EventsPage 其他逻辑

## 验收

- 移动视口 375px 访问 `/`、`/events`、`/wallet`：DOM 里既无 `SportsLauncher` 也无 `WorldCupPanel`/`WorldCupTeaserPanel`
- 桌面视口 ≥768px 访问 `/events`：右下 Portal + 左下 Launcher 都正常
- `/style-guide` Sports launcher 小节只剩 3 个 preset，文案明示桌面独占
