

# 统一 Active 和 Resolved 移动端卡片设计规范

## 现状问题

两张卡片在结构、间距、字号、组件选择上存在明显不一致：

```text
Active MarketCard              Resolved EventCard
─────────────────              ──────────────────
raw <div>                      <Card> + CardHeader/Content
rounded-xl                     rounded-lg (Card default)
text-sm title                  text-[15px] title
Star ★ + Badge + Expiry        Title + "Settled" badge
no hover glow                  has hover glow (desktop)
p-4 padding                    p-6 (Card default)
```

## 方案：以 Active 卡片为基准，统一 Resolved 卡片的移动端结构

保留两者内容差异（Active 显示价格/成交量，Resolved 显示 options 结果），但统一外壳和排版规范。

### 修改 `src/components/ResolvedEventCard.tsx` 移动端部分

1. **卡片外壳**：改用与 MarketCard 一致的 raw `<div>` + `rounded-xl` + `p-4`，去掉 `<Card>`/`<CardHeader>`/`<CardContent>` 的默认 padding
2. **顶行结构统一**：左侧放 Category Badge + "Settled" badge，右侧放日期（与 Active 的左 Badge 右 Expiry 对齐）
3. **标题字号**：统一为 `text-sm font-semibold leading-snug line-clamp-2`
4. **间距**：与 MarketCard 的 `mb-2`, `mb-3` 节奏一致
5. **hover 效果**：去掉移动端的 glow（Active 卡片也没有）

### 修改 `DESIGN.md`

新增"卡片一致性规范"段落，明确 Active 和 Resolved 卡片共享的设计 token：
- 外壳：`rounded-xl border-border/40 p-4`
- 背景：`linear-gradient(165deg, ...)`
- 标题：`text-sm font-semibold leading-snug line-clamp-2`
- 顶行：左侧 badges，右侧时间信息
- hover：`hover:border-primary/40`

### 不修改的部分
- 卡片内部数据区域保持各自特色（Active 用 2x2 grid 数据，Resolved 用 options list）
- 桌面端 Resolved 卡片暂不改动（用户只提到移动端）

