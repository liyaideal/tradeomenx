## 目标

把移动端底部 nav 中间的 Sports 入口从「金色 Trophy + LIVE 角标」改成 C 方案的「金色圆盘 + 旋转足球 + 上下浮动」动效徽章，链接保持 `https://omenx-sports.lovable.app`，去掉所有 LIVE/SOON 状态判断。

## 改动范围

仅 `src/components/BottomNav.tsx`。`src/lib/worldCup.ts` 中 `SPORTS_URL` 已是目标地址，无需改动。

## 具体修改

1. **移除 `getWorldCupPhase` 引用**：BottomNav 不再读取赛事阶段，删除 import。
2. **新增内联 `SoccerBallIcon` 组件**：用 design direction C 里的 SVG path（圆 + 五边形 + 黑斑块），`fill="currentColor"`，方便用 text 颜色控制。
3. **替换中间 featured 渲染分支**：
   - 外层容器 `flex flex-col items-center gap-1 -mt-2 w-20`
   - 浮动层：`animate-[ballBounce_2s_ease-in-out_infinite]`
   - 金盘：`w-10 h-10 rounded-full bg-gradient-to-b from-amber-400 to-amber-600` + `drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]` + 内圈 `border border-white/20`
   - 内层旋转：`animate-[ballSpin_8s_linear_infinite] w-8 h-8 text-[hsl(var(--background))]`，里面放 `SoccerBallIcon`
   - Label：`text-[10px] font-bold tracking-wide uppercase text-amber-500`，文字 `Sports`
   - 点击：`window.open(SPORTS_LINK, "_blank", "noopener,noreferrer")` + 中等触感
   - 不再渲染 LIVE / SOON 角标
4. **注册关键帧动画**：在 `tailwind.config.ts` 的 `keyframes` 里加 `ballSpin`（0→360deg 旋转）和 `ballBounce`（translateY 0 → -4px → 0），并在 `animation` 里暴露 `ball-spin: ballSpin 8s linear infinite` 与 `ball-bounce: ballBounce 2s ease-in-out infinite`，组件直接用 `animate-ball-spin` / `animate-ball-bounce` 替代上面的 arbitrary value 写法（更整洁，并符合项目动画系统规范）。
5. 不动桌面端、不动 Me 抽屉里的 Leaderboard、不动其他 nav item。

## 不会动的部分

- `src/lib/worldCup.ts`
- `WorldCupPanel.tsx` / `WorldCupPortal.tsx` / 桌面 `EventsPage` 上的预告 panel
- 其他页面/路由

## 视觉参考

用户已选 prototype C：金色渐变圆盘内放慢转足球，整体 2s 一次轻微上下浮动，无 LIVE 角标，label 全大写金色 "Sports"。