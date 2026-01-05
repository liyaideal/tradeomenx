import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OptionChips } from "@/components/OptionChips";
import { ArrowLeft, Copy, Check, TrendingUp, TrendingDown, AlertCircle, Bell, Settings, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const StyleGuide = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState("opt1");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(label);
    toast.success(`Copied: ${text}`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const colorSections = [
    {
      title: "Core Colors",
      colors: [
        { name: "Background", variable: "--background", class: "bg-background", value: "222 47% 6%" },
        { name: "Foreground", variable: "--foreground", class: "bg-foreground", value: "210 40% 98%" },
        { name: "Card", variable: "--card", class: "bg-card", value: "220 15% 13%" },
        { name: "Popover", variable: "--popover", class: "bg-popover", value: "222 47% 9%" },
        { name: "Muted", variable: "--muted", class: "bg-muted", value: "222 30% 18%" },
        { name: "Border", variable: "--border", class: "bg-border", value: "222 30% 18%" },
        { name: "Input", variable: "--input", class: "bg-input", value: "222 30% 15%" },
      ]
    },
    {
      title: "Brand Colors",
      colors: [
        { name: "Primary (Green)", variable: "--primary", class: "bg-primary", value: "142 71% 45%" },
        { name: "Secondary (Purple)", variable: "--secondary", class: "bg-secondary", value: "260 60% 55%" },
        { name: "Accent", variable: "--accent", class: "bg-accent", value: "260 60% 55%" },
        { name: "Destructive (Red)", variable: "--destructive", class: "bg-destructive", value: "0 72% 51%" },
      ]
    },
    {
      title: "Trading Colors",
      colors: [
        { name: "Trading Green", variable: "--trading-green", class: "bg-trading-green", value: "142 71% 45%" },
        { name: "Trading Green Muted", variable: "--trading-green-muted", class: "bg-trading-green-muted", value: "142 50% 25%" },
        { name: "Trading Red", variable: "--trading-red", class: "bg-trading-red", value: "0 72% 51%" },
        { name: "Trading Red Muted", variable: "--trading-red-muted", class: "bg-trading-red-muted", value: "0 50% 25%" },
        { name: "Trading Purple", variable: "--trading-purple", class: "bg-trading-purple", value: "260 60% 55%" },
        { name: "Trading Purple Muted", variable: "--trading-purple-muted", class: "bg-trading-purple-muted", value: "260 40% 35%" },
        { name: "Trading Yellow", variable: "--trading-yellow", class: "bg-trading-yellow", value: "45 93% 58%" },
      ]
    },
    {
      title: "Indicator",
      colors: [
        { name: "Indicator", variable: "--indicator", class: "bg-indicator", value: "45 93% 58%" },
        { name: "Indicator Muted", variable: "--indicator-muted", class: "bg-indicator-muted", value: "45 70% 35%" },
      ]
    },
  ];

  const mockOptions = [
    { id: "opt1", label: "Yes", price: "0.65" },
    { id: "opt2", label: "No", price: "0.35" },
    { id: "opt3", label: ">$100k", price: "0.42" },
  ];

  return (
    <div className={`min-h-screen bg-background ${isMobile ? "pb-20" : ""}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border ${isMobile ? "px-4 py-3" : "px-8 py-4"}`}>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className={`font-semibold ${isMobile ? "text-lg" : "text-2xl"}`}>Style Guide</h1>
            <p className="text-sm text-muted-foreground">Design System Documentation</p>
          </div>
        </div>
      </header>

      <main className={`${isMobile ? "px-4 py-6" : "px-8 py-8 max-w-7xl mx-auto"} space-y-12`}>
        {/* Typography Section */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">Typography</h2>
          <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-lg">Font Families</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Sans (Inter) - Primary</p>
                  <p className="text-2xl font-sans">The quick brown fox jumps</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Mono (JetBrains Mono) - Numbers/Prices</p>
                  <p className="text-2xl font-mono">$1,234.56 (+12.34%)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-lg">Type Scale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">text-xs (12px)</p>
                <p className="text-sm text-muted-foreground">text-sm (14px)</p>
                <p className="text-base">text-base (16px)</p>
                <p className="text-lg">text-lg (18px)</p>
                <p className="text-xl font-semibold">text-xl (20px)</p>
                <p className="text-2xl font-semibold">text-2xl (24px)</p>
                <p className="text-3xl font-bold">text-3xl (30px)</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Colors Section */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">Colors</h2>
          <div className="space-y-8">
            {colorSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">{section.title}</h3>
                <div className={`grid gap-3 ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}>
                  {section.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => copyToClipboard(color.variable, color.name)}
                      className="group relative text-left"
                    >
                      <div
                        className={`h-16 rounded-lg ${color.class} border border-border/50 mb-2 flex items-center justify-center transition-transform group-hover:scale-105`}
                      >
                        {copiedColor === color.name ? (
                          <Check className="h-5 w-5 text-foreground" />
                        ) : (
                          <Copy className="h-4 w-4 text-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                      <p className="text-xs font-medium truncate">{color.name}</p>
                      <p className="text-xs text-muted-foreground font-mono truncate">{color.variable}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trading Colors Demo */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">Trading Colors Usage</h2>
          <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
            <Card className="trading-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-trading-green" />
                <span className="font-medium">Profit / Long</span>
              </div>
              <p className="price-green text-2xl mb-2">+$1,234.56</p>
              <p className="text-trading-green text-sm">+12.34%</p>
              <div className="mt-3 h-2 bg-trading-green-muted rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-trading-green rounded-full" />
              </div>
            </Card>

            <Card className="trading-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="h-5 w-5 text-trading-red" />
                <span className="font-medium">Loss / Short</span>
              </div>
              <p className="price-red text-2xl mb-2">-$567.89</p>
              <p className="text-trading-red text-sm">-5.67%</p>
              <div className="mt-3 h-2 bg-trading-red-muted rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-trading-red rounded-full" />
              </div>
            </Card>

            <Card className="trading-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-trading-purple" />
                <span className="font-medium">Interactive / Selected</span>
              </div>
              <p className="text-trading-purple text-2xl font-mono mb-2">0.65</p>
              <p className="text-trading-purple text-sm">Selected Option</p>
              <div className="mt-3 h-2 bg-trading-purple-muted rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-trading-purple rounded-full" />
              </div>
            </Card>
          </div>
        </section>

        {/* Buttons Section */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">Buttons</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Standard Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><Settings className="h-4 w-4" /></Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Trading Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <button className="btn-trading-green">Buy / Long</button>
                <button className="btn-trading-red">Sell / Short</button>
                <Button className="bg-trading-purple hover:bg-trading-purple/90 text-foreground">
                  Place Order
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-4">States</h3>
              <div className="flex flex-wrap gap-3">
                <Button disabled>Disabled</Button>
                <Button className="animate-pulse-soft">Loading...</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Badges Section */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">Badges</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Standard Variants</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Trading Status Badges</h3>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-trading-green/20 text-trading-green border-trading-green/30">Filled</Badge>
                <Badge className="bg-trading-yellow/20 text-trading-yellow border-trading-yellow/30">Pending</Badge>
                <Badge className="bg-trading-purple/20 text-trading-purple border-trading-purple/30">Partial</Badge>
                <Badge className="bg-trading-red/20 text-trading-red border-trading-red/30">Cancelled</Badge>
                <Badge className="bg-muted text-muted-foreground">Expired</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">Cards</h2>
          <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
            <Card>
              <CardHeader>
                <CardTitle>Standard Card</CardTitle>
                <CardDescription>Default shadcn/ui card style</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Card content goes here with default styling.</p>
              </CardContent>
            </Card>

            <Card className="trading-card">
              <CardHeader>
                <CardTitle>Trading Card</CardTitle>
                <CardDescription>Custom gradient background</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Uses .trading-card class for gradient effect.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Form Elements */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">Form Elements</h2>
          <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-lg">Inputs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Default Input</label>
                  <Input placeholder="Enter amount..." />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">With Value</label>
                  <Input defaultValue="1,000.00" className="font-mono" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Disabled</label>
                  <Input disabled placeholder="Disabled input" />
                </div>
              </CardContent>
            </Card>

            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-lg">Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Switch Off</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Switch On</span>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Option Chips */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">Option Chips</h2>
          <Card className="trading-card p-4">
            <p className="text-sm text-muted-foreground mb-4">Interactive chips for option selection</p>
            <OptionChips
              options={mockOptions}
              selectedId={selectedOption}
              onSelect={setSelectedOption}
            />
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Selected: <span className="text-trading-purple font-mono">{selectedOption}</span>
              </p>
            </div>
          </Card>
        </section>

        {/* Tabs */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">Tabs</h2>
          <Card className="trading-card">
            <Tabs defaultValue="positions" className="w-full">
              <TabsList className="w-full bg-muted/30">
                <TabsTrigger value="positions" className="flex-1">Positions</TabsTrigger>
                <TabsTrigger value="orders" className="flex-1">Orders</TabsTrigger>
                <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
              </TabsList>
              <TabsContent value="positions" className="p-4">
                <p className="text-sm text-muted-foreground">Positions content area</p>
              </TabsContent>
              <TabsContent value="orders" className="p-4">
                <p className="text-sm text-muted-foreground">Orders content area</p>
              </TabsContent>
              <TabsContent value="history" className="p-4">
                <p className="text-sm text-muted-foreground">History content area</p>
              </TabsContent>
            </Tabs>
          </Card>
        </section>

        {/* Animations */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">Animations</h2>
          <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
            <Card className="trading-card p-4">
              <h3 className="text-sm font-medium mb-3">fade-in</h3>
              <div className="animate-fade-in bg-muted p-4 rounded-lg text-center">
                <p className="text-sm">Fades in with slight Y movement</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-mono">animate-fade-in</p>
            </Card>

            <Card className="trading-card p-4">
              <h3 className="text-sm font-medium mb-3">slide-up</h3>
              <div className="animate-slide-up bg-muted p-4 rounded-lg text-center">
                <p className="text-sm">Slides up into view</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-mono">animate-slide-up</p>
            </Card>

            <Card className="trading-card p-4">
              <h3 className="text-sm font-medium mb-3">pulse-soft</h3>
              <div className="animate-pulse-soft bg-trading-green p-4 rounded-lg text-center">
                <p className="text-sm text-primary-foreground">Soft pulsing effect</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-mono">animate-pulse-soft</p>
            </Card>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Flash Animations (Order Book)</h3>
            <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
              <div className="flash-update-green p-3 rounded-lg border border-border">
                <p className="text-sm font-mono">flash-update-green</p>
              </div>
              <div className="flash-update-red p-3 rounded-lg border border-border">
                <p className="text-sm font-mono">flash-update-red</p>
              </div>
              <div className="flash-new-trade p-3 rounded-lg border border-border">
                <p className="text-sm font-mono">flash-new-trade</p>
              </div>
            </div>
          </div>
        </section>

        {/* Spacing & Radius */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">Spacing & Border Radius</h2>
          <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-lg">Border Radius</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-trading-purple rounded-sm" />
                  <span className="text-sm font-mono">rounded-sm (8px)</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-trading-purple rounded-md" />
                  <span className="text-sm font-mono">rounded-md (10px)</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-trading-purple rounded-lg" />
                  <span className="text-sm font-mono">rounded-lg (12px)</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-trading-purple rounded-xl" />
                  <span className="text-sm font-mono">rounded-xl (16px)</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-trading-purple rounded-full" />
                  <span className="text-sm font-mono">rounded-full</span>
                </div>
              </CardContent>
            </Card>

            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-lg">Common Spacing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">Based on 4px grid system</p>
                {[1, 2, 3, 4, 6, 8].map((size) => (
                  <div key={size} className="flex items-center gap-4">
                    <div className={`bg-trading-purple h-4`} style={{ width: `${size * 4}px` }} />
                    <span className="text-sm font-mono">p-{size} ({size * 4}px)</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Icons */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">Icons</h2>
          <Card className="trading-card p-4">
            <p className="text-sm text-muted-foreground mb-4">Using Lucide React icons</p>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: TrendingUp, name: "TrendingUp", color: "text-trading-green" },
                { icon: TrendingDown, name: "TrendingDown", color: "text-trading-red" },
                { icon: AlertCircle, name: "AlertCircle", color: "text-trading-yellow" },
                { icon: Bell, name: "Bell", color: "text-trading-purple" },
                { icon: Settings, name: "Settings", color: "text-muted-foreground" },
                { icon: Zap, name: "Zap", color: "text-indicator" },
              ].map(({ icon: Icon, name, color }) => (
                <div key={name} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/30">
                  <Icon className={`h-6 w-6 ${color}`} />
                  <span className="text-xs text-muted-foreground">{name}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* CSS Custom Classes */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">Custom CSS Classes</h2>
          <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
            <Card className="trading-card p-4">
              <h3 className="text-sm font-medium mb-3">Price Classes</h3>
              <div className="space-y-2">
                <p className="price-green">price-green: $1,234.56</p>
                <p className="price-red">price-red: -$567.89</p>
              </div>
              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                <code className="text-xs text-muted-foreground">
                  .price-green, .price-red
                </code>
              </div>
            </Card>

            <Card className="trading-card p-4">
              <h3 className="text-sm font-medium mb-3">Option Chip Classes</h3>
              <div className="space-y-2">
                <div className="option-chip option-chip-active inline-block">Active Chip</div>
                <div className="option-chip option-chip-inactive inline-block ml-2">Inactive Chip</div>
              </div>
              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                <code className="text-xs text-muted-foreground">
                  .option-chip, .option-chip-active, .option-chip-inactive
                </code>
              </div>
            </Card>

            <Card className="trading-card p-4">
              <h3 className="text-sm font-medium mb-3">Tab Active Class</h3>
              <div className="flex gap-4 border-b border-border pb-2">
                <span className="tab-active pb-2">Active Tab</span>
                <span className="text-muted-foreground">Inactive Tab</span>
              </div>
              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                <code className="text-xs text-muted-foreground">.tab-active</code>
              </div>
            </Card>

            <Card className="trading-card p-4">
              <h3 className="text-sm font-medium mb-3">Scrollbar Hide</h3>
              <div className="overflow-x-auto scrollbar-hide flex gap-2 pb-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="flex-shrink-0 w-20 h-12 bg-muted rounded-lg flex items-center justify-center text-sm">
                    Item {i}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                <code className="text-xs text-muted-foreground">.scrollbar-hide</code>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StyleGuide;
