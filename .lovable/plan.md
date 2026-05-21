# Seed "My Settled" 数据

## 目标
让 `/resolved` 的 **My Settled** 视图对每个账号都有内容可看。当前 `userParticipated` 的判定是 `trades.event_name === events.name`，而 `handle_new_user()` 种的 trades 用的是 "Fed Interest Rate Decision" 等假名，跟实际 resolved events 的 name 完全对不上 —— 所以新老用户的 Mine 都是空的。

## 方案

### 1. 更新 `handle_new_user()` trigger
在现有 trade/position 种子之后追加 4 笔与真实 resolved events 匹配的 closed trades + closed positions，覆盖赢/亏混合：

| event_name | option | side | 结果 | 备注 |
|---|---|---|---|---|
| Will Bitcoin exceed $100K by end of 2024? | YES | buy | win  | +大额 PnL |
| Will Fed cut interest rates in December 2024? | Yes | buy | win | +中等 |
| Super Bowl LVIII Winner | San Francisco 49ers | buy | loss | −中等 |
| Oscar Best Picture 2024 | Oppenheimer | buy | win | +小额 |

净 PnL 为正，体现"档案有赢有亏"。

### 2. 历史用户回填
对 `auth.users` 里所有用户，如果他们在 trades 表里还没有这些 event_name 的记录，就一次性补种相同的 4 笔。用 `ON CONFLICT` / `NOT EXISTS` 防止重复。

## 文件改动
- 新建一个 Supabase migration：
  - `CREATE OR REPLACE FUNCTION public.handle_new_user()` —— 在原函数末尾追加新增的 trades / positions INSERT。
  - `DO $$ ... $$` 块：遍历现有用户回填。

## 不变
- 前端 (`useResolvedEvents`, `ResolvedPage`, 新卡片) 不动
- `event_options.is_winner` 等已有数据不动
- 不影响 deposits/withdrawals/points/airdrop 等其他种子

## 验收
1. 新注册用户立刻在 `/resolved?view=mine` 看到 4 条记录
2. 现有账号刷新后也能看到这 4 条
3. PnL 颜色正确（绿/红 chip）
