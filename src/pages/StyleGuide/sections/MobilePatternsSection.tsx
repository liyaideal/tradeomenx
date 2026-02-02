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
import { Logo, omenxLogo } from "@/components/Logo";
import { Check, X, AlertCircle, ChevronLeft, Heart, Share2 } from "lucide-react";

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
      {/* =========================== */}
      {/* LOGO USAGE GUIDELINES       */}
      {/* =========================== */}
      <SectionWrapper
        id="logo-guidelines"
        title="Logo Usage Guidelines"
        platform="shared"
        description="Complete rules for OMENX logo usage across all platforms and contexts"
      >
        {/* Logo Sizes */}
        <Card className="trading-card mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Logo Sizes</CardTitle>
            <CardDescription>Standard logo sizes for different contexts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { size: "sm" as const, label: "Small (h-4)", usage: "Compact headers, nav items" },
                { size: "md" as const, label: "Medium (h-5)", usage: "Mobile headers (default)" },
                { size: "lg" as const, label: "Large (h-6)", usage: "Desktop headers" },
                { size: "xl" as const, label: "Extra Large (h-8)", usage: "Landing pages, branding" },
              ].map(({ size, label, usage }) => (
                <div key={size} className="bg-muted/30 rounded-xl p-4 flex flex-col items-center gap-3">
                  <div className="h-12 flex items-center justify-center">
                    <Logo size={size} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium">{label}</p>
                    <p className="text-[10px] text-muted-foreground">{usage}</p>
                  </div>
                </div>
              ))}
            </div>
            <CodePreview 
              code={`import { Logo } from "@/components/Logo";

<Logo size="sm" />  // h-4 - Compact headers
<Logo size="md" />  // h-5 - Mobile headers (default)
<Logo size="lg" />  // h-6 - Desktop headers
<Logo size="xl" />  // h-8 - Landing pages`}
            />
          </CardContent>
        </Card>

        {/* Light Background Usage */}
        <Card className="trading-card mb-6 border-trading-yellow/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-trading-yellow" />
              Light Background Usage
            </CardTitle>
            <CardDescription>Logo is white - requires special treatment on light backgrounds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
              {/* Dark background (standard) */}
              <div>
                <p className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                  <Check className="h-3 w-3 text-trading-green" />
                  Dark Background (Standard)
                </p>
                <div className="bg-background rounded-xl p-6 flex items-center justify-center border border-border">
                  <Logo size="lg" />
                </div>
              </div>

              {/* Light background with invert */}
              <div>
                <p className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                  <Check className="h-3 w-3 text-trading-green" />
                  Light Background (Use invert)
                </p>
                <div className="bg-white rounded-xl p-6 flex items-center justify-center border border-border">
                  <Logo size="lg" className="invert" />
                </div>
              </div>

              {/* Wrong: White logo on white */}
              <div>
                <p className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                  <X className="h-3 w-3 text-trading-red" />
                  WRONG: Invisible on Light
                </p>
                <div className="bg-white rounded-xl p-6 flex items-center justify-center border border-border">
                  <Logo size="lg" />
                </div>
              </div>

              {/* Container approach */}
              <div>
                <p className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                  <Check className="h-3 w-3 text-trading-green" />
                  Alternative: Dark Container
                </p>
                <div className="bg-white rounded-xl p-6 flex items-center justify-center border border-border">
                  <div className="bg-background rounded-lg px-4 py-2">
                    <Logo size="lg" />
                  </div>
                </div>
              </div>
            </div>
            <CodePreview 
              code={`// On light backgrounds, use the invert class
<Logo size="lg" className="invert" />

// Or wrap in a dark container
<div className="bg-background rounded-lg px-4 py-2">
  <Logo size="lg" />
</div>`}
            />
          </CardContent>
        </Card>

        {/* Do's and Don'ts */}
        <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
          <Card className="trading-card border-trading-green/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-trading-green">
                <Check className="h-4 w-4" />
                Do's
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-trading-green/5 rounded-lg">
                <Check className="h-4 w-4 text-trading-green shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Use consistent sizing</p>
                  <p className="text-xs text-muted-foreground">Always use predefined size props (sm, md, lg, xl)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-trading-green/5 rounded-lg">
                <Check className="h-4 w-4 text-trading-green shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Maintain clear space</p>
                  <p className="text-xs text-muted-foreground">Keep minimum padding around logo (equal to logo height)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-trading-green/5 rounded-lg">
                <Check className="h-4 w-4 text-trading-green shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Use Logo component</p>
                  <p className="text-xs text-muted-foreground">Import from @/components/Logo for consistency</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-trading-green/5 rounded-lg">
                <Check className="h-4 w-4 text-trading-green shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Apply invert on light backgrounds</p>
                  <p className="text-xs text-muted-foreground">Use className="invert" when needed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="trading-card border-trading-red/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-trading-red">
                <X className="h-4 w-4" />
                Don'ts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-trading-red/5 rounded-lg">
                <X className="h-4 w-4 text-trading-red shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Don't stretch or distort</p>
                  <p className="text-xs text-muted-foreground">Maintain w-auto for proper aspect ratio</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-trading-red/5 rounded-lg">
                <X className="h-4 w-4 text-trading-red shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Don't add effects</p>
                  <p className="text-xs text-muted-foreground">No drop shadows, glows, or gradients on logo</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-trading-red/5 rounded-lg">
                <X className="h-4 w-4 text-trading-red shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Don't use raw SVG</p>
                  <p className="text-xs text-muted-foreground">Import the Logo component, not the raw asset</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-trading-red/5 rounded-lg">
                <X className="h-4 w-4 text-trading-red shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Don't change colors</p>
                  <p className="text-xs text-muted-foreground">Only use invert filter, no color modifications</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Context Usage Table */}
        <Card className="trading-card mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Usage by Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Context</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Size</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr>
                    <td className="py-2">MobileHome, EventsPage headers</td>
                    <td className="py-2 font-mono text-primary">md</td>
                    <td className="py-2 text-muted-foreground">Left-aligned, no back button</td>
                  </tr>
                  <tr>
                    <td className="py-2">Trade pages (TradeOrder, TradingCharts)</td>
                    <td className="py-2 font-mono text-muted-foreground">—</td>
                    <td className="py-2 text-muted-foreground">Logo hidden, show back button only</td>
                  </tr>
                  <tr>
                    <td className="py-2">Detail pages with back button</td>
                    <td className="py-2 font-mono text-primary">md</td>
                    <td className="py-2 text-muted-foreground">Back + Logo together</td>
                  </tr>
                  <tr>
                    <td className="py-2">Desktop navigation</td>
                    <td className="py-2 font-mono text-primary">lg</td>
                    <td className="py-2 text-muted-foreground">Left side of top nav</td>
                  </tr>
                  <tr>
                    <td className="py-2">Marketing/Landing pages</td>
                    <td className="py-2 font-mono text-primary">xl</td>
                    <td className="py-2 text-muted-foreground">Hero sections, footers</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </SectionWrapper>

      {/* =========================== */}
      {/* MOBILE HEADER DESIGN SPECS  */}
      {/* =========================== */}
      <SectionWrapper
        id="mobile-header-specs"
        title="Mobile Header Design Specification"
        platform="mobile"
        description="Comprehensive rules for mobile header layout and behavior"
      >
        {/* Page Type Classification */}
        <Card className="trading-card mb-6 border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg">Page Type Classification</CardTitle>
            <CardDescription>Different page types have different header requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
              {/* Functional Pages */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <h4 className="font-medium">Functional Pages</h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  Core app navigation pages accessed via BottomNav. Never show back button.
                </p>
                <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-primary">/</span>
                    <span>Home (MobileHome)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-primary">/events</span>
                    <span>Events List</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-primary">/leaderboard</span>
                    <span>Leaderboard</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-primary">/trade</span>
                    <span>Trade Hub</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-primary">/portfolio</span>
                    <span>Portfolio</span>
                  </div>
                </div>
              </div>

              {/* Operational Pages */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-trading-purple" />
                  <h4 className="font-medium">Operational Pages</h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  Detail/action pages accessed via links. Show back button when navigated via PUSH.
                </p>
                <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-primary">/trade/:id</span>
                    <span>Trade Order</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-primary">/wallet</span>
                    <span>Wallet</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-primary">/deposit</span>
                    <span>Deposit</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-primary">/settings</span>
                    <span>Settings</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-primary">/resolved/:id</span>
                    <span>Resolved Event</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Header Rules Table */}
        <Card className="trading-card mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Header Component Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Element</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Rule</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Implementation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr>
                    <td className="py-2 font-medium flex items-center gap-2">
                      <ChevronLeft className="h-3 w-3" /> Back Button
                    </td>
                    <td className="py-2 text-muted-foreground">
                      Auto-detect via navigationType. Never on BottomNav pages.
                    </td>
                    <td className="py-2">
                      <code className="text-primary text-[10px]">showBack</code> prop or auto
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium flex items-center gap-2">
                      <Logo size="sm" /> Logo
                    </td>
                    <td className="py-2 text-muted-foreground">
                      Show everywhere EXCEPT Trade pages. Left-aligned.
                    </td>
                    <td className="py-2">
                      <code className="text-primary text-[10px]">showLogo=&#123;true&#125;</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Title</td>
                    <td className="py-2 text-muted-foreground">
                      Centered. Max 2 lines with line-clamp-2. 14px semibold.
                    </td>
                    <td className="py-2">
                      <code className="text-primary text-[10px]">title</code> prop
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium flex items-center gap-2">
                      <Heart className="h-3 w-3" />
                      <Share2 className="h-3 w-3" />
                      Actions
                    </td>
                    <td className="py-2 text-muted-foreground">
                      Favorite + Share. 36x36 touch targets. Ghost style.
                    </td>
                    <td className="py-2">
                      <code className="text-primary text-[10px]">showActions=&#123;true&#125;</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">rightContent</td>
                    <td className="py-2 text-muted-foreground">
                      Custom slot overrides showActions. Any ReactNode.
                    </td>
                    <td className="py-2">
                      <code className="text-primary text-[10px]">rightContent=&#123;...&#125;</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Stats Row</td>
                    <td className="py-2 text-muted-foreground">
                      Shows when endTime/currentPrice/tweetCount provided.
                    </td>
                    <td className="py-2">
                      <code className="text-primary text-[10px]">endTime, currentPrice</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Visual Examples */}
        <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
          {/* Home Page Header */}
          <Card className="trading-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Home Page Header</CardTitle>
              <CardDescription className="text-[10px]">Logo only, no back, no actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-background rounded-lg border border-border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                  <Logo size="md" />
                  <div className="w-9" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trade Page Header */}
          <Card className="trading-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Trade Page Header</CardTitle>
              <CardDescription className="text-[10px]">Back button, title, actions, stats row</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-background rounded-lg border border-border overflow-hidden">
                <div className="px-4 py-2 border-b border-border">
                  <div className="flex items-center justify-between">
                    <button className="h-9 w-9 flex items-center justify-center">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-sm font-semibold text-center flex-1">BTC to $100k?</h1>
                    <div className="flex items-center gap-1">
                      <button className="h-9 w-9 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                      </button>
                      <button className="h-9 w-9 flex items-center justify-center">
                        <Share2 className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                  {/* Stats row */}
                  <div className="flex items-center justify-center gap-4 mt-1.5 pt-1.5 border-t border-border/30">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-trading-red rounded-full" />
                      <span className="text-[10px] text-muted-foreground">Ends in</span>
                      <span className="text-[10px] text-trading-red font-mono">23:45:12</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-trading-green rounded-full" />
                      <span className="text-[10px] text-muted-foreground">Price</span>
                      <span className="text-[10px] text-trading-green font-mono">$94,532</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detail Page Header */}
          <Card className="trading-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Detail Page Header</CardTitle>
              <CardDescription className="text-[10px]">Back + Logo combined</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-background rounded-lg border border-border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <button className="h-9 w-9 flex items-center justify-center">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <Logo size="md" />
                  </div>
                  <h1 className="text-sm font-semibold flex-1 text-center">Event Details</h1>
                  <div className="w-9" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* With Custom rightContent */}
          <Card className="trading-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Custom rightContent</CardTitle>
              <CardDescription className="text-[10px]">Using rightContent prop for custom buttons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-background rounded-lg border border-border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                  <Logo size="md" />
                  <h1 className="text-sm font-semibold flex-1 text-center">Settings</h1>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <CodePreview 
          code={`// Page type determines header configuration:

// 1. Functional Pages (BottomNav entries) - Never show back
<MobileHeader showLogo showBack={false} />

// 2. Trade Pages - No logo, show back, with stats
<MobileHeader 
  showLogo={false}
  title="Will BTC reach $100k?"
  showActions
  endTime={eventEndTime}
  currentPrice="$94,532"
/>

// 3. Detail Pages - Back + Logo together
<MobileHeader 
  showLogo
  title="Event Details"
  showActions
/>

// 4. Custom rightContent
<MobileHeader 
  title="Settings"
  rightContent={<Button variant="ghost">Save</Button>}
/>`}
          collapsible
          defaultExpanded={false}
        />
      </SectionWrapper>


      {/* =========================== */}
      {/* MOBILE HEADER PLAYGROUND    */}
      {/* =========================== */}
      <SectionWrapper
        id="mobile-header"
        title="Mobile Header Playground"
        platform="mobile"
        description="Interactive configuration for all header variants"
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

        {/* Expandable Row Pattern */}
        <Card className="trading-card mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Expandable Row Pattern</CardTitle>
            <CardDescription>
              Mobile-only pattern to prevent horizontal overflow by collapsing extra details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                On mobile, list items with additional metadata (status, network, tx hash) use a "tap to expand" pattern 
                to keep the default row compact. Desktop shows all details inline.
              </p>
              
              {/* Visual example */}
              <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                <div className="text-xs font-medium text-muted-foreground mb-2">Example: Transaction History</div>
                
                {/* Expandable row */}
                <div className="bg-card border border-border/50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-trading-green/20 flex items-center justify-center">
                        <span className="text-trading-green text-xs">↓</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">USDT Deposit</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 text-trading-yellow border-trading-yellow/30">
                            Processing
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">02/02/2026</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-trading-green font-mono">+$2,500.00</span>
                      <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-[-90deg]" />
                    </div>
                  </div>
                </div>
                
                {/* Non-expandable row */}
                <div className="bg-card border border-border/50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-trading-green/20 flex items-center justify-center">
                        <span className="text-trading-green text-xs">↗</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Trade Profit - Won</span>
                        <div className="text-xs text-muted-foreground">01/02/2026</div>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-trading-green font-mono">+$320.00</span>
                  </div>
                </div>
              </div>
              
              {/* Logic explanation */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-medium">Expand Logic</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-mono shrink-0">hasDetails =</span>
                    <span className="text-muted-foreground">txHash || (status !== 'completed') || network</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-mono shrink-0">showExpandable =</span>
                    <span className="text-muted-foreground">isMobile && hasDetails(tx)</span>
                  </div>
                </div>
                <div className="border-t border-border/50 pt-3 mt-3">
                  <p className="text-xs text-muted-foreground">
                    <strong>Shows chevron when:</strong> Mobile + has txHash, pending/processing status, or network info
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>No chevron when:</strong> Desktop (always inline) or row has no extra details
                  </p>
                </div>
              </div>
            </div>
            
            <CodePreview 
              code={`// Determine if row has expandable details
const hasDetails = (tx: Transaction) => {
  return tx.txHash || (tx.status && tx.status !== 'completed') || tx.network;
};

// Only show expand chevron on mobile with details
const showExpandable = isMobile && hasDetails(tx);

// Render
<div 
  className={cn(
    "p-4 transition-colors",
    showExpandable && "cursor-pointer hover:bg-muted/30"
  )}
  onClick={() => showExpandable && toggleExpand(tx.id)}
>
  {/* Main row content */}
  <div className="flex items-center justify-between">
    {/* ... */}
    {showExpandable && (
      <ChevronDown className={cn(
        "w-4 h-4 text-muted-foreground transition-transform",
        isExpanded && "rotate-180"
      )} />
    )}
  </div>
  
  {/* Mobile: Expandable details */}
  {isMobile && isExpanded && hasDetails(tx) && (
    <div className="mt-3 pt-3 border-t border-border/30">
      {/* Status, Network, TxHash */}
    </div>
  )}
  
  {/* Desktop: Always show details inline */}
  {!isMobile && hasDetails(tx) && (
    <div className="mt-2 text-xs text-muted-foreground">
      {/* Status, TxHash link */}
    </div>
  )}
</div>`}
              collapsible
              defaultExpanded={false}
            />
          </CardContent>
        </Card>
      </SectionWrapper>
    </div>
  );
};
