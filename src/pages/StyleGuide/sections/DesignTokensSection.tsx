import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SectionWrapper } from "../components/SectionWrapper";
import { CodePreview } from "../components/CodePreview";
import omenxLogo from "@/assets/omenx-logo.svg";

interface DesignTokensSectionProps {
  isMobile: boolean;
}

export const DesignTokensSection = ({ isMobile }: DesignTokensSectionProps) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(label);
    toast.success(`Copied: ${text}`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const colorSections = [
    {
      title: "Core Surface Colors",
      description: "Background and container colors for the application",
      colors: [
        { name: "Background", variable: "--background", class: "bg-background", value: "222 47% 6%", usage: "Main app background" },
        { name: "Background Elevated", variable: "--background-elevated", class: "bg-background-elevated", value: "222 40% 8%", usage: "Elevated surfaces" },
        { name: "Card", variable: "--card", class: "bg-card", value: "222 35% 10%", usage: "Card backgrounds" },
        { name: "Card Hover", variable: "--card-hover", class: "bg-card-hover", value: "222 35% 12%", usage: "Card hover state" },
        { name: "Muted", variable: "--muted", class: "bg-muted", value: "222 25% 14%", usage: "Muted backgrounds" },
        { name: "Secondary", variable: "--secondary", class: "bg-secondary", value: "222 30% 16%", usage: "Secondary buttons/inputs" },
      ]
    },
    {
      title: "Brand Colors (Purple Primary)",
      description: "Purple is the primary brand color for navigation, CTAs, and interactive elements",
      colors: [
        { name: "Primary", variable: "--primary", class: "bg-primary", value: "260 60% 55%", usage: "Navigation, CTAs, focus states" },
        { name: "Primary Hover", variable: "--primary-hover", class: "bg-primary-hover", value: "260 60% 50%", usage: "Primary hover state" },
        { name: "Primary Muted", variable: "--primary-muted", class: "bg-primary-muted", value: "260 40% 25%", usage: "Primary backgrounds" },
        { name: "Accent", variable: "--accent", class: "bg-accent", value: "260 50% 45%", usage: "Highlights, accents" },
      ]
    },
    {
      title: "Trading Semantic Colors",
      description: "Green = Success/Profit, Red = Loss/Error, Yellow = Alert, Purple = Brand emphasis",
      colors: [
        { name: "Trading Green", variable: "--trading-green", class: "bg-trading-green", value: "142 71% 45%", usage: "Profit, buy, success" },
        { name: "Trading Green Muted", variable: "--trading-green-muted", class: "bg-trading-green-muted", value: "142 50% 20%", usage: "Green backgrounds" },
        { name: "Trading Red", variable: "--trading-red", class: "bg-trading-red", value: "0 72% 51%", usage: "Loss, sell, error" },
        { name: "Trading Red Muted", variable: "--trading-red-muted", class: "bg-trading-red-muted", value: "0 50% 20%", usage: "Red backgrounds" },
        { name: "Trading Purple", variable: "--trading-purple", class: "bg-trading-purple", value: "260 60% 55%", usage: "Brand emphasis" },
        { name: "Trading Yellow", variable: "--trading-yellow", class: "bg-trading-yellow", value: "45 93% 58%", usage: "Alerts, warnings" },
      ]
    },
    {
      title: "Border & Text Colors",
      description: "Borders, inputs, and text hierarchy",
      colors: [
        { name: "Border", variable: "--border", class: "bg-border", value: "222 25% 18%", usage: "Default borders" },
        { name: "Input", variable: "--input", class: "bg-input", value: "222 30% 12%", usage: "Input backgrounds" },
        { name: "Foreground", variable: "--foreground", class: "bg-foreground", value: "210 40% 98%", usage: "Primary text" },
        { name: "Muted Foreground", variable: "--muted-foreground", class: "text-muted-foreground bg-muted", value: "215 20% 55%", usage: "Secondary text" },
      ]
    },
  ];

  return (
    <div className="space-y-12">
      {/* Brand Logo */}
      <SectionWrapper 
        id="brand-logo" 
        title="Brand Logo" 
        platform="shared"
        description="Official OMENX logo and usage guidelines"
      >
        <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Primary Logo (Dark BG)</CardTitle>
              <CardDescription>Use on dark backgrounds - default usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-background rounded-xl p-8 flex items-center justify-center border border-border/30">
                <img src={omenxLogo} alt="OMENX Logo" className="h-12" />
              </div>
              <CodePreview
                code={`import omenxLogo from "@/assets/omenx-logo.svg";\n\n<img src={omenxLogo} alt="OMENX Logo" className="h-12" />`}
                language="tsx"
              />
            </CardContent>
          </Card>

          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Logo Sizes</CardTitle>
              <CardDescription>Recommended size variants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Header (h-8)", size: "h-8" },
                { label: "Standard (h-10)", size: "h-10" },
                { label: "Large (h-12)", size: "h-12" },
                { label: "Hero (h-16)", size: "h-16" },
              ].map(({ label, size }) => (
                <div key={size} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <img src={omenxLogo} alt="OMENX" className={size} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>

      {/* Colors */}
      <SectionWrapper 
        id="colors" 
        title="Color Tokens" 
        platform="shared"
        description="All colors are defined as CSS variables in HSL format"
      >
        <div className="space-y-8">
          {colorSections.map((section) => (
            <Card key={section.title} className="trading-card">
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid gap-3 ${isMobile ? "grid-cols-2" : "grid-cols-3"}`}>
                  {section.colors.map((color) => (
                    <button
                      key={color.name}
                      className="text-left p-3 rounded-lg border border-border/50 hover:border-border transition-colors group"
                      onClick={() => copyToClipboard(`hsl(var(${color.variable}))`, color.name)}
                    >
                      <div className={`h-10 rounded-md ${color.class} mb-2 border border-white/10`} />
                      <p className="text-sm font-medium truncate">{color.name}</p>
                      <p className="text-xs text-muted-foreground font-mono truncate">{color.variable}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 truncate">{color.usage}</p>
                      <div className="flex items-center gap-1 mt-1.5 text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        {copiedColor === color.name ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        <span>Click to copy</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      {/* Spacing & Border Radius */}
      <SectionWrapper 
        id="spacing" 
        title="Spacing & Border Radius" 
        platform="shared"
        description="Consistent spacing and radius tokens"
      >
        <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Spacing Scale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3, 4, 6, 8, 12, 16].map((size) => (
                <div key={size} className="flex items-center gap-3">
                  <code className="text-xs text-muted-foreground w-16">p-{size}</code>
                  <div className={`bg-primary/30 p-${size} rounded`}>
                    <div className="bg-primary w-4 h-4 rounded" />
                  </div>
                  <span className="text-xs text-muted-foreground">{size * 4}px</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Border Radius</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "rounded-sm", value: "2px" },
                { name: "rounded", value: "4px" },
                { name: "rounded-md", value: "6px" },
                { name: "rounded-lg", value: "8px" },
                { name: "rounded-xl", value: "12px" },
                { name: "rounded-2xl", value: "16px" },
                { name: "rounded-full", value: "9999px" },
              ].map(({ name, value }) => (
                <div key={name} className="flex items-center gap-3">
                  <code className="text-xs text-muted-foreground w-28">{name}</code>
                  <div className={`bg-primary w-16 h-8 ${name}`} />
                  <span className="text-xs text-muted-foreground">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>
    </div>
  );
};
