

## 修复 Hero 标题在 lg 断点溢出右侧卡片问题

### 问题诊断

用户视口 1021×777，处于 `md` 断点（768–1023px），`<h1>` 渲染为 `md:text-4xl`（36px）。但截图显示标题极大（约 80px+），明显超出左栏 grid，覆盖到了右侧浮动卡片上方。

排查 `src/components/hedge/HedgeHero.tsx` 当前代码：

```tsx
<h1 className="text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl lg:text-5xl lg:tracking-[-0.02em] xl:text-6xl">
  <span className="lg:whitespace-nowrap">Holding a Polymarket bet?</span>
  <br />
  <span className="whitespace-nowrap bg-gradient-to-r ...">
    Lock in profit — on us.
  </span>
</h1>
```

**根因**：副标题 span 用了无条件的 `whitespace-nowrap`。"Lock in profit — on us." 在 `text-4xl`(36px) 下宽度约 460px，刚好等于左栏宽度，但 `whitespace-nowrap` 强制不换行 → **撑大父容器宽度** → grid 列被强制扩张 → 整个标题视觉上溢出到右侧卡片区域。

而 1021px 视口实际离 `lg` 断点（1024px）只差 3px，浏览器实际可能命中 `md` 也可能命中 `lg`，临界状态下 `text-5xl`(48px) 的 "Holding a Polymarket bet?" 配 `lg:whitespace-nowrap` 也会撑出 grid。

### 改动（只动 `HedgeHero.tsx` 的 `<h1>`）

**1. 副标题的 `whitespace-nowrap` 改为分级**：mobile/md 允许换行（避免撑爆窄列），仅 `lg` 及以上锁定不换行
```diff
- <span className="whitespace-nowrap bg-gradient-to-r ...">
+ <span className="lg:whitespace-nowrap bg-gradient-to-r ...">
```

**2. 主标题 `lg:whitespace-nowrap` 改为 `xl:whitespace-nowrap`**：`lg`(1024–1279px) 下左栏只有 ~480px，48px 字号的 "Holding a Polymarket bet?" 仍会溢出；推迟到 `xl`(≥1280px) 才整行不换行
```diff
- <span className="lg:whitespace-nowrap">Holding a Polymarket bet?</span>
+ <span className="xl:whitespace-nowrap">Holding a Polymarket bet?</span>
```

**3. `lg` 字号从 `text-5xl`(48px) 降到 `text-[2.5rem]`(40px)**：在 1024–1279px 区间字号更稳，给左栏留出余量，避免临界视口溢出
```diff
- md:text-4xl lg:text-5xl lg:tracking-[-0.02em] xl:text-6xl
+ md:text-4xl lg:text-[2.5rem] lg:tracking-[-0.02em] xl:text-6xl
```

**4. h1 容器加 `max-w-full` 防御性约束**：避免子元素 `whitespace-nowrap` 反向撑大父级 grid 列
```diff
- <h1 className="text-3xl font-bold leading-[1.1] tracking-tight ...">
+ <h1 className="max-w-full text-3xl font-bold leading-[1.1] tracking-tight ...">
```

### 调整后的最终断点表

| 视口 | 主标题字号 | "Holding a Polymarket bet?" | "Lock in profit — on us." |
|---|---|---|---|
| <768px | 30px | 自然换行（2 行） | 自然换行 |
| 768–1023px | 36px | 自然换行（2 行） | 自然换行（不再强撑） |
| 1024–1279px (用户 Mac) | 40px | 自然换行（2 行，紧凑） | 单行不换行 |
| ≥1280px | 60px | 单行不换行 | 单行不换行 |

### 不改动

- 副描述、CTA、Live stats、右侧卡片
- mobile 体验

### 预期效果

- 用户当前 1021px 视口：标题回归 `md:text-4xl`(36px) 正常 2 行排版，**完全留在左栏内**，不再覆盖右侧卡片
- 1024–1279px Mac 全屏：标题 40px 紧凑 2 行，副标题单行 punchline 完整保留
- ≥1280px 大屏：60px 大气单行排版

