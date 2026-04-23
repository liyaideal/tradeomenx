

## 后台优化执行计划（4 步止血方案）

### 步骤 1：一次性清理 `price_history` 历史数据

执行 SQL 删除 7 天前的所有价格历史点：
```sql
DELETE FROM price_history WHERE recorded_at < NOW() - INTERVAL '7 days';
```
预计释放约 2.1 GB 存储，删除约 850 万行。保留近 7 天数据足以支撑 Sparkline、K 线、详情页所有图表。

### 步骤 2：降低 Cron 频率 + 重写 Edge Function 为批量操作

**调整 cron 频率**：将 `update-prices` 任务从每 1 分钟改为每 5 分钟（`*/5 * * * *`）。

**重写 `supabase/functions/update-prices/index.ts`**：
- 一次性 SELECT 拉取所有 active events 的 options
- 内存中计算所有新价格（保持现有 binary / multi-option 逻辑）
- 用单条 `UPSERT` 批量更新 `event_options`（替代 N 次 UPDATE）
- 用单条 `INSERT` 批量插入 `price_history`（替代 N 次 INSERT）

效果：每次执行的数据库往返从 ~738 次降至 ~3 次，总写入量降低约 96%。

### 步骤 3：修复 Realtime 重订阅死循环

修复 `src/contexts/RealtimePricesContext.tsx`：
- 第 165 行 `useEffect` 依赖数组从 `[prices]` 改为 `[]`，避免每次价格更新触发 channel 重建
- `oldPrice` 改用 `setPrices(prev => ...)` 函数式更新内部读取，不再依赖闭包中的 `prices`
- 同步用函数式更新设置 `previousPrices`

效果：从"每秒重订阅一次"恢复为"挂载时订阅一次"，Realtime 消息量降低 50%+。

### 步骤 4：建立日常自动清理 Cron

新增每日凌晨 3 点的清理任务：
```sql
SELECT cron.schedule(
  'daily-cleanup-price-history',
  '0 3 * * *',
  $$
    DELETE FROM price_history WHERE recorded_at < NOW() - INTERVAL '7 days';
    DELETE FROM cron.job_run_details WHERE start_time < NOW() - INTERVAL '3 days';
  $$
);
```
防止历史数据再次堆积，并清理 cron 自身日志（当前 252 MB）。

---

## 技术细节

**文件改动清单：**
- `supabase/functions/update-prices/index.ts` — 改为批量 upsert/insert
- `src/contexts/RealtimePricesContext.tsx` — 修复 useEffect 依赖
- 通过迁移工具执行：清理 SQL + 调整 cron 频率 + 新增日清理 cron

**验证方式：**
- 执行后查询 `price_history` 行数应降至约 60 万行
- 浏览器 Console 不再出现 `Subscribed → Closed` 循环日志
- 24 小时后再次检查 `cron.job_run_details` 中 `update-prices` 的执行记录数应为之前的 1/5

**对用户体验的影响：**
- 所有 demo 数据（持仓、订单、交易历史、活动列表、当前价格）完全保留
- 价格更新节奏从"每分钟"变为"每 5 分钟"——更接近真实预测市场节奏
- 7 天前的历史价格点被清理（无任何 UI 在读取，用户从看不到）

**预期收益：**
- 数据库存储：2.27 GB → ~150 MB（-93%）
- 月写入量：32M → 1.3M（-96%）
- 月账单预估：降低 80%+

