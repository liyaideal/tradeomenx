

# 更新事件分类 Tabs 匹配实际数据

## 问题

数据库中实际存在的活动分类为：`crypto`、`finance`、`politics`、`social`、`sports`、`tech`。

当前 Tabs（Crypto、Macro、Sports、Politics）缺少 Social 和 Tech，且 Macro 实际对应的是 `finance` 分类。

## 改动方案

| 文件 | 改动 |
|------|------|
| `src/components/events/EventTabs.tsx` | 更新 Tab 列表：All、Hot、Watchlist、Crypto、Finance、Politics、Social、Tech、Sports |
| `src/pages/EventsPage.tsx` | 更新过滤逻辑，新增 `social`、`tech`、`finance` 分支，移除 `macro` |

### 新 Tab 顺序

```text
All | 🔥 Hot | ⭐ Watchlist | Crypto | Finance | Politics | Social | Tech | Sports
```

- **Macro → Finance**：标签改名，过滤条件改为 `m.category === "finance"`
- **新增 Social**：过滤 `m.category === "social"`
- **新增 Tech**：过滤 `m.category === "tech"`

### EventTab 类型更新

```typescript
export type EventTab = "all" | "hot" | "watchlist" | "crypto" | "finance" | "politics" | "social" | "tech" | "sports";
```

只改两个文件，不影响其他组件。

