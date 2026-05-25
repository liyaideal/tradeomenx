## 目标

把 `TradeForm.tsx` 里的 Yes/No 切换按钮改成所选方向（v3）：

- 按钮分上下两层：上层放队名/Yes/No 文案，下层独立色块放价格
- 固定按钮高度，避免长队名换行后两侧高度错位
- 选中态：绿色（Yes 方）/ 红色（No 方），右上角加一个白色发光小圆点指示活动状态
- 未选中态：上层 `bg-muted`、下层 `bg-black/20` 色阶

## 改动范围

仅 1 个文件：

- `src/components/TradeForm.tsx`（第 213-251 行的 Yes/No 切换 block）

不动业务逻辑、数据接口（`binaryMode.yesLabel/noLabel/yesPrice/noPrice`、`setSide` 行为保留）、不改 PnL / 持仓模型。

## 设计规范（落到 tokens）

按钮容器
- 外层 `grid grid-cols-2 gap-2 p-1 bg-background rounded-lg`（替换原 `flex bg-muted rounded-lg p-0.5`）
- 每个按钮 `flex flex-col h-14 rounded-md overflow-hidden transition-all` + `relative`

上层（label 区，flex-1）
- 选中 Yes：`bg-trading-green text-trading-green-foreground`
- 选中 No：`bg-trading-red text-foreground`
- 未选中：`bg-muted text-muted-foreground hover:bg-muted/80`
- 文字：`text-[11px] font-semibold leading-tight line-clamp-2 text-center px-2`
- 单 market binary 用 `yesLabel/noLabel`（队名）；标准 binary 显示 "Yes"/"No"

下层（price 区，固定 h-5）
- 选中：`bg-black/15 text-current`（继承上层前景色）
- 未选中：`bg-black/20 text-muted-foreground`
- 文字：`text-[10px] font-mono`，4 位小数

活动指示
- 选中态：上层右上角 `absolute top-1 right-1 w-1 h-1 rounded-full bg-current shadow-[0_0_4px_currentColor]`

## 验证

- `/trade?event=nba-finals-2026-g7`（Boston Celtics / Oklahoma City Thunder）两按钮高度对齐、队名 2 行不溢出
- 切换到普通 binary 事件（如 BTC 100k Yes/No）仍显示 "Yes"/"No"、行为一致
- 切换 Yes/No 时 K 线/订单簿仍然跟随（不动 `binaryMode.onSelectYes/No` 回调）

## 不做的事

- 不改 Playground / DESIGN.md / 内存（按钮属于内部组件细节，不进核心 token 集）
- 不改 mobile drawer 里同等按钮（如果存在，留到下轮）— 本次只动桌面 `TradeForm.tsx`
