# 建立 docs/changelog/ 让研发能在仓库内对齐需求

## 背景

研发是参考 Lovable 仓库另起一套工程在做，并不是直接在 Lovable 代码里开发。当前痛点：每次 Lovable push 一批 commit，研发只能靠 diff 代码猜需求，容易漏掉之前提过的需求。

之前产出的 delivery doc 都散落在 `/mnt/documents/`（agent 私人空间，研发看不到）。把它们沉淀到项目仓库里，研发 clone / pull 就能看到。

## 方案

在仓库根新增 `docs/changelog/` 目录，承载所有交付说明文档，并写一份 README 告诉研发怎么用。

### 1. 新建 `docs/README.md`

中文，给研发看。内容覆盖：

- 这个目录是什么：Lovable 端产出的"需求交付说明"
- 怎么用：每次 pull 代码后，先看 `changelog/` 里最新文档，再去对照他们自己仓库做改动
- 文件命名规范：`YYYY-MM-DD-{slug}.md`，例如 `2026-05-20-wallet-tx-history.md`
- 每份文档结构（引用 delivery-doc skill 的标准骨架）：功能目标 / 状态机 / 数据库 / 用户端 / Admin / 已废弃 / Style Guide / 涉及文件 / 未变更项
- 配套机制：建议研发那边对应 commit 打 tag `spec/YYYY-MM-DD-{slug}`，方便后续追溯
- 与 `DESIGN.md` / `CAMPAIGN_DESIGN.md` 的关系：长效规范放 DESIGN.md，单次需求变更放 changelog/

### 2. 把 `/mnt/documents/` 里现有的 delivery doc 搬进仓库

按时间归档为 `docs/changelog/` 下文件（重命名时按 `YYYY-MM-DD-{slug}.md` 规范）：

| 源文件 | 目标文件 |
|---|---|
| `recovery-spec-v2.md`（2026-05-20） | `docs/changelog/2026-05-20-recovery-v2.md` |
| `requirements_2026-05-20.md` | `docs/changelog/2026-05-20-requirements.md` |
| `2026-05-20-delivery-spec.md`（含 Style Guide 增量） | `docs/changelog/2026-05-21-style-guide-tx-row.md`（按最近一次更新时间） |
| `omenx-recent-shipped-requirements_v2.md`（2026-05-11） | `docs/changelog/2026-05-11-shipped-requirements-v2.md` |

`omenx-recent-shipped-requirements.md`（v1，已被 v2 取代）和 `transparency-changes.docx`（docx 不适合放仓库）不搬入。

### 3. 在 `docs/changelog/` 加一个 `INDEX.md`

按倒序列出所有交付文档，一行一条：日期 + 标题 + 链接 + 一句话摘要。让研发一眼看到最新需求。

### 4. 更新顶层 `README.md`

在合适位置加一小段，告诉新来的研发："产品需求变更见 `docs/changelog/`，长效设计规范见 `DESIGN.md` / `CAMPAIGN_DESIGN.md`。"

### 5. 写入项目 memory

在 `mem://index.md` Core 末尾追加一条规则，约定以后产出的 delivery doc **同时**写到 `docs/changelog/`，不只放 `/mnt/documents/`。这样下次我做交付文档时会自动落到仓库里。

## 涉及文件

- 新增：`docs/README.md`
- 新增：`docs/changelog/INDEX.md`
- 新增：`docs/changelog/2026-05-11-shipped-requirements-v2.md`
- 新增：`docs/changelog/2026-05-20-recovery-v2.md`
- 新增：`docs/changelog/2026-05-20-requirements.md`
- 新增：`docs/changelog/2026-05-21-style-guide-tx-row.md`
- 修改：`README.md`（加一段"研发协作说明"）
- 修改：`mem://index.md`（Core 加一条 delivery doc 落地规则）

## 不做的事

- 不动任何业务代码、组件、样式
- 不动 GitHub 仓库配置 / 不开分支策略（研发场景用不上）
- 不搬 `omenx-recent-shipped-requirements.md` v1 和 `.docx` 文件
- 不改 `DESIGN.md` / `CAMPAIGN_DESIGN.md` 内容
