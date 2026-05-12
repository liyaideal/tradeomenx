# Header 瘦身方案

## 目标

不增加用户进入可交易市场的点击成本，把 header 入口从 11 个收敛到 7 个，去掉视觉抢戏。

## 当前问题清点

```text
左侧（7 项）: Logo · MAINNET · Events · Resolved · Portfolio · Insights · Leaderboard(奖杯+紫框)
右侧（4 项）: Discord · 语言 EN · Equity · Avatar
```

- Resolved 是 Events 的状态切换，独立成 nav 是冗余
- Leaderboard 用奖杯 + 紫框过度抢戏，主导视觉竞争
- Discord 三处入口（header + 浮动按钮 + avatar 菜单 Help）
- 语言切换是一次性设置，不该常驻
- Insights/Leaderboard 都低频但都有商业价值，需要保留主 nav 可见性

## 改后形态

```text
左侧（5 项）: Logo[MAINNET] · Events · Insights · Leaderboard · Portfolio
右侧（2 项）: Equity · Avatar
```

视觉总元素从 11 → 7。

## 具体改动

### 1. Resolved 并入 Events 页

- `EventsDesktopHeader.tsx` nav items 移除 Resolved
- Events 页（`Events.tsx`）顶部加 `Active / Resolved` segmented control，默认选中 Active
- Active 复用现有 Events 列表，Resolved 复用现有 `Resolved.tsx` 列表内容
- `/resolved` 路由保留（SEO + 外链兼容），重定向到 `/events?status=resolved`，或直接保留独立页同时让 tab 通过 query param 切换
- 进入可交易列表依然 1 次点击

### 2. Leaderboard 去装饰，平级化

- 移除奖杯图标和紫色边框
- 改为和其他 nav 一样的纯文字样式
- active 态走和其他 nav 一样的下划线
- 保留位置在主 nav，不下沉

### 3. Discord 从 header 移除下沉到 avatar 菜单

- 删除 `EventsDesktopHeader.tsx` 里的 Discord 图标按钮
- 在 avatar dropdown 加一项 "Join Discord"

### 4. 语言切换下沉到 avatar 菜单

- `EventsDesktopHeader.tsx` 移除 `LanguageSwitcher`
- 在 avatar dropdown 加一项 "Language: EN ▾"，复用 LanguageSwitcher 组件
- 或者放到 Settings 页（更深一层但更对位）— 选 avatar dropdown，更可达

### 5. MAINNET badge 保留胶囊

- 已实现，不改

### 6. 移动端 header 同步检查

- `MobileHeader.tsx` 同样 audit：去 Discord 入口、语言切换走 avatar 菜单
- 主 nav 走底部 tab bar 不动

## 不做的事

- 不引入 sidebar
- 不做 dropdown 把 nav 收起来（避免增加进入 Events 的点击）
- 不动 Equity / Avatar 位置
- 不动 footer

## 改动文件

- `src/components/EventsDesktopHeader.tsx` — 主要改动
- `src/components/MobileHeader.tsx` — 移除 Discord/语言入口
- `src/pages/Events.tsx` — 加 Active/Resolved tab
- `src/pages/Resolved.tsx` — 抽出列表组件供 Events 页 tab 复用
- `src/components/AvatarDropdown.tsx`（或对应文件） — 加语言切换项
- `src/App.tsx` — `/resolved` 路由是否保留独立页 vs 重定向

## 验证

- 1021×777 viewport 截图，确认 header 不再拥挤
- 1440 viewport 截图，确认没有过空
- 移动端截图，确认 header 干净
- 点击 Events nav → 直接到可交易列表（不增加点击）
- 点击 Resolved tab → 切到已结算列表