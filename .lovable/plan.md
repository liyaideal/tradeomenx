

# 补充 Hot Tab 缺失区块的 Events

## 问题
HotShelf 组件逻辑正确，但数据库中所有 events 的日期都不满足条件：
- **Just Launched** 需要 `created_at` 在 48h 内 → 所有 events 都是 1月21日创建的
- **Closing Soon** 需要 `end_date` 在未来 48h 内 → 所有 events 都在 6月底以后到期

## 方案
通过数据库 migration 插入 6 个新 events + 对应 options：

### Just Launched（3个，created_at = now()）
1. **"Solana price on April 20, 2026?"** — crypto，到期 4月20日
2. **"Will Trump announce new tariffs this week?"** — politics，到期 4月21日  
3. **"NBA Playoffs 2026 MVP?"** — sports，到期 6月30日

### Closing Soon（3个，end_date 在未来 24-36h 内）
4. **"Gold price at London PM Fix April 15?"** — finance，到期 4月15日下午
5. **"Will ETH break $4,000 by April 15?"** — crypto，到期 4月15日
6. **"UFC 315 Main Event Winner?"** — sports，到期 4月15日

每个 event 配 2-5 个 options，价格合理分布。

## 技术细节
- 单个 SQL migration 文件完成所有插入
- `created_at` 对 Just Launched 用 `now()`，对 Closing Soon 用合理的历史时间
- `end_date` 对 Closing Soon 设为 `now() + interval '24 hours'` 到 `now() + interval '36 hours'`
- 不修改任何前端代码，HotShelf 的筛选逻辑已经正确

