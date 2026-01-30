import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MobileHeader } from "@/components/MobileHeader";
import { useNavigate } from "react-router-dom";
import { SectionWrapper } from "../components/SectionWrapper";
import { CodePreview } from "../components/CodePreview";

interface MobilePatternsSectionProps {
  isMobile: boolean;
}

export const MobilePatternsSection = ({ isMobile }: MobilePatternsSectionProps) => {
  const navigate = useNavigate();
  
  // Mobile Header Playground
  const [headerTitle, setHeaderTitle] = useState("Bitcoin price on January 31, 2026?");
  const [headerShowLogo, setHeaderShowLogo] = useState(false);
  const [headerShowBack, setHeaderShowBack] = useState(true);
  const [headerShowActions, setHeaderShowActions] = useState(true);
  const [headerIsFavorite, setHeaderIsFavorite] = useState(false);
  const [headerShowCountdown, setHeaderShowCountdown] = useState(true);
  const [headerShowPrice, setHeaderShowPrice] = useState(true);
  const [headerCurrentPrice, setHeaderCurrentPrice] = useState("$94,532.18");
  const [headerPriceChange, setHeaderPriceChange] = useState("+2.34%");

  return (
    <div className="space-y-12">
      {/* Mobile Header */}
      <SectionWrapper
        id="mobile-header"
        title="Mobile Header"
        platform="mobile"
        description="Configurable header component for mobile trading screens"
      >
        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="text-lg">Mobile Header Playground</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Preview */}
            <div className="bg-background rounded-xl border border-border overflow-hidden mb-6">
              <MobileHeader
                title={headerShowLogo ? undefined : headerTitle}
                showLogo={headerShowLogo}
                showBack={headerShowBack}
                showActions={headerShowActions}
                isFavorite={headerIsFavorite}
                onFavoriteToggle={() => setHeaderIsFavorite(!headerIsFavorite)}
                endTime={headerShowCountdown ? new Date(Date.now() + 86400000 * 7) : undefined}
                currentPrice={headerShowPrice ? headerCurrentPrice : undefined}
                priceChange24h={headerShowPrice ? headerPriceChange : undefined}
              />
            </div>

            {/* Controls */}
            <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Title (if not showing logo)</Label>
                  <Input 
                    value={headerTitle} 
                    onChange={(e) => setHeaderTitle(e.target.value)}
                    disabled={headerShowLogo}
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
                  <Label className="text-xs">Show Actions</Label>
                  <Switch checked={headerShowActions} onCheckedChange={setHeaderShowActions} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Show Countdown</Label>
                  <Switch checked={headerShowCountdown} onCheckedChange={setHeaderShowCountdown} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Show Price</Label>
                  <Switch checked={headerShowPrice} onCheckedChange={setHeaderShowPrice} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Current Price</Label>
                    <Input 
                      value={headerCurrentPrice} 
                      onChange={(e) => setHeaderCurrentPrice(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Price Change</Label>
                    <Input 
                      value={headerPriceChange} 
                      onChange={(e) => setHeaderPriceChange(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <CodePreview 
              code={`<MobileHeader
  title="${headerTitle.slice(0, 30)}..."
  showLogo={${headerShowLogo}}
  showBack={${headerShowBack}}
  showActions={${headerShowActions}}
  showCountdown={${headerShowCountdown}}
  showPrice={${headerShowPrice}}
  currentPrice="${headerCurrentPrice}"
  priceChange="${headerPriceChange}"
/>`}
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
