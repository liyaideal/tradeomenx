# Changelog Index

> **总览**：[交付实施对照表 STATUS.md](./STATUS.md) — 跨文档汇总，看实施进度从这里开始。

按时间倒序排列。每条 = 日期 + 标题 + 一句话摘要 + 链接。

| 日期 | 文档 | 摘要 |
|---|---|---|
| 2026-05-25 | [Single-market binary 事件 UI 收敛](./2026-05-25-single-market-binary-collapse.md) | 单 market binary 事件顶部 chip 行折叠为 `Market: Yes or No` 只读标签；Yes/No 切换归到 Trade 面板按钮（同时切 side + selectedOption，联动 K 线/订单簿）；新增 `TradingEvent.sideLabels` 支持体育类两端别名（"上海申花/山东鲁能"） |
| 2026-05-25 | [二元事件 No 作为独立持仓](./2026-05-25-binary-no-native-positions.md) | 配合 Yes/No 文案改造废弃 No→Yes 翻转归一化：`tradingService` / `positionIntent` / `orderUtils` 三处改为 identity 映射，删除 `BinaryEventHint` 组件；Buy No 直接开 No 仓，Yes/No 可同时持有；底层类型 / schema / PnL 公式 / 历史数据不动 |
| 2026-05-25 | [安全加固：transactions / TOTP / Realtime 三项硬化](./2026-05-25-security-hardening.md) | 关键写入收敛到 Edge Function：新增 `record-transaction` / `totp-manage`，拆出 `user_security` 表并 drop `profiles.totp_secret`，启用 `realtime.messages` RLS，新增多个 field-locking trigger |
| 2026-05-25 | [全站方向文案 Long/Short + Buy/Sell → Yes/No](./2026-05-25-yes-no-terminology.md) | 仅改展示层文案（约 37 文件 + 审计徽章 + 订单簿 Y/N），保留底层 `side: 'long'\|'short'`、`order.side: 'buy'\|'sell'`、PnL 公式与双价结构；Hedge 落地页 / Glossary / ToS 明确保留 |
| 2026-05-21 | [/resolved 列表 + 详情页改版](./2026-05-21-resolved-revamp.md) | /resolved 列表升级为 Event→Markets 两级结构（新增 `ResolvedGroupedGrid` / `ResolvedMarketCard`、删除旧 `ResolvedEventCard`），头部对齐 /events 三段式，详情页 Final Results / Price History 改为 0/1 二元口径，`My Settled` 通过 trigger 回填 4 笔演示数据 |
| 2026-05-21 | [资金费率审计：结算周期列表中间页](./2026-05-21-funding-rate-periods-step.md) | Transparency 资金费率核验新增 periods 步骤，选持仓后先列出该仓位所有结算，再核验单次；详情页补充 window / settlementTs / notional |
| 2026-05-21 | [Style Guide 交付（含 Wallet Transaction History Row）](./2026-05-21-style-guide-tx-row.md) | `/style-guide` 新增 Transaction History Row playground（桌面单行 + 移动两层），WalletSection 增量；`/campaign-style-guide` 入口加到 StyleGuide 顶部 |
| 2026-05-20 | [需求批次 2026-05-20](./2026-05-20-requirements.md) | 当日合并交付的多需求清单（功能目标 / 数据库 / 用户端 / Admin） |
| 2026-05-20 | [错链充值找回 v2](./2026-05-20-recovery-v2.md) | Recovery 找回流程 v2，合并 v1 已上线 + v2 最新改动，含状态机与表结构 |
| 2026-05-11 | [近期已上线需求合集 v2](./2026-05-11-shipped-requirements-v2.md) | 5 月初前一轮已上线需求的整合说明，作为研发对齐基线 |

---

## 使用约定

- **新增交付文档**：与文档同一轮提交，在此表**顶部**插入一行 — `日期 | [标题](./文件名.md) | 一句话摘要`
  - 摘要 ≤80 字，从文档顶部 quote block 提炼，必须包含：覆盖范围 + 关键改动名词
  - 同步在 `STATUS.md` 顶部追加该批次的实施对照节
- **修订旧文档**：原文件保留，新文件命名为 `*-v2.md` / `*-v3.md`，索引表新增一行指向最新版；旧行末尾追加"（已被 vN 取代）"，不删除
- **废弃**：在该行末尾标注"（已废弃）"，文件不删除

> 维护规则同步在 `.lovable/memory/index.md` Core 中，Lovable agent 每次产出交付文档会自动按此约定更新本索引。
