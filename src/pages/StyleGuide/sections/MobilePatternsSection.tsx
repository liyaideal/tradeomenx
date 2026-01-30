import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MobileHeader } from "@/components/MobileHeader";
import { useNavigate } from "react-router-dom";
import { SectionWrapper, SubSection } from "../components/SectionWrapper";
import { CodePreview } from "../components/CodePreview";

interface MobilePatternsSectionProps {
  isMobile: boolean;
}

export const MobilePatternsSection = ({ isMobile }: MobilePatternsSectionProps) => {
  const navigate = useNavigate();
  
  // Mobile Header Playground - Basic
  const [headerTitle, setHeaderTitle] = useState("Bitcoin price on January 31, 2026?");
  const [headerShowLogo, setHeaderShowLogo] = useState(false);
  const [headerShowBack, setHeaderShowBack] = useState(true);
  const [headerShowActions, setHeaderShowActions] = useState(true);
  const [headerIsFavorite, setHeaderIsFavorite] = useState(false);
  
  // Mobile Header Playground - Stats Bar
  const [headerShowCountdown, setHeaderShowCountdown] = useState(true);
  const [headerShowPrice, setHeaderShowPrice] = useState(true);
  const [headerCurrentPrice, setHeaderCurrentPrice] = useState("$94,532.18");
  const [headerPriceChange, setHeaderPriceChange] = useState("+2.34%");
  const [headerPriceLabel, setHeaderPriceLabel] = useState("BTC/USD");
  const [headerShowTweetCount, setHeaderShowTweetCount] = useState(false);
  const [headerTweetCount, setHeaderTweetCount] = useState(1234);
  
  // Quick Presets for Header
  const applyHeaderPreset = (preset: string) => {
    switch (preset) {
      case "trade":
        setHeaderTitle("Will BTC reach $100k by March 2026?");
        setHeaderShowLogo(false);
        setHeaderShowBack(true);
        setHeaderShowActions(true);
        setHeaderShowCountdown(true);
        setHeaderShowPrice(true);
        setHeaderShowTweetCount(false);
        break;
      case "home":
        setHeaderTitle("");
        setHeaderShowLogo(true);
        setHeaderShowBack(false);
        setHeaderShowActions(false);
        setHeaderShowCountdown(false);
        setHeaderShowPrice(false);
        setHeaderShowTweetCount(false);
        break;
      case "detail":
        setHeaderTitle("Event Details");
        setHeaderShowLogo(true);
        setHeaderShowBack(true);
        setHeaderShowActions(true);
        setHeaderShowCountdown(true);
        setHeaderShowPrice(false);
        setHeaderShowTweetCount(true);
        break;
    }
  };

  return (
    <div className="space-y-12">
      {/* Mobile Header */}
      <SectionWrapper
        id="mobile-header"
        title="Mobile Header"
        platform="mobile"
        description="Configurable header component for mobile trading screens"
      >
        {/* Props Documentation */}
        <Card className="trading-card border-primary/30 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Props Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Prop</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Type</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr><td className="py-1.5 font-mono text-primary">title</td><td className="py-1.5">string</td><td className="py-1.5 text-muted-foreground">Main title text (optional)</td></tr>
                  <tr><td className="py-1.5 font-mono text-primary">showLogo</td><td className="py-1.5">boolean</td><td className="py-1.5 text-muted-foreground">Show logo on left (default: true)</td></tr>
                  <tr><td className="py-1.5 font-mono text-primary">showBack</td><td className="py-1.5">boolean</td><td className="py-1.5 text-muted-foreground">Show back button (auto-detected by default)</td></tr>
                  <tr><td className="py-1.5 font-mono text-primary">showActions</td><td className="py-1.5">boolean</td><td className="py-1.5 text-muted-foreground">Show favorite + share buttons</td></tr>
                  <tr><td className="py-1.5 font-mono text-primary">endTime</td><td className="py-1.5">Date</td><td className="py-1.5 text-muted-foreground">Countdown timer end time</td></tr>
                  <tr><td className="py-1.5 font-mono text-primary">currentPrice</td><td className="py-1.5">string</td><td className="py-1.5 text-muted-foreground">Live price display</td></tr>
                  <tr><td className="py-1.5 font-mono text-primary">priceChange24h</td><td className="py-1.5">string</td><td className="py-1.5 text-muted-foreground">24h price change (e.g., "+2.34%")</td></tr>
                  <tr><td className="py-1.5 font-mono text-primary">tweetCount</td><td className="py-1.5">number</td><td className="py-1.5 text-muted-foreground">Tweet count indicator</td></tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="text-lg">Mobile Header Playground</CardTitle>
            <CardDescription>Interactive configuration for all header variants</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs text-muted-foreground self-center">Presets:</span>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => applyHeaderPreset("trade")}
              >
                Trade Page
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => applyHeaderPreset("home")}
              >
                Home Page
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => applyHeaderPreset("detail")}
              >
                Detail Page
              </Badge>
            </div>

            {/* Preview */}
            <div className="bg-background rounded-xl border border-border overflow-hidden mb-6">
              <MobileHeader
                title={headerShowLogo && !headerTitle ? undefined : headerTitle}
                showLogo={headerShowLogo}
                showBack={headerShowBack}
                showActions={headerShowActions}
                isFavorite={headerIsFavorite}
                onFavoriteToggle={() => setHeaderIsFavorite(!headerIsFavorite)}
                endTime={headerShowCountdown ? new Date(Date.now() + 86400000 * 7) : undefined}
                currentPrice={headerShowPrice ? headerCurrentPrice : undefined}
                priceChange24h={headerShowPrice ? headerPriceChange : undefined}
                priceLabel={headerPriceLabel}
                tweetCount={headerShowTweetCount ? headerTweetCount : undefined}
              />
            </div>

            {/* Controls - 2 Column Layout */}
            <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
              {/* Left Column: Basic Settings */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Basic Settings</h4>
                <div className="space-y-2">
                  <Label className="text-xs">Title</Label>
                  <Input 
                    value={headerTitle} 
                    onChange={(e) => setHeaderTitle(e.target.value)}
                    placeholder="Enter title or leave empty"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Show Logo</Label>
                  <Switch checked={headerShowLogo} onCheckedChange={setHeaderShowLogo} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Show Back Button</Label>
                  <Switch checked={headerShowBack} onCheckedChange={setHeaderShowBack} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Show Actions (♡ + Share)</Label>
                  <Switch checked={headerShowActions} onCheckedChange={setHeaderShowActions} />
                </div>
              </div>

              {/* Right Column: Stats Bar */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Stats Bar</h4>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Show Countdown</Label>
                  <Switch checked={headerShowCountdown} onCheckedChange={setHeaderShowCountdown} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Show Price</Label>
                  <Switch checked={headerShowPrice} onCheckedChange={setHeaderShowPrice} />
                </div>
                {headerShowPrice && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Price</Label>
                      <Input 
                        value={headerCurrentPrice} 
                        onChange={(e) => setHeaderCurrentPrice(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">24h Change</Label>
                      <Input 
                        value={headerPriceChange} 
                        onChange={(e) => setHeaderPriceChange(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Show Tweet Count</Label>
                  <Switch checked={headerShowTweetCount} onCheckedChange={setHeaderShowTweetCount} />
                </div>
              </div>
            </div>

            <CodePreview 
              code={`<MobileHeader
  title="${headerTitle || "(none)"}"
  showLogo={${headerShowLogo}}
  showBack={${headerShowBack}}
  showActions={${headerShowActions}}${headerShowCountdown ? `
  endTime={new Date(...)}` : ""}${headerShowPrice ? `
  currentPrice="${headerCurrentPrice}"
  priceChange24h="${headerPriceChange}"` : ""}${headerShowTweetCount ? `
  tweetCount={${headerTweetCount}}` : ""}
/>`}
              collapsible
              defaultExpanded={false}
            />
          </CardContent>
        </Card>
      </SectionWrapper>

      {/* Mobile UI Patterns */}
      <SectionWrapper
        id="mobile-patterns"
        title="Mobile UI Patterns"
        platform="mobile"
        description="Best practices for mobile trading interfaces"
      >
        <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
          {/* Bottom CTA Placement */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Bottom CTA Placement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/30 rounded-xl h-40 relative">
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border">
                  <Button className="w-full">Primary Action</Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Place primary CTAs at the bottom of the screen for easy thumb reach.
              </p>
            </CardContent>
          </Card>

          {/* Safe Area */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Safe Area Padding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Use <code className="text-primary">pb-safe</code> or <code className="text-primary">pb-20</code> for bottom navigation.
              </p>
              <CodePreview 
                code={`<main className="min-h-screen pb-20">
  {/* Content */}
</main>

<BottomNav className="fixed bottom-0" />`}
              />
            </CardContent>
          </Card>

          {/* Drawer Pattern */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Bottom Sheet / Drawer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">
                Use Vaul drawer for mobile-friendly bottom sheets instead of dialogs.
              </p>
              <CodePreview 
                code={`import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

<Drawer>
  <DrawerTrigger asChild>
    <Button>Open Sheet</Button>
  </DrawerTrigger>
  <DrawerContent>
    {/* Content */}
  </DrawerContent>
</Drawer>`}
              />
            </CardContent>
          </Card>

          {/* Touch Targets */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Touch Target Sizes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-primary rounded-lg flex items-center justify-center text-xs text-primary-foreground">
                  44px
                </div>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-xs text-primary-foreground">
                  48px
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum 44px touch targets. Use <code className="text-primary">h-11</code> or <code className="text-primary">h-12</code>.
              </p>
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>
    </div>
  );
};
