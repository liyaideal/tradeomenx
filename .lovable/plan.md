

## 把 RecentActivity 轮播条移到页面顶部

### 改动

**文件**：`src/pages/HedgeLanding.tsx`

把 `<HedgeRecentActivity />` 从 `<HedgeHero />` 之后移到 header 之后、`<main>` 内的最顶部（Hero 之前）。桌面端和移动端共用同一份 JSX，所以一处改动两端生效。

### 调整后结构

```tsx
<main className="flex-1 pb-20 md:pb-0">
  <HedgeRecentActivity />        {/* ← 移到这里，紧贴 header */}
  <div ref={heroRef}>
    <HedgeHero />
  </div>
  <HedgeHowItWorks />
  <HedgeLiveExample />
  <HedgeFoundersNote />
  <HedgeKeyRules />
  <HedgeSocialProof />
  <HedgeFAQ />
  <HedgeFinalCTA />
</main>
```

### 不改动

- `HedgeRecentActivity.tsx` 自身样式（已有 `border-b border-border/40 bg-card/60`，作为顶部条带视觉合适）
- 其他 section 顺序、Hero 内部布局、FloatingCTA、SeoFooter
- `heroRef` 仍然只包住 Hero，FloatingCTA 的触发逻辑不变

### 预期效果

- 进入 `/hedge` 第一眼即看到滚动的"实时活动"信息流，强化"有人正在用"的社会证明
- Hero 紧随其后，CTA 仍在第一屏可点（移动端 Hero 已优化过）

