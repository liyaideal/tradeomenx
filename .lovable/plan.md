## 问题诊断

当前 avatar dropdown 共 10 项，扁平堆叠，分组混乱：

```text
当前结构                          问题
──────────────────────────────────────────────────────
Portfolio                        ← 与主 nav 重复
Rewards
Referral
─── separator ───
Settings
Transparency Audit               ← 是公开产品页，不是个人设置
Language (sub)                   ← 偏好类被埋
Join Discord                     ← 社区入口
Help & Support                   ← 当前错误指向 Discord，应指向 Help Center
─── separator ───
Sign Out
```

## 重组方案

按"账户活动 → 偏好 → 产品/支持 → 退出"四组重排，从 10 项减到 9 项（去掉重复的 Portfolio）。Discord 与 Help & Support 保留为两个独立入口，因为它们目标不同：

- **Help & Support** → 跳转到独立 Help Center 站点 `https://omenx-helpcenter.lovable.app`（结构化 FAQ / 文档）
- **Join Discord** → 跳转到社区聊天 `https://discord.gg/qXssm2crf9`（实时社群）

```text
新结构                            分组语义
──────────────────────────────────────────────────────
Rewards                          [Account & activity]
Referral
─── separator ───
Settings                         [Preferences]
Language (sub)        EN ›
─── separator ───
Transparency Audit               [Product & support]
Help & Support       (Help Center) ↗
Join Discord         (Community)  ↗
─── separator ───
Sign Out                         [Session]
```

### 具体改动

1. **移除 Portfolio**：主 nav 已有，避免双入口稀释 nav 重要性
2. **修正 Help & Support 链接**：从 Discord URL 改为 `https://omenx-helpcenter.lovable.app`，target=_blank
3. **保留 Join Discord**：与 Help Center 是不同性质入口，不合并
4. **Transparency Audit 单独成组**：从 "Settings 群" 拆出，与 Help / Discord 一起放在 "Product & support" 段
5. **Language 紧挨 Settings**：偏好类聚合
6. **外链视觉提示**：Help & Support、Join Discord 行右侧加 `<ExternalLink className="h-3 w-3 text-muted-foreground" />`，提示新窗口打开

### 视觉/交互细节

- 每个分组之间保留一个 `DropdownMenuSeparator`，共 3 条分隔线
- 图标颜色继续沿用现有语义：Rewards/Referral primary 紫，Transparency emerald，Discord 用 `#5865F2` 品牌色，Help muted，Sign Out red
- Width 不变（`w-52`）

### 修改清单

- **`src/components/EventsDesktopHeader.tsx`** (lines 161–248)
  - 删除 Portfolio item（同时清理未使用的 `Briefcase` import）
  - 调整顺序：Rewards/Referral → sep → Settings/Language → sep → Transparency/Help/Discord → sep → Sign Out
  - Help & Support `onClick` URL 改为 `https://omenx-helpcenter.lovable.app`
  - Help & Support、Join Discord 行右侧加 `ExternalLink` 图标
  - 新增 `ExternalLink` import from `lucide-react`

### 不动的部分

- 触发器按钮（avatar + username + chevron）样式
- Equity 胶囊
- Mobile 端（mobile 走 BottomNav，不受影响）
- 各页面路由

### 验证

- 桌面 viewport 1024 / 1440 截图，确认 9 项分组清晰、无视觉拥挤
- 点击每项跳转正确：Rewards/Referral → toast；Settings → /settings；Transparency → /settings/transparency；Language 子菜单切换；Help → omenx-helpcenter 新窗口；Discord → discord.gg 新窗口；Sign Out 正常
