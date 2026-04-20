

## 看图诊断

截图清楚显示：
- **Info 模块**：明显比 MM **更宽**（"Info" 4 字母 + 图标，撑得宽）
- **Info 模块**：明显比 MM **更高**（视觉上）
- **MM 模块**：紧凑（"MM" 2 字母 + `0.08%` 数值）

强迫症痛点合理。根因：两个按钮虽然用了同一套 class，但**内容长度不同导致宽度不同**，且 Info 没有第二行数值，**两行高度也对不齐**。

## 设计方案：尺寸 1:1 完全对齐

让 Info 按钮和 MM 按钮**视觉重量完全一致**——同宽、同高、同结构。

### 核心策略：Info 也用"上 label + 下值"两行结构

模仿 MM 的 `MM` / `0.08%` 结构，给 Info 也填两行：
- 上：`Info`（label，灰）
- 下：`View`（小动作词，主色弱化）—— 或者直接放图标当"值"

但更好的做法：**两个按钮都改成单行 icon + 文字的紧凑徽章**，统一为同一种结构。

### 推荐方案：固定宽高 + 统一两行结构

```
┌─────────┐  ┌─────────┐
│  Info   │  │   MM    │
│   ⓘ     │  │ 0.08%   │
└─────────┘  └─────────┘
   w-14         w-14
   h-10         h-10
```

具体改法：
1. **两个按钮都强制 `w-14 h-10`**（固定宽高，约 56×40px）
2. **Info 按钮**：上行 `Info` 文字（`text-[10px]`），下行 `Info` 图标（`w-3.5 h-3.5`）—— 当前已是这个结构，只是没固定尺寸
3. **MM 按钮**：上行 `MM` 文字（`text-[10px]`），下行 `0.08%` 数值（`text-xs font-mono`）—— 当前结构
4. 两者都用 `flex flex-col items-center justify-center`，确保内容居中

### 具体改动

**文件 1：`src/components/MobileTradingLayout.tsx`** —— Info 按钮加固定宽高
```tsx
<button className="flex flex-col items-center justify-center w-14 h-10 rounded-lg bg-muted/50 border border-border/30 hover:bg-muted transition-colors">
  <span className="text-[10px] text-muted-foreground leading-none mb-0.5">Info</span>
  <Info className="w-3.5 h-3.5 text-muted-foreground" />
</button>
```

**文件 2：`src/components/MobileRiskIndicator.tsx`** —— MM 按钮加同款固定宽高
```tsx
<button className="flex flex-col items-center justify-center w-14 h-10 rounded-lg bg-muted/50 border border-border/30 hover:bg-muted transition-colors">
  <span className="text-[10px] text-muted-foreground leading-none mb-0.5">MM</span>
  <span className={`text-xs font-mono font-medium leading-none ${getRiskColor(riskMetrics.riskLevel)}`}>
    {mmRatio.toFixed(2)}%
  </span>
</button>
```

关键点：
- `w-14`（56px）足够装 `0.08%` 5 个 mono 字符
- `h-10`（40px）容纳两行
- `leading-none + mb-0.5` 确保两行垂直紧凑且居中
- 图标 `w-3.5 h-3.5` 视觉重量约等于 `0.08%` 文字高度
- 两个按钮 className **完全一致**（除了内容）

## 不改动
- Stats 行（Vol / OI / Funding）
- Sheet 内容
- TradeForm
- OrderBook
- 桌面端

## 一句话总结
**两个按钮强制 `w-14 h-10` 固定宽高 + 完全一致的两行结构（上 label 下值）**，强迫症治愈。

