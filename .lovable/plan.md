# 更新 Activation 模块的次级入口文案

把 ActivationHero 上 "Why mainnet?" 改成更有营销感、更有诱因的 **"See launch rewards"**。

## 改动范围
仅 `src/components/activation/ActivationHero.tsx`：

- **桌面端按钮**：`Why mainnet?` → `See launch rewards`
- **Mobile 文字链接**：`Why mainnet?` → `See launch rewards`
- Sparkles 图标保留（强化"奖励/亮点"暗示），跳转目标 `/mainnet-launch` 不变

不动业务逻辑、不动桌面端其他视觉、不动主 CTA。
