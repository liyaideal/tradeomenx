## 移动端适配问题与修复计划

经过逐页核查 `/settings/transparency` 在 390px 视口下的展示，发现以下溢出/拥挤问题：

---

### 1. Asset Verification（MerkleProofVerification.tsx）— 已截图确认

**问题**：结果区 `Available Balance / Margin / Total Assets` 使用 `grid-cols-3`，每格里是 `font-mono` 的金额（如 `$16,377.52`、`$2,847.52`），在 390px 下宽度不够，数字明显超出卡片边界。

**修复**：
- 移动端改为 `grid-cols-1`，桌面端保持 `grid-cols-3`（`grid-cols-1 sm:grid-cols-3`），每行变成"标签 + 金额"横排（标签左、金额右），更利于阅读。
- 或保持 3 列但每格自适应：把卡片改为 `flex-col items-start`、金额加 `tabular-nums whitespace-nowrap`，数字字号降到 `text-xs sm:text-sm`，左右内边距收窄 `p-2.5`。
- 推荐采用 **方案一（移动端单列、桌面端三列）**，与首页"数据卡片"一致，且不挤压字号。

---

### 2. Trade Verification（TradeVerification.tsx）— 4 列对比表格

**问题**：字段对照表使用 `grid-cols-[0.8fr,1fr,1fr,0.7fr]`，4 列在 390px 下每列仅 ~80px。`Field / DB Record / On-Chain Log / Raw Value` 表头本身会换行；行内 `truncate` 截断后用户看不到完整值。

**修复**：
- 移动端改成"卡片堆叠"模式：每条字段独立一张小卡，展示
  ```
  fieldLabel                ✓ match
  DB:       <db value>
  Chain:    <chain value>
  Raw:      <raw value>     [copy]
  ```
- 用 `hidden sm:grid` / `sm:hidden` 切换：≥sm 走原 4 列表格，<sm 走卡片视图。所有 hash/long 值统一 `break-all` + 字号 `text-[11px]`。

---

### 3. Liquidation Audit（LiquidationAudit.tsx）

**问题 A — 顶部 stepper**：`flex justify-between text-[10px]` 一行排 4 个标签（`1. Select Position`、`2. Fetch On-Chain Event`、`3. Margin Analysis`、`4. Fairness Conclusion`），在 390px 下必然换行错位。

**修复 A**：移动端只保留进度条 + 当前步骤文案（`Step 2 of 4 · Fetch On-Chain Event`），桌面端保留四段式标签（`hidden md:flex` 切换）。

**问题 B — Position summary（grid-cols-4）**：`Side / Entry / Close / P&L` 4 列在窄屏可能挤压，尤其 `P&L` 含 `-` 号与小数。  
**修复 B**：移动端 `grid-cols-2`，桌面端保持 `grid-cols-4`（`grid-cols-2 sm:grid-cols-4`）。

**问题 C — 详细字段行**：`txHash / contract` 用了 `truncate max-w-[200px]`，在 390px 视口（卡片内宽 ~330px）减去左侧标签后空间不够，已经显示截断；但视觉上 hash 看起来不完整、且与 label 距离很近。  
**修复 C**：把每行从 `flex items-center justify-between` 改为 `flex flex-col gap-0.5` 或保持横排但 hash 类字段换成"前 6...后 6"（已经是了）并去掉 `max-w-[200px]`，加 `min-w-0 truncate flex-1 text-right`。

---

### 4. Settlement Audit / Funding Rate Audit — 复核

**Settlement**：结果页主要为竖向卡片堆叠 + 单行 label/value 表，未发现明显溢出。仅 `winningOutcomeLabel` 若文案较长（如长事件名），`text-2xl font-bold` 可能换行——保留即可（自动换行可接受）。  
**Funding**：position 信息行 `event_name / option_label / side / leverage / size` 用 `flex gap-3` 横排，事件名较长时会换行（已有 `text-xs text-muted-foreground`），可接受；其它 label/value 表无问题。  
**结论**：这两页本次无需修改，只在 QA 截图里再确认一次。

---

### 5. 全局通用规则补充

- 所有展示链上 hash、地址、长 ID 的行：统一 `min-w-0 truncate` 或采用项目记忆中的"First 6 + Last 6"截断（已存在，部分页面未沿用）。
- 所有展示金额/数字的元素：加 `tabular-nums whitespace-nowrap`，避免 `font-mono` 在窄屏被强行换行。
- 卡片内边距：移动端统一 `p-4`，桌面端 `md:p-6`，避免内容贴边。

---

### 改动文件清单

| 文件 | 改动 |
| --- | --- |
| `src/components/transparency/MerkleProofVerification.tsx` | 三个 summary 卡片改 `grid-cols-1 sm:grid-cols-3` + 横排 label/value |
| `src/components/transparency/TradeVerification.tsx` | 字段对照表移动端切换为卡片堆叠视图（`sm:hidden` / `hidden sm:grid`） |
| `src/components/transparency/LiquidationAudit.tsx` | 移动端 stepper 简化、Position summary 改 2 列、字段行去除 `max-w-[200px]` |

### 验证方式

1. 用浏览器工具以 390×844 视口分别进入 4 个子审计页面（Reserves / Trade / Liquidation / Funding / Settlement）。
2. 截图确认无水平溢出、无重叠、无被裁切的金额或 hash。
3. 切到 1280 宽再次截图，确认桌面端布局未被破坏。

### 待确认

- Trade Verification 的字段对照表移动端，倾向**卡片堆叠（推荐，可读性最好）**还是**保留 4 列但横向滚动 `overflow-x-auto`**？我默认按卡片堆叠实现，如有偏好请告知。
