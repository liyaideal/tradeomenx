import { SeoPageLayout } from "@/components/seo";
import { Rocket } from "lucide-react";

const AboutPage = () => {
  return (
    <SeoPageLayout
      title="About OmenX"
      description="OmenX is a next-generation event trading platform."
    >
      <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
        <div className="text-6xl md:text-8xl mb-6">🚀</div>
        <h2 className="text-lg md:text-2xl font-bold text-foreground mb-3">
          我们还在火星上赶稿…
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">
          关于我们的故事精彩到需要额外一点时间打磨，<br />
          毕竟在火星上 Wi-Fi 信号不太好 📡
        </p>
        <div className="mt-8 px-4 py-2 rounded-full bg-muted/50 border border-border/30">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Rocket className="w-3.5 h-3.5" />
            内容编写中，敬请期待
          </span>
        </div>
      </div>
    </SeoPageLayout>
  );
};

export default AboutPage;
