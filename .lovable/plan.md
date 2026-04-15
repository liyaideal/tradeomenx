

# 批量新增 50+ 测试事件

通过数据库迁移插入 50+ 个涵盖所有分类的活跃事件，用于压力测试列表和卡片视图。

## 改动

**数据库迁移** — 一个 SQL 文件，包含：

1. **插入 55 个新事件**到 `events` 表
   - 分类覆盖：Crypto (12), Finance (10), Politics (8), Tech (8), Social (7), Sports (5), Entertainment (5)
   - 到期日从 2026-04-16（明天）到 2027-03-31 分散分布
   - 每个事件有真实感的名称、描述和成交量
   - `is_resolved = false`，`icon = 'none'`（遵循 no-emoji 规则）

2. **为每个事件插入 2-8 个选项**到 `event_options` 表
   - 价格总和归一化到约 1.0
   - 标签匹配事件类型（价格区间、百分比、Yes/No 等）

总计约 55 个事件 + ~220 个选项，无代码改动。

### 事件示例

| 分类 | 事件名称 | 到期日 |
|------|---------|--------|
| Crypto | Bitcoin price on June 30, 2026? | Jun 30, 2026 |
| Finance | US CPI YoY April 2026? | May 15, 2026 |
| Politics | US Senate midterm control 2026? | Nov 3, 2026 |
| Tech | Apple iPhone 18 launch date? | Sep 30, 2026 |
| Social | MrBeast subscriber count July 2026? | Jul 31, 2026 |
| Sports | FIFA Club World Cup 2025 winner? | Jul 13, 2025 |
| Entertainment | Best Picture Oscar 2027? | Mar 1, 2027 |

