

# EventsPage 桌面端对齐其他页面规范

## 问题

Resolved 和 Portfolio 桌面端遵循统一规范：
1. 共享 `EventsDesktopHeader` 导航栏
2. 页面标题区：左侧紫色竖线 + `text-3xl` 标题 + `text-sm` 副标题
3. 筛选器在标题下方
4. `px-8 py-10 max-w-7xl mx-auto`

EventsPage 桌面端缺少标题区，且 padding/max-width 不一致（`py-6 max-w-[1400px]`）。

## 改动

| 文件 | 改动 |
|------|------|
| `src/pages/EventsPage.tsx` | 1. `max-w-[1400px]` → `max-w-7xl`，`py-6` → `py-10`，`space-y-4` → `space-y-6`，对齐其他页面 |
| | 2. 桌面端添加标题区：左侧紫色竖线 + "Explore Events"（text-3xl）+ 副标题，与 Resolved/Portfolio 相同结构 |
| | 3. Tabs 行和 Filters 行保持在标题区下方，逻辑不变 |

桌面端最终结构：
```text
┌─ EventsDesktopHeader (nav bar) ──────────────────┐
├──────────────────────────────────────────────────────┤
│ ▌Explore Events                                      │
│   Real-time markets, real-time edge                  │
│                                                      │
│ All  Hot  Watchlist  Crypto ... ── [1H 4H 24H]      │
│ 🔍 Search...  All Expiry ▾  Volume ↓ ▾   [≡] [⊞]   │
├──────────────────────────────────────────────────────┤
│ Market list / grid                                   │
└──────────────────────────────────────────────────────┘
```

只改 `EventsPage.tsx` 一个文件，移动端不受影响。

