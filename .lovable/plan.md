## 目标
让 `/resolved` 列表卡不再显示让人困惑的"中间价"（如 `$0.62`）。结算后每个选项的语义只有"赢/输"，由 Check/X 图标 + 颜色 + `Winner` 标签表达即可；价格细节交给详情页。

## 改动范围（仅 1 个文件）
`src/components/ResolvedEventCard.tsx` 中的 `OptionItem` 子组件。

### Before（当前）
```
[✓] Yes                          $0.62   ← 困惑：这是结算价？
[✗] No                           $0.38
```

### After
```
[✓] Yes                         Winner
[✗] No
```

## 具体修改

**`OptionItem`（约 25–56 行）**
- 删除右侧 `<span>` 中的 `$displayPrice` 渲染。
- 删除局部变量 `displayPrice`（不再使用 `final_price` / `price`）。
- 赢的选项：右侧改为一个小 `Badge`（或简单的 `<span>`），文案 `Winner`，使用 `text-[10px] uppercase tracking-wide bg-trading-green/20 text-trading-green border border-trading-green/30 rounded px-1.5 py-0.5`，保持设计 token 一致。
- 输的选项：右侧不显示任何东西（icon + 灰字标签已经够清晰）。
- 左侧 Check/X + label 文案/颜色保持不变。

桌面双列网格、移动折叠逻辑、Total Volume、Date、PnL badge 等其他元素全部不动。

## 不改动的部分
- `ResolvedEvent` 数据结构、`useResolvedEvents` hook、详情页都不动。
- `EventShareCard`（分享海报）保留原有价格显示，因为海报另有它的叙事节奏，且不在本次反馈范围内。
- 数据库 `final_price` 字段照常落库，仅 UI 层不展示。

## 完成判据
- `/resolved` 列表中每张卡片的选项行右侧不再出现 `$X.XX`。
- 赢的选项右侧出现绿色 `Winner` 小标签；输的选项右侧为空。
- 桌面 1021px 与移动端两套布局均生效，折叠/展开按钮、Total Volume 不受影响。
