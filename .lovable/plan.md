

## 锁定 Hero 标题换行 + 分级字号

### 问题

当前 `<h1>` 只有两档：mobile `text-3xl`(30px) 和 `md:text-6xl`(60px)。在用户的 MacBook 视口（~1021px）下：
- 左栏 grid 只有 ~480px 可用宽度
- `text-6xl` 太大 → "Holding a Polymarket bet?" 被挤成 "Holding a Polymarket / bet?" 三行
- 副标题 "Lock in profit — on us." 也断成 "Lock in profit — on / us."，节奏破碎

### 改动（只动 `src/components/hedge/HedgeHero.tsx` 的 `<h1>`）

**1. 字号分 4 档，逐步递增**（避免 mobile→desktop 直接跳级）：
```
text-3xl       (mobile, <768px)     30px
md:text-4xl    (768–1023px)         36px
lg:text-5xl    (1024–1279px) ←这里  48px   ← 用户 MacBook 命中
xl:text-6xl    (≥1280px)            60px
```

**2. 用 `<br className="hidden lg:block" />` 锁定固定换行点**

主标题 "Holding a Polymarket bet?"：
- `lg` 及以上：在 "Polymarket" 后强制换行 → `Holding a Polymarket` / `bet?`（其实更想要不换行，见下）
- 实际更好的方案是：**该行不换行**，靠 `text-5xl` + `whitespace-nowrap` 让 "Holding a Polymarket bet?" 整行排在一行内，副标题 "Lock in profit — on us." 单独一行
- mobile/sm/md：保留自然换行（已有的 `<br />` 分隔主副标题保持不变）

**3. 副标题也锁定**："Lock in profit — on us." 在所有断点都 `whitespace-nowrap`，永不打断"on us"这个 punchline

**4. tracking 微调**：`lg:tracking-tight` → `lg:tracking-[-0.02em]`，大字号下视觉收紧

### 调整后核心代码

```tsx
<h1 className="text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl lg:text-5xl xl:text-6xl lg:tracking-[-0.02em]">
  <span className="lg:whitespace-nowrap">Holding a Polymarket bet?</span>
  <br />
  <span className="whitespace-nowrap bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
    Lock in profit — on us.
</span>
</h1>
```

### 不改动

- `<p>` 副描述（已有 `max-w-xl` 自然换行 OK）
- 右侧浮动卡片、Live stats bar、CTA、其他 section
- mobile 体验（mobile 当前 `text-3xl` 排版正常）

### 预期效果

| 视口 | 主标题字号 | 排版 |
|---|---|---|
| <768px (mobile) | 30px | "Holding a Polymarket / bet?" 自然 2 行 |
| 768–1023px | 36px | 保持 2 行，紧凑 |
| **1024–1279px (用户 Mac)** | **48px** | **"Holding a Polymarket bet?" 单行 + "Lock in profit — on us." 单行** |
| ≥1280px | 60px | 同上，更大气 |

副标题永远不会出现 "on / us." 这种孤悬词。

