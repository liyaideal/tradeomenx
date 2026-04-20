

## 看图诊断

截图清晰暴露的问题：
1. **数值被截断成 `$3...` `$48...` `-0...`** —— 4-cell 平分 + 右边 Info 按钮挤掉空间，每个 cell 只剩 ~50px，根本放不下 `$3.45M` 这种数值
2. **Funding 红色底块孤立刺眼** —— 单独一个 cell 高亮反而像 error 状态
3. **大写 label `VOL/OI/FUNDING/NEXT` 太重** —— 配合粗体数值，整条 strip 视觉权重过高，喧宾夺主（这是 trade form，主角是 Buy/Sell 按钮）
4. **Info 按钮带边框 + 背景** —— 在小空间里像一个独立的 CTA，但其实只是辅助入口
5. **整体 `bg-muted/20` 灰底** —— 把这条 strip 视觉抬得太高

**根因**：4-cell 横向平分在 390px 移动端不够空间，且把"市场元数据"做成了"主操作区"的视觉权重。

## 重新设计：低调横向 inline + 自适应缩写

回归 Hyperliquid / GMX 这类 perp 交易界面的真正做法：**meta 信息是低调的辅助行，不是数据卡片**。

新方案：

```
┌────────────────────────────────────────────────┐
│ Vol $3.45M   OI $480K   Funding -0.01%   28m   │ⓘ│
└────────────────────────────────────────────────┘
```

设计要点：
1. **回到单行 inline**，但用 **label/value 同行 + 不同颜色权重** 实现层级（不靠上下堆叠）：
   - Label：`text-muted-foreground` 普通字重
   - Value：`text-foreground font-mono font-medium`
   - 同行紧贴，例：`Vol <space> $3.45M`
2. **字段间距用 `gap-3` 自然分隔**，去掉竖线和点（更干净）
3. **Funding 只给数值染色**（负红/正绿），不加背景块，不孤立
4. **"Next" 直接显示数值 `28m`**，省掉 label（上下文里 funding 旁边的时间不言自明，或写成 `Funding -0.01% / 28m` 合并）
5. **Info 改成纯 icon 按钮**（`w-7 h-7` 圆形 ghost，只有 ⓘ 图标，无文字），右上角小巧不抢戏
6. **去掉背景色**，只留 `border-b border-border/30`，回归"信息行"本质
7. **横向滚动兜底**：`overflow-x-auto scrollbar-hide` —— 极端窄屏可滑动看完整数据，永不截断
8. **字号 `text-[11px]`**，比之前 `text-[10px]` 略大，可读性更好

视觉示意（移动端 390px）：

```
Vol $3.45M    OI $480K    Funding -0.01% / 28m         [ⓘ]
└─灰─┘└─白─┘  └─灰─┘└─白─┘  └────灰─┘└──红──┘└灰┘        圆按钮
```

## 关键对比

| 维度 | 旧（被吐槽版） | 新方案 |
|------|--------------|-------|
| 布局 | 4-cell 平分 + 上下堆叠 | 单行 inline + 横滚兜底 |
| Label | 大写粗体喧宾夺主 | 同行小灰字，权重低 |
| 数值截断 | `$3...` `$48...` | 完整显示，必要时滚动 |
| Funding 高亮 | 红底色块孤立 | 仅数值染色，融入整体 |
| Info 按钮 | 带边框 + "Info" 文字 | 圆形 ghost icon-only |
| 整体背景 | `bg-muted/20` 灰底 | 透明，只留底部分隔线 |
| 视觉权重 | 抢戏 | 辅助 |

## 具体改动

**改动文件**：`src/pages/TradeOrder.tsx`

1. **删除 `StatCell` 内联组件**（23-61 行附近），不再需要
2. **重写 Market Stats Strip**（107-136 行附近）：

```tsx
<div className="px-3 py-2 border-b border-border/30">
  <div className="flex items-center gap-2">
    <div className="flex-1 flex items-center gap-3 text-[11px] overflow-x-auto scrollbar-hide whitespace-nowrap">
      <span className="text-muted-foreground">
        Vol <span className="font-mono font-medium text-foreground ml-0.5">{vol}</span>
      </span>
      <span className="text-muted-foreground">
        OI <span className="font-mono font-medium text-foreground ml-0.5">$480K</span>
      </span>
      <span className="text-muted-foreground">
        Funding <span className="font-mono font-medium text-trading-red ml-0.5">-0.01%</span>
        <span className="text-muted-foreground/50 mx-1">/</span>
        <span className="font-mono font-medium text-foreground">28m</span>
      </span>
    </div>
    <SheetTrigger asChild>
      <button
        aria-label="Event info"
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
      >
        <Info className="w-3.5 h-3.5" />
      </button>
    </SheetTrigger>
  </div>
</div>
```

3. **图标换成 `Info`**（来自 lucide-react），比 `ExternalLink` 更语义匹配（不是跳外链，是查看信息）

## 不改动
- TradeForm Buy/Sell 按钮
- OrderBook
- Event Info Sheet 内容
- 桌面端布局

## 一句话总结
**回归"低调辅助信息行"本质**：单行 inline + label/value 同行配色分层 + Funding 只染色不加底 + Info 改圆形 icon-only + 横滚兜底防截断 = 不抢戏、不截断、有秩序。

