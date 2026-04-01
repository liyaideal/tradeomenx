import { SeoPageLayout } from "@/components/seo";
import { FlaskConical } from "lucide-react";

const MethodologyPage = () => {
  return (
    <SeoPageLayout
      title="Methodology"
      description="How OmenX creates, prices, and settles event markets."
    >
      <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
        <div className="text-6xl md:text-8xl mb-6">🧪</div>
        <h2 className="text-lg md:text-2xl font-bold text-foreground mb-3">
          实验室里的仓鼠还在跑轮子…
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">
          我们的方法论文档正在由一只非常努力的仓鼠驱动生成中，<br />
          它需要再跑几圈才能完成 🐹💨
        </p>
        <div className="mt-8 px-4 py-2 rounded-full bg-muted/50 border border-border/30">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <FlaskConical className="w-3.5 h-3.5" />
            内容编写中，敬请期待
          </span>
        </div>
      </div>
    </SeoPageLayout>
  );
};

export default MethodologyPage;
