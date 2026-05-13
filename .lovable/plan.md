## 头部大气化方案：Sophisticated Hero

只改 `src/components/home/HomeKPIHeader.tsx`，保留 props 和数据源不变。

### 视觉调整

**整体容器**
- padding 从 `px-4 pt-3 pb-3` → `px-5 pt-5 pb-5`（更大的呼吸感）

**Brand 行（Row 1）**
- 不变：Logo + Mainnet 胶囊 + rightSlot
- 与下方 KPI 间距 `mt-3` → `mt-4`

**KPI 主区块（已登录态）**
1. **主数字放大**：Total Equity 数字从 `text-[26px]` → `text-4xl`（约 36px），`font-semibold` → `font-bold`，紧贴 `+$34.56` 同基线
2. **Label 强化**：`Total equity` 字号 `text-[9px]` → `text-[10px]`，tracking `0.2em`
3. **副指标分组卡**：在主数字下方新增一个圆角分组卡：
   - `mt-4 py-3 px-4 rounded-xl border border-border/50 bg-muted/20`
   - 左：`7D Change` label + `+1.9%`（trading-green，font-mono，text-[15px] font-bold）
   - 中间分隔：`h-6 w-px bg-border/60`
   - 右：`Available` label + 余额数字（暂时复用 profile.balance 或显示 `--`）
4. 移除右上角孤立的 `7D +1.9%` 小字（已合并入分组卡）

**未登录态**
- 保持 CTA 按钮，仅同步外层 padding 调整即可

### 不变项

- props 接口（`rightSlot / onLogin / weeklyPnL / weeklyPnLPercent`）
- sticky 行为、backdrop-blur
- 语义 token：`trading-green / muted-foreground / border / muted`
- 不引入新颜色、不引入图标、不引入 emoji
- 不动 `MobileHome.tsx` 或其他模块

### 文件变更

- 编辑 `src/components/home/HomeKPIHeader.tsx`（唯一改动）
