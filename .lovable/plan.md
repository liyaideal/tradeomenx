## 背景

`ExternalHedgeLinks` 组件 + `EventInfoContent` 已经实现了 "Hedge on spot markets" 入口（渲染 Polymarket / Kalshi 链接），但只有少数 event 在 DB 里有 `external_links`（14 个，大部分是 resolved 旧数据），剩下的可交易 event（ev-c\*, ev-f\*, ev-p\*, ev-t\*, ev-s\* 等）字段为 NULL，所以入口在 /trade 上不出现。

要做的就是按 category 给所有 `external_links IS NULL` 的 event 批量回填一组合理的 Polymarket + Kalshi 链接，不动组件代码。

## 方案

写一个 migration，按 category 给缺失的 event 填默认 spot-market 链接（指向各平台对应分类页，而不是具体市场，避免造假数据）：

| category | Polymarket | Kalshi |
|---|---|---|
| crypto | `/markets/crypto` | `/markets/crypto` |
| finance / economy | `/markets/economy` | `/markets/economics` |
| politics | `/markets/politics` | `/markets/politics` |
| sports | `/markets/sports` | `/markets/sports` |
| tech | `/markets/tech` | `/markets/companies` |
| social / entertainment | `/markets/culture` | `/markets/entertainment` |
| 其他 / NULL | `/` | `/` |

只 update `external_links IS NULL` 的行，已经手工配过具体市场链接的 14 个 event 保持原值。

不改前端组件、不动 `useEvents` 的解析逻辑——`EventInfoContent` 已经在 `event.externalLinks?.length > 0` 时渲染入口，回填后桌面 `/trade` 的 Event Info 面板和移动 EventInfo drawer 都会自动出现 "Hedge on spot markets"。

## 技术细节

单个 migration：

```sql
UPDATE public.events
SET external_links = CASE category
  WHEN 'crypto'        THEN '[{"platform":"Polymarket","icon":"polymarket","url":"https://polymarket.com/markets/crypto"},{"platform":"Kalshi","icon":"kalshi","url":"https://kalshi.com/markets/crypto"}]'::jsonb
  WHEN 'finance'       THEN '[...economy / economics...]'::jsonb
  WHEN 'economy'       THEN '[...economy / economics...]'::jsonb
  WHEN 'politics'      THEN '[...politics / politics...]'::jsonb
  WHEN 'sports'        THEN '[...sports / sports...]'::jsonb
  WHEN 'tech'          THEN '[...tech / companies...]'::jsonb
  WHEN 'social'        THEN '[...culture / entertainment...]'::jsonb
  WHEN 'entertainment' THEN '[...culture / entertainment...]'::jsonb
  ELSE '[{"platform":"Polymarket","icon":"polymarket","url":"https://polymarket.com/"},{"platform":"Kalshi","icon":"kalshi","url":"https://kalshi.com/"}]'::jsonb
END
WHERE external_links IS NULL;
```

无前端改动、无 RLS 改动。
