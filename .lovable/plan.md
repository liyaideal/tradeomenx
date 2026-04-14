

# 统一 Watchlist 图标为 Star

## 问题

- Events 列表中 watchlist 使用 `Star` 图标（黄色填充）
- `/trade` 路径中 `MobileHeader` 的收藏按钮使用 `Heart` 图标（红色填充）
- 行业惯例：watchlist / 收藏统一用星星

## 改动

| 文件 | 改动 |
|------|------|
| `src/components/MobileHeader.tsx` | `Heart` → `Star`；激活态样式从 `text-trading-red fill-trading-red` 改为 `text-trading-yellow fill-trading-yellow`，与 Events 列表一致 |
| `src/pages/StyleGuide/sections/MobilePatternsSection.tsx` | 同步将示例中的 `Heart` 改为 `Star`，更新对应样式 |
| `src/pages/StyleGuide.tsx` | 文档描述 "Heart" → "Star" |
| `DESIGN.md` | 新增图标规范：watchlist/收藏统一使用 `Star`，激活态 `fill-trading-yellow text-trading-yellow` |

逻辑不变，只替换图标和颜色。

