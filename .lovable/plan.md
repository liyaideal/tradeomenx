## 目标

让 `/settings/transparency` → "Am I Being Overcharged?" 中的 **持仓选择列表** 与 **结算周期列表** 在条目较少时按内容自适应高度（不留大块空白），条目较多时再出现内部滚动条；统一以 18 条为上限。

## 当前问题

两份列表都写死了 `max-h-[50vh]` / `max-h-[55vh]` + `overflow-y-auto`，无论 3 条还是 50 条，卡片高度相同；视觉上短列表显得空，长列表又强制内部滚动且空间没拉满。

## 改动

文件：`src/components/transparency/FundingRateAudit.tsx`

### 1. Position 选择列表（`step === "select"` 分支）

- 把 `<div className="space-y-2 max-h-[50vh] overflow-y-auto">` 改成内联高度策略：
  - 18 条以内：不设 max-height，按内容撑开
  - 超过 18 条：`max-height` 锁到 ~18 行高度（约 18 × 64px 行 + 17 × 8px 间距 ≈ `1100px`，用 `min(70vh, 1100px)` 兜底，避免小屏挤爆）
- 实现方式：
  ```tsx
  const POSITION_ROW_LIMIT = 18;
  const positionListStyle = positions.length > POSITION_ROW_LIMIT
    ? { maxHeight: "min(70vh, 1100px)", overflowY: "auto" as const }
    : undefined;
  ```
  容器去掉 `max-h-[50vh] overflow-y-auto`，改用 `style={positionListStyle}`。

### 2. Periods 列表（`step === "periods"` 分支）

- 同样策略，常量 `PERIOD_ROW_LIMIT = 18`，行高更紧凑（约 56px + 8px），上限按 `min(70vh, 1000px)` 计算。
- 实现方式同上。

### 3. 不动的内容

- Hook、数据查询 `limit(200)` / `limit(20)` 不变。
- result / fetching / comparing / idle 等其他分支不动。
- 不引入分页、不引入虚拟列表。

## QA 自检

- 3 条持仓：模块按内容高度显示，无内部滚动条、无大块空白。
- 18 条持仓：恰好不出现滚动条。
- 25 条持仓：模块固定上限（约 18 行），多出来的可在卡内滚动。
- Periods 列表同上（1 / 18 / 200 三档检查）。
- 桌面 1021×777 与移动窄屏均不会让卡片高度超过视口。

## 文档同步

在 `docs/changelog/2026-05-21-funding-rate-periods-step.md` 末尾追加一节"列表高度策略（更新）"；STATUS.md 对应批次新增一行 ⬜：`Position/Periods 列表条目 ≤18 自适应，>18 才出现内部滚动`。
