# Changelog Index

> **总览**：[交付实施对照表 STATUS.md](./STATUS.md) — 跨文档汇总，看实施进度从这里开始。

按时间倒序排列。每条 = 日期 + 标题 + 一句话摘要 + 链接。

| 日期 | 文档 | 摘要 |
|---|---|---|
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
