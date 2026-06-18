
## 问题诊断

参考你贴的截图，当前 `HedgeHowItWorks` 里 `Your pick wins / Your pick misses` 用两张独立的 `HedgePosterFrame` 卡片并排呈现。两个真实问题：

1. **蓝色 offset shadow 看起来"断开"**  
   `HedgePosterFrame` 用 `boxShadow: 12px 12px 0 0 #1D4ED8` 画偏移块。当 shadow 色 (`#1D4ED8`) 跟卡内蓝色 badge 完全同色时，眼睛会把 shadow 右上角 12px × 12px 的空白处理成"边框跟阴影中间裂了一道缝"。红卡因为 badge 是 `#E11D48`、shadow 跟卡内没有第二处大块红色，所以不会读出这种断裂。

2. **两张卡片各管各，看不出对比关系**  
   它们当前只是网格里 side-by-side，颜色不同 + 文案不同，但视觉上没有"同一件事 → 两种结局"的叙事钩子（没有共享标题、没有分隔线、没有对照符号、没有结构上的镜像）。

---

## 方案：把"两张卡" → "一张对照海报"

新建组件 `HedgeOutcomeSplit`（替换 `HedgeHowItWorks` 里 OUTCOMES 那个 grid 块），布局如下：

```text
┌──────────────────────────────────────────────────────────────┐
│  TWO OUTCOMES, ONE HEDGE                                     │ ← 共享 eyebrow
│                                                              │
│  ┌──────────────────────┐  ╳  ┌──────────────────────┐       │
│  │ [YOUR PICK WINS]     │     │ [YOUR PICK MISSES]   │       │
│  │ blue stamp           │     │ red stamp            │       │
│  │                      │     │                      │       │
│  │ Polymarket upside    │     │ OmenX hedge          │       │
│  │ stays 100% yours.    │     │ closes in profit →   │       │
│  │                      │     │ redeem up to 500U.   │       │
│  │ ── 加 metric chip ── │     │ ── 加 metric chip ── │       │
│  │  Polymarket: KEEP    │     │  OmenX hedge: +PnL   │       │
│  │  OmenX hedge: -      │     │  Reward cap: 500U    │       │
│  └──────────────────────┘     └──────────────────────┘       │
│         ▲ 同一个外框 + ink border + yellow offset shadow      │
└──────────────────────────────────────────────────────────────┘
```

关键改动：

- **外层一个大 `HedgePosterFrame`**（`shadow="yellow"` 或 `"ink"`，避开蓝色），里面用 2 列等分的内部分栏，中间画一条 4px 黑色实线 + 一个 `╳`/`VS` 的圆形邮戳。两个分栏共享同一张纸 → 一眼就是"对比关系"。
- **左右内部分栏不再各自加 offset shadow**，只保留 badge 色块 + 顶部细色条 (`border-t-4 border-[#1D4ED8]` 左 / `border-[#E11D48]` 右)，色彩仍然区分 win/miss，但不会再出现"黑框和蓝框分开"的视觉断裂。
- **每栏底部加 2 行 metric chip**，强化对比维度：
  - 左：`Polymarket P&L: KEEP 100%` / `OmenX hedge: closed`
  - 右：`Polymarket P&L: − (your pick lost)` / `OmenX hedge: + PnL, redeem ≤ 500U`
  这样两栏不仅颜色对照，文字结构也镜像，对比一目了然。
- **顶部 eyebrow 改为 `TWO OUTCOMES · ONE HEDGE`**，明确"这是一组对比"。
- 保留下方黄色 reassurance 条不动。

## 不动的部分

- `HedgePosterFrame` 组件本身不改（其它地方还在用，blue shadow 在 hero 等场景没问题，只在这里因为同色 badge 才读出断裂，所以从用法层规避而不是改组件）。
- `HedgeHowItWorks` 的 `STEPS` 三步走那块完全不动。
- 文案除了 eyebrow + 新增 metric chip 之外，主体两句保留原意。

## 涉及文件

- 新建 `src/components/hedge/HedgeOutcomeSplit.tsx`
- 改 `src/components/hedge/HedgeHowItWorks.tsx`：移除 `OUTCOMES` 渲染段，替换为 `<HedgeOutcomeSplit />`
- `/campaign/world-cup-polymarket-hedge` 自动跟随，无需路由改动
- Style Guide playground（如果展示了 outcomes 卡）顺手加一个 section 展示新的 `HedgeOutcomeSplit`，保持 playground 状态覆盖规范

确认这个方向就开工。
