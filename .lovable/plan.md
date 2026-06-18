## 改动

在 `HedgeHowItWorks.tsx` 的"Hedge in 3 steps"区块（3个步骤卡片下方）增加一个居中的总 CTA 按钮，复用已有的 `HedgeCTAButton`（与 Hero 顶部按钮逻辑一致：未连钱包→连钱包弹窗，已连→跳 portfolio airdrops）。

### 具体

文件：`src/components/hedge/HedgeHowItWorks.tsx`
- 在 3 个 step 卡片 grid 之后追加一个容器：`<div className="mt-8 md:mt-10 flex justify-center"><HedgeCTAButton size="lg" /></div>`
- 顶部 import `HedgeCTAButton`

不改动 `HedgeCTAButton` 本身的行为，确保和 Hero 的 CTA 表现一致。其他段落（Reassurance、HedgeOutcomeSplit）保持不变。
