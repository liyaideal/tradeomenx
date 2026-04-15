

# 记住约束 + Style B 视觉和底部 stats 调整

## 新增约束记忆

保存一条规则：**修改任何一种卡片样式（A/B/C）时，严禁修改其他两种卡片的文件。** MarketCard.tsx = A，MarketCardB.tsx = B，MarketCardC.tsx = C。

## Style B 调整内容

你选择了「视觉样式调整」和「底部 stats 行调整」，具体改动如下：

### 视觉微调（MarketCardB.tsx）
1. **Outcome 行间距**：`space-y-1` → `space-y-1.5`，让每行 outcome 呼吸感更好
2. **Outcome label 字号**：`text-[10px]` → `text-[11px]`，提升可读性
3. **CHG 值对齐**：右侧 CHG 使用 `tabular-nums` 确保数字等宽对齐
4. **"+N more" 行**：加左边一条细线或缩进，与 outcome 行区分层级

### 底部 Stats 行调整
5. **改为单行横排**：当前是纵向 label+value 叠放，改为 `flex items-center` 单行：`24H Vol: $1.2M · Total Vol: $12.5M`，用中点分隔，更紧凑
6. **边框**：`border-border/10` → `border-border/20`，稍微加强分隔感

## 改动文件

仅 `src/components/events/MarketCardB.tsx`（约 15 行改动）
新增 `mem://constraint/card-style-isolation`

