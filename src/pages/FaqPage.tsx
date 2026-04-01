import { SeoPageLayout } from "@/components/seo";
import { HelpCircle } from "lucide-react";

const FaqPage = () => {
  return (
    <SeoPageLayout
      title="Frequently Asked Questions"
      description="Everything you need to know about trading on OmenX."
    >
      <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
        <div className="text-6xl md:text-8xl mb-6">🤔</div>
        <h2 className="text-lg md:text-2xl font-bold text-foreground mb-3">
          问题太多，脑子转不过来了…
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">
          我们的 FAQ 团队正在宇宙某个角落疯狂敲键盘，<br />
          请给他们一点时间整理思绪 🧠✨
        </p>
        <div className="mt-8 px-4 py-2 rounded-full bg-muted/50 border border-border/30">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            内容编写中，敬请期待
          </span>
        </div>
      </div>
    </SeoPageLayout>
  );
};

export default FaqPage;
