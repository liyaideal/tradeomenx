# 新增交付对照表 / 实施检查清单

## 目标

在 `docs/changelog/` 旁新增一份 **总览级对照表**，把每份交付文档拆解成"需求条目 → 研发实施状态 → QA 测试要点"的三列清单，让你 / 研发 / QA 都能一眼看到：

- 研发已完成哪些、未完成哪些、有疑问哪些
- 每条需求 QA 该测什么、在哪页测、用什么账号测
- 同步进度的统一标记位（不再靠口头沟通）

## 方案

### 1. 新建 `docs/changelog/STATUS.md`（交付对照表）

总览表，按交付文档分节，每节内是一张细分需求表。

**整体结构：**

```markdown
# 交付实施对照表

> 同步约定：研发每完成一项，在对应单元格把 status 改成 ✅；遇阻塞改成 ⚠️ 并在备注列写原因。
> PM 每周三回顾本表，未完成项进入下周需求会议。

## 状态图例
| 标记 | 含义 |
|---|---|
| ⬜ | 未开始 |
| 🟡 | 进行中 |
| ✅ | 已完成且自测通过 |
| ⚠️ | 阻塞 / 有疑问 |
| ➖ | 不适用 / 已废弃 |

---

## 2026-05-21 — Style Guide 交付
源文档：[2026-05-21-style-guide-tx-row.md](./2026-05-21-style-guide-tx-row.md)

| # | 需求条目 | 实施位置（参考） | 状态 | QA 测试要点 | 备注 |
|---|---|---|---|---|---|
| 1 | Transaction History Row 桌面单行 | `/wallet` 桌面端 | ⬜ | 桌面 ≥md：icon+描述+类型徽章+状态图标 同一行，金额右对齐 | |
| 2 | Transaction History Row 移动两层 | `/wallet` 移动端 | ⬜ | 390px：第一行 icon+描述+金额；第二行 pl-[52px] 对齐 date/badge/status | |
| 3 | `/campaign-style-guide` 入口 | `/style-guide` 顶部 | ⬜ | StyleGuide 顶部 Megaphone 按钮，移动端只显示图标 | |

## 2026-05-20 — 需求批次
源文档：[2026-05-20-requirements.md](./2026-05-20-requirements.md)
（按 §1–§N 拆条目 …）

## 2026-05-20 — Recovery v2
源文档：[2026-05-20-recovery-v2.md](./2026-05-20-recovery-v2.md)
（按状态机 + 数据库 + 用户端 + Admin 四组拆条目 …）

## 2026-05-11 — 已上线需求合集 v2
源文档：[2026-05-11-shipped-requirements-v2.md](./2026-05-11-shipped-requirements-v2.md)
（这批默认全部 ✅，因为已是"已上线"基线 …）
```

### 2. 需求条目拆解原则

为了让对照表真正能用，每份交付文档我会按以下规则提取条目：

- 一个 §子章节 = 1 个条目；若子章节内包含多个独立可验收点，再拆
- 数据库相关单独列：`schema 变更 / RLS / Trigger` 各算一项
- Style Guide 类的条目把"playground 是否搭好" 与 "真实页面是否落地"分开列
- 已废弃项也保留一行，状态填 ➖，让研发知道"要主动删旧实现"
- 控制颗粒度：每份文档 5–15 行，太碎就合并相近条目

### 3. QA 测试要点写法

每行只写**最小可验证步骤**，3 类常用模板：

| 类型 | 写法示例 |
|---|---|
| 页面/组件 | "/wallet 桌面端：Transaction History 单行不换行，金额右对齐" |
| 状态流转 | "提交 Recovery 申请 → 列表出现 status=pending → Admin 标 approved → 用户端看到 approved 徽章" |
| 数据库 | "Supabase `recovery_requests` 表存在 status 字段；用户 A 只能 select 自己的行（RLS 验证）" |

不写"覆盖率"、"边界值"这种泛词。

### 4. 实施位置（参考）列

只填**最有可能的入口路径**，给研发定位用，不强制：

- 前端页面：`/wallet`、`/recovery`、`/style-guide#transaction-history-row`
- 数据库：`public.recovery_requests`、`public.transactions`
- Edge Function：`generate-deposit-address`

研发实际改在哪里由他们决定，这列不影响验收。

### 5. 更新 `docs/README.md`

在"研发使用方式"章节末尾加一段：

> **追踪实施进度**：见 `docs/changelog/STATUS.md`。研发每完成一项请改对应状态标记，PM 每周回顾。

### 6. 更新 `docs/changelog/INDEX.md`

在表格上方加一行链接到 STATUS.md：

> **总览**：[交付实施对照表 STATUS.md](./STATUS.md) — 跨文档汇总，看实施进度从这里开始。

### 7. 更新 mem://index.md

在 Core "Delivery Docs" 那条规则后追加：每新增 delivery doc 必须同时在 `STATUS.md` 顶部追加一节，初始状态 ⬜。

## 涉及文件

- 新增：`docs/changelog/STATUS.md`
- 修改：`docs/README.md`（加一段进度追踪指引）
- 修改：`docs/changelog/INDEX.md`（顶部加 STATUS.md 链接）
- 修改：`mem://index.md`（Delivery Docs 规则扩展）

## 不做的事

- 不替每条需求"猜"研发的实际进度，全部初始化为 ⬜；具体状态由研发首次 review 时填写
- 不做自动化的 status 同步（脚本/CI），保持手动维护，门槛最低
- 不动 `docs/changelog/` 下已有的 4 份历史交付文档内容

## 待你确认（如果有意见可在批准前提）

1. 状态标记用 emoji（⬜🟡✅⚠️➖）还是纯文本（TODO/WIP/DONE/BLOCKED/N/A）？默认 emoji，更直观
2. `2026-05-11-shipped-requirements-v2.md` 是历史已上线基线，默认全部标 ✅，是否需要？默认是
