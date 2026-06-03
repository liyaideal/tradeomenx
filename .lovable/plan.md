## 问题
`EventPickerList` 内嵌一个 `max-h-[420px]` 可滚动列表，选中 Yes/No 后产生的"已选摘要 + Confirm"在列表下方，首屏不可见，导致用户以为点击没反应。

## 方案：底部 sticky 操作栏（inline 变体）

只改 `RedeemVoucherContent.tsx` 的 `inline` 分支（即 `/vouchers` 页面的兑换面板），其它不动。

### 改动
1. **去掉 inline 分支里行内的 picked 摘要卡 + 按钮行**（lines 60–84 与 94–113 中 inline 部分），改成：
   - 默认（未选）：底部 sticky 灰色提示条 `Select Yes or No on a market to continue`，右侧 disabled 的 "Confirm & open position" 按钮。
   - 已选：底部 sticky 操作栏，单行排布：
     - 左：`{eventName} · {optionLabel} · Yes/No`（小字截断）+ `Entry $x.xx · Size xx · Max profit $x.xx`（font-mono 数字）
     - 右：`Reset` (ghost, 小) + `Confirm & open position` (primary)
   - 容器：`sticky bottom-0 -mx-* px-* py-3 bg-background/95 backdrop-blur border-t border-border`，确保在 `/vouchers` 页面滚动时一直可见。
2. **`dialog` / `drawer` 变体保持原样**（它们本身就有 footer，不存在看不到的问题）。
3. 列表内 Yes/No 按钮被选中后保留现在的 ring 视觉反馈即可。

### 文件
- 仅 `src/components/vouchers/RedeemVoucherContent.tsx`

### 不动
- `EventPickerList.tsx`、edge functions、redeem 逻辑、文案字典字段（Face value / Max profit / Hold window / Entry）。
- 移动端 drawer 变体（已有 `MobileDrawerActions` 规范）。

### 验证
桌面 1021 宽度下打开 `/vouchers` → Redeem → 不滚动也能看到底部条；点 Yes/No → 底部条立即填充并解锁 Confirm；点 Reset 恢复未选态；点 Confirm 走原流程跳 `/trade`。
