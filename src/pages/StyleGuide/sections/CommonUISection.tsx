import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RotateCcw, Info, HelpCircle, Settings, Bell, User, Monitor, Smartphone, Globe, ChevronDown, Share2, Trophy, Star, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { SectionWrapper, SubSection } from "../components/SectionWrapper";
import { CodePreview } from "../components/CodePreview";
import { TradingHeaderPlayground } from "../components/TradingHeaderPlayground";

interface CommonUISectionProps {
  isMobile: boolean;
}

export const CommonUISection = ({ isMobile }: CommonUISectionProps) => {
  // Button Playground
  const [buttonVariant, setButtonVariant] = useState<"default" | "secondary" | "destructive" | "outline" | "ghost" | "link">("default");
  const [buttonSize, setButtonSize] = useState<"default" | "sm" | "lg" | "icon">("default");
  const [buttonText, setButtonText] = useState("Click Me");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // Badge Playground
  const [badgeVariant, setBadgeVariant] = useState<"default" | "secondary" | "destructive" | "outline">("default");
  const [badgeText, setBadgeText] = useState("Badge");

  // Input Playground
  const [inputPlaceholder, setInputPlaceholder] = useState("Enter text...");
  const [inputDisabled, setInputDisabled] = useState(false);

  // Progress Playground
  const [progressValue, setProgressValue] = useState(65);

  // Switch Playground
  const [switchChecked, setSwitchChecked] = useState(false);

  // Slider Playground
  const [sliderValue, setSliderValue] = useState([50]);

  // Tabs Playground
  const [tabsCount, setTabsCount] = useState(3);
  const [tabsStyle, setTabsStyle] = useState<"default" | "fullWidth">("default");
  const [tabLabels, setTabLabels] = useState(["Overview", "Analytics", "Settings"]);

  // Dialog Playground
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSize, setDialogSize] = useState<"sm" | "md" | "lg" | "xl" | "full">("md");
  const [dialogShowFooter, setDialogShowFooter] = useState(true);
  const [dialogTitle, setDialogTitle] = useState("Dialog Title");
  const [dialogDescription, setDialogDescription] = useState("This is a dialog description that explains what this dialog is for.");

  // Tooltip Playground
  const [tooltipSide, setTooltipSide] = useState<"top" | "right" | "bottom" | "left">("top");
  const [tooltipDelay, setTooltipDelay] = useState(200);

  // Popover Playground
  const [popoverSide, setPopoverSide] = useState<"top" | "right" | "bottom" | "left">("bottom");
  const [popoverAlign, setPopoverAlign] = useState<"start" | "center" | "end">("center");

  // Card Playground
  const [cardStyle, setCardStyle] = useState<"default" | "trading" | "stats" | "web3" | "web3-intense">("default");

  const resetPlayground = () => {
    setButtonVariant("default");
    setButtonSize("default");
    setButtonText("Click Me");
    setButtonDisabled(false);
    setBadgeVariant("default");
    setBadgeText("Badge");
    setProgressValue(65);
    setSwitchChecked(false);
    setSliderValue([50]);
    setTooltipSide("top");
    setTooltipDelay(200);
    setPopoverSide("bottom");
    setPopoverAlign("center");
    setCardStyle("default");
    toast.success("Playground reset!");
  };

  return (
    <div className="space-y-12">
      {/* Buttons */}
      <SectionWrapper
        id="buttons"
        title="Buttons"
        platform="shared"
        description="Interactive button components with multiple variants and sizes"
      >
        <div className="flex items-center justify-end mb-4">
          <Button variant="ghost" size="sm" onClick={resetPlayground} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset All
          </Button>
        </div>

        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="text-lg">Button Playground</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
              {/* Preview */}
              <div className="bg-muted/30 rounded-xl p-8 flex items-center justify-center min-h-[150px]">
                <Button variant={buttonVariant} size={buttonSize} disabled={buttonDisabled}>
                  {buttonText}
                </Button>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Button Text</Label>
                  <Input value={buttonText} onChange={(e) => setButtonText(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Variant</Label>
                    <Select value={buttonVariant} onValueChange={(v) => setButtonVariant(v as typeof buttonVariant)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["default", "secondary", "destructive", "outline", "ghost", "link"].map(v => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Size</Label>
                    <Select value={buttonSize} onValueChange={(v) => setButtonSize(v as typeof buttonSize)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["default", "sm", "lg", "icon"].map(v => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Disabled</Label>
                  <Switch checked={buttonDisabled} onCheckedChange={setButtonDisabled} />
                </div>
              </div>
            </div>
            <CodePreview code={`<Button variant="${buttonVariant}" size="${buttonSize}"${buttonDisabled ? " disabled" : ""}>${buttonText}</Button>`} />
          </CardContent>
        </Card>

        {/* Quick Reference */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </SectionWrapper>

      {/* Badges */}
      <SectionWrapper
        id="badges"
        title="Badges"
        platform="shared"
        description="Status indicators and labels"
      >
        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="text-lg">Badge Playground</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
              <div className="bg-muted/30 rounded-xl p-8 flex items-center justify-center min-h-[100px]">
                <Badge variant={badgeVariant}>{badgeText}</Badge>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Badge Text</Label>
                  <Input value={badgeText} onChange={(e) => setBadgeText(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Variant</Label>
                  <Select value={badgeVariant} onValueChange={(v) => setBadgeVariant(v as typeof badgeVariant)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["default", "secondary", "destructive", "outline"].map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <CodePreview code={`<Badge variant="${badgeVariant}">${badgeText}</Badge>`} />
          </CardContent>
        </Card>

        {/* Trading Badges */}
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Trading Status Badges</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">+12.34%</Badge>
            <Badge variant="error">-5.67%</Badge>
            <Badge variant="info">Active</Badge>
            <Badge variant="warning">Pending</Badge>
          </div>
        </div>
      </SectionWrapper>

      {/* Tooltip */}
      <SectionWrapper
        id="tooltip"
        title="Tooltip"
        platform="shared"
        description="Contextual information on hover"
      >
        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="text-lg">Tooltip Playground</CardTitle>
            <CardDescription>Hover over the icon to see the tooltip</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
              <div className="bg-muted/30 rounded-xl p-8 flex items-center justify-center min-h-[150px]">
                <TooltipProvider delayDuration={tooltipDelay}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side={tooltipSide}>
                      <p>This is a helpful tooltip!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Side</Label>
                  <Select value={tooltipSide} onValueChange={(v) => setTooltipSide(v as typeof tooltipSide)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["top", "right", "bottom", "left"].map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Delay Duration (ms)</Label>
                  <div className="flex items-center gap-4">
                    <Slider 
                      value={[tooltipDelay]} 
                      onValueChange={([v]) => setTooltipDelay(v)} 
                      min={0} 
                      max={1000} 
                      step={50}
                      className="flex-1"
                    />
                    <span className="text-xs font-mono w-12">{tooltipDelay}ms</span>
                  </div>
                </div>
              </div>
            </div>
            <CodePreview 
              code={`<TooltipProvider delayDuration={${tooltipDelay}}>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline" size="icon">
        <HelpCircle className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent side="${tooltipSide}">
      <p>This is a helpful tooltip!</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>`}
            />
          </CardContent>
        </Card>

        {/* Tooltip Examples */}
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Common Tooltip Patterns</h4>
          <div className="flex flex-wrap gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <Info className="h-3.5 w-3.5" />
                    Info Icon
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Additional information here</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Bell className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </SectionWrapper>

      {/* Popover */}
      <SectionWrapper
        id="popover"
        title="Popover"
        platform="shared"
        description="Rich content overlay triggered by click"
      >
        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="text-lg">Popover Playground</CardTitle>
            <CardDescription>Click the button to open the popover</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
              <div className="bg-muted/30 rounded-xl p-8 flex items-center justify-center min-h-[150px]">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Open Popover</Button>
                  </PopoverTrigger>
                  <PopoverContent side={popoverSide} align={popoverAlign} className="w-72">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Popover Title</h4>
                      <p className="text-xs text-muted-foreground">
                        This is a popover with rich content. You can put forms, lists, or any other content here.
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Cancel</Button>
                        <Button size="sm">Confirm</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Side</Label>
                    <Select value={popoverSide} onValueChange={(v) => setPopoverSide(v as typeof popoverSide)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["top", "right", "bottom", "left"].map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Align</Label>
                    <Select value={popoverAlign} onValueChange={(v) => setPopoverAlign(v as typeof popoverAlign)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["start", "center", "end"].map(a => (
                          <SelectItem key={a} value={a}>{a}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <CodePreview 
              code={`<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent side="${popoverSide}" align="${popoverAlign}">
    <div className="space-y-3">
      <h4 className="font-medium">Title</h4>
      <p className="text-sm text-muted-foreground">Content...</p>
    </div>
  </PopoverContent>
</Popover>`}
            />
          </CardContent>
        </Card>
      </SectionWrapper>

      {/* Card Styles */}
      <SectionWrapper
        id="cards"
        title="Card Styles"
        platform="shared"
        description="Container components with different visual treatments"
      >
        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="text-lg">Card Playground</CardTitle>
            <CardDescription>Toggle between different card styles to see visual differences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
              <div className="bg-muted/30 rounded-xl p-8 flex items-center justify-center min-h-[220px]">
                {cardStyle === "web3" || cardStyle === "web3-intense" ? (
                  <div className={`${cardStyle === "web3-intense" ? "web3-card web3-card-intense" : "web3-card"} w-full max-w-[280px] p-4`}>
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold">Sample Card</h3>
                      <p className="text-xs text-muted-foreground">Card description text</p>
                      <p className="text-sm text-muted-foreground pt-2">Card content goes here</p>
                    </div>
                  </div>
                ) : (
                  <Card className={`w-full max-w-[280px] ${
                    cardStyle === "trading" ? "trading-card" : 
                    cardStyle === "stats" ? "stats-card" : ""
                  }`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Sample Card</CardTitle>
                      <CardDescription className="text-xs">Card description text</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Card content goes here</p>
                    </CardContent>
                  </Card>
                )}
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Card Style</Label>
                  <Select value={cardStyle} onValueChange={(v) => setCardStyle(v as typeof cardStyle)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="trading">Trading Card</SelectItem>
                      <SelectItem value="stats">Stats Card</SelectItem>
                      <SelectItem value="web3">Web3 Card</SelectItem>
                      <SelectItem value="web3-intense">Web3 Intense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-xs text-muted-foreground space-y-2 bg-muted/30 rounded-lg p-3">
                  <p className={cardStyle === "default" ? "text-foreground font-medium" : ""}>
                    <strong>Default:</strong> Standard shadcn/ui card with solid border
                  </p>
                  <p className={cardStyle === "trading" ? "text-foreground font-medium" : ""}>
                    <strong>Trading:</strong> Gradient background with hover transition
                  </p>
                  <p className={cardStyle === "stats" ? "text-foreground font-medium" : ""}>
                    <strong>Stats:</strong> Subtle gradient for dashboard metrics
                  </p>
                  <p className={cardStyle === "web3" ? "text-foreground font-medium" : ""}>
                    <strong>Web3:</strong> Animated gradient border with outer glow
                  </p>
                  <p className={cardStyle === "web3-intense" ? "text-foreground font-medium" : ""}>
                    <strong>Web3 Intense:</strong> High-contrast animated border effect
                  </p>
                </div>
              </div>
            </div>
            <CodePreview 
              code={
                cardStyle === "trading" 
                  ? `<Card className="trading-card">...</Card>`
                  : cardStyle === "stats"
                  ? `<Card className="stats-card">...</Card>`
                  : cardStyle === "web3"
                  ? `<div className="web3-card p-4">...</div>`
                  : cardStyle === "web3-intense"
                  ? `<div className="web3-card web3-card-intense p-4">...</div>`
                  : `<Card>...</Card>`
              }
            />
          </CardContent>
        </Card>

        {/* Card Examples - All Variants */}
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-4">All Card Variants</h4>
          <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"}`}>
            {/* Default Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Default Card</CardTitle>
                <CardDescription className="text-xs">Standard solid border</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">General content containers</p>
              </CardContent>
            </Card>
            
            {/* Trading Card */}
            <Card className="trading-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Trading Card</CardTitle>
                <CardDescription className="text-xs">Gradient background</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Trading UI elements</p>
              </CardContent>
            </Card>
            
            {/* Stats Card */}
            <Card className="stats-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Stats Card</CardTitle>
                <CardDescription className="text-xs">Dashboard metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">KPIs and statistics</p>
              </CardContent>
            </Card>
            
            {/* Web3 Card */}
            <div className="web3-card p-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold">Web3 Card</h3>
                <p className="text-xs text-muted-foreground">Animated gradient border</p>
                <p className="text-xs text-muted-foreground pt-2">Premium features & NFTs</p>
              </div>
            </div>
            
            {/* Web3 Intense Card */}
            <div className="web3-card web3-card-intense p-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold">Web3 Intense</h3>
                <p className="text-xs text-muted-foreground">High-contrast animated border</p>
                <p className="text-xs text-muted-foreground pt-2">Featured & hero sections</p>
              </div>
            </div>
            
            {/* Glow Card Example */}
            <Card className="trading-card glow-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Glow Effect</CardTitle>
                <CardDescription className="text-xs">Add .glow-primary class</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Highlight important content</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CSS Classes Reference */}
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">CSS Classes</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Class</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Effect</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Use Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <tr><td className="py-2 font-mono">.trading-card</td><td className="py-2">Gradient BG, hover transition</td><td className="py-2 text-muted-foreground">Trading panels</td></tr>
                <tr><td className="py-2 font-mono">.stats-card</td><td className="py-2">Subtle gradient, primary hover</td><td className="py-2 text-muted-foreground">Dashboard stats</td></tr>
                <tr><td className="py-2 font-mono">.web3-card</td><td className="py-2">Animated gradient border + glow</td><td className="py-2 text-muted-foreground">Premium features</td></tr>
                <tr><td className="py-2 font-mono">.web3-card-intense</td><td className="py-2">Stronger gradient animation</td><td className="py-2 text-muted-foreground">Hero sections</td></tr>
                <tr><td className="py-2 font-mono">.glow-primary</td><td className="py-2">Purple shadow glow</td><td className="py-2 text-muted-foreground">Highlights</td></tr>
                <tr><td className="py-2 font-mono">.glow-green</td><td className="py-2">Green shadow glow</td><td className="py-2 text-muted-foreground">Success states</td></tr>
                <tr><td className="py-2 font-mono">.glow-red</td><td className="py-2">Red shadow glow</td><td className="py-2 text-muted-foreground">Warning states</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </SectionWrapper>

      {/* Form Elements */}
      <SectionWrapper
        id="form-elements"
        title="Form Elements"
        platform="shared"
        description="Input, switch, slider, and other form controls"
      >
        <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
          {/* Input */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder={inputPlaceholder} disabled={inputDisabled} />
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Placeholder</Label>
                  <Input value={inputPlaceholder} onChange={(e) => setInputPlaceholder(e.target.value)} className="text-sm" />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Disabled</Label>
                  <Switch checked={inputDisabled} onCheckedChange={setInputDisabled} />
                </div>
              </div>
              <CodePreview code={`<Input placeholder="${inputPlaceholder}"${inputDisabled ? " disabled" : ""} />`} />
            </CardContent>
          </Card>

          {/* Switch */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Switch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/30 rounded-xl p-6 flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <Switch checked={switchChecked} onCheckedChange={setSwitchChecked} />
                  <Label>{switchChecked ? "Enabled" : "Disabled"}</Label>
                </div>
              </div>
              <CodePreview code={`<Switch checked={${switchChecked}} onCheckedChange={setChecked} />`} />
            </CardContent>
          </Card>

          {/* Slider */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Slider</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span className="font-mono text-foreground">{sliderValue[0]}</span>
                  <span>100</span>
                </div>
                <Slider value={sliderValue} onValueChange={setSliderValue} max={100} step={1} />
              </div>
              <CodePreview code={`<Slider value={[${sliderValue[0]}]} onValueChange={setValue} max={100} />`} />
            </CardContent>
          </Card>

          {/* Progress */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-mono">{progressValue}%</span>
                </div>
                <Progress value={progressValue} className="h-2" />
                <Slider value={[progressValue]} onValueChange={([v]) => setProgressValue(v)} max={100} />
              </div>
              <CodePreview code={`<Progress value={${progressValue}} />`} />
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>

      {/* Tabs */}
      <SectionWrapper
        id="tabs"
        title="Tabs"
        platform="shared"
        description="Navigation between related content"
      >
        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="text-lg">Tabs Playground</CardTitle>
            <CardDescription>Configure tab count, style, and labels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
              {/* Preview */}
              <div className="bg-muted/30 rounded-xl p-4">
                <Tabs defaultValue="tab0" className="w-full">
                  <TabsList className={tabsStyle === "fullWidth" ? "w-full" : ""}>
                    {Array.from({ length: tabsCount }).map((_, i) => (
                      <TabsTrigger 
                        key={i} 
                        value={`tab${i}`} 
                        className={tabsStyle === "fullWidth" ? "flex-1" : ""}
                      >
                        {tabLabels[i] || `Tab ${i + 1}`}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {Array.from({ length: tabsCount }).map((_, i) => (
                    <TabsContent key={i} value={`tab${i}`} className="p-4 bg-background/50 rounded-lg mt-2">
                      Content for {tabLabels[i] || `Tab ${i + 1}`}
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Tab Count</Label>
                    <div className="flex items-center gap-2">
                      <Slider 
                        value={[tabsCount]} 
                        onValueChange={([v]) => {
                          setTabsCount(v);
                          if (tabLabels.length < v) {
                            setTabLabels([...tabLabels, ...Array(v - tabLabels.length).fill("")]);
                          }
                        }} 
                        min={2} 
                        max={5} 
                        className="flex-1" 
                      />
                      <span className="text-xs font-mono w-4">{tabsCount}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Style</Label>
                    <Select value={tabsStyle} onValueChange={(v) => setTabsStyle(v as typeof tabsStyle)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default (Inline)</SelectItem>
                        <SelectItem value="fullWidth">Full Width</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Tab Labels</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: tabsCount }).map((_, i) => (
                      <Input 
                        key={i}
                        placeholder={`Tab ${i + 1}`}
                        value={tabLabels[i] || ""}
                        onChange={(e) => {
                          const newLabels = [...tabLabels];
                          newLabels[i] = e.target.value;
                          setTabLabels(newLabels);
                        }}
                        className="text-xs"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <CodePreview 
              code={`<Tabs defaultValue="tab0">
  <TabsList${tabsStyle === "fullWidth" ? ' className="w-full"' : ""}>
${Array.from({ length: tabsCount }).map((_, i) => `    <TabsTrigger value="tab${i}"${tabsStyle === "fullWidth" ? ' className="flex-1"' : ""}>${tabLabels[i] || `Tab ${i + 1}`}</TabsTrigger>`).join("\n")}
  </TabsList>
${Array.from({ length: tabsCount }).map((_, i) => `  <TabsContent value="tab${i}">Content</TabsContent>`).join("\n")}
</Tabs>`}
            />
          </CardContent>
        </Card>
      </SectionWrapper>

      {/* Dialog */}
      <SectionWrapper
        id="dialog"
        title="Dialog / Modal"
        platform="shared"
        description="Overlay dialogs for focused interactions"
      >
        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="text-lg">Dialog Playground</CardTitle>
            <CardDescription>Configure size, content, and footer visibility</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
              {/* Trigger */}
              <div className="bg-muted/30 rounded-xl p-8 flex items-center justify-center">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent className={
                    dialogSize === "sm" ? "max-w-sm" :
                    dialogSize === "md" ? "max-w-lg" :
                    dialogSize === "lg" ? "max-w-2xl" :
                    dialogSize === "xl" ? "max-w-4xl" :
                    "max-w-[95vw] w-full h-[90vh]"
                  }>
                    <DialogHeader>
                      <DialogTitle>{dialogTitle}</DialogTitle>
                      <DialogDescription>{dialogDescription}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground">
                        Dialog content goes here. Current size: <code className="text-xs bg-muted px-1 rounded">{dialogSize}</code>
                      </p>
                    </div>
                    {dialogShowFooter && (
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={() => { setDialogOpen(false); toast.success("Confirmed!"); }}>Confirm</Button>
                      </DialogFooter>
                    )}
                  </DialogContent>
                </Dialog>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Size</Label>
                  <Select value={dialogSize} onValueChange={(v) => setDialogSize(v as typeof dialogSize)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sm">Small (max-w-sm)</SelectItem>
                      <SelectItem value="md">Medium (max-w-lg)</SelectItem>
                      <SelectItem value="lg">Large (max-w-2xl)</SelectItem>
                      <SelectItem value="xl">Extra Large (max-w-4xl)</SelectItem>
                      <SelectItem value="full">Full Screen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Title</Label>
                  <Input value={dialogTitle} onChange={(e) => setDialogTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Description</Label>
                  <Input value={dialogDescription} onChange={(e) => setDialogDescription(e.target.value)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Show Footer</Label>
                  <Switch checked={dialogShowFooter} onCheckedChange={setDialogShowFooter} />
                </div>
              </div>
            </div>
            <CodePreview 
              code={`<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="${
    dialogSize === "sm" ? "max-w-sm" :
    dialogSize === "md" ? "max-w-lg" :
    dialogSize === "lg" ? "max-w-2xl" :
    dialogSize === "xl" ? "max-w-4xl" :
    "max-w-[95vw] w-full h-[90vh]"
  }">
    <DialogHeader>
      <DialogTitle>${dialogTitle}</DialogTitle>
      <DialogDescription>${dialogDescription}</DialogDescription>
    </DialogHeader>
    {/* Content */}${dialogShowFooter ? `
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>` : ""}
  </DialogContent>
</Dialog>`}
            />
          </CardContent>
        </Card>

        {/* Size Reference */}
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Size Reference</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Size</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Class</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Use Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <tr><td className="py-2 font-mono">sm</td><td className="py-2">max-w-sm</td><td className="py-2 text-muted-foreground">Confirmations, alerts</td></tr>
                <tr><td className="py-2 font-mono">md</td><td className="py-2">max-w-lg</td><td className="py-2 text-muted-foreground">Forms, settings (default)</td></tr>
                <tr><td className="py-2 font-mono">lg</td><td className="py-2">max-w-2xl</td><td className="py-2 text-muted-foreground">Complex forms, previews</td></tr>
                <tr><td className="py-2 font-mono">xl</td><td className="py-2">max-w-4xl</td><td className="py-2 text-muted-foreground">Data tables, large content</td></tr>
                <tr><td className="py-2 font-mono">full</td><td className="py-2">max-w-[95vw]</td><td className="py-2 text-muted-foreground">Full-screen experiences</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </SectionWrapper>

      {/* Toast Notifications */}
      <SectionWrapper
        id="toasts"
        title="Toast Notifications"
        platform="shared"
        description="Non-blocking feedback messages using Sonner"
      >
        <div className="space-y-6">
          {/* Basic Toasts */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Basic Toast Types</CardTitle>
              <CardDescription>Standard notification styles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" onClick={() => toast.success("Operation completed successfully!")}>
                  Success
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.error("Something went wrong!")}>
                  Error
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.warning("Please review your input")}>
                  Warning
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.info("Here's some useful information")}>
                  Info
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast("Default notification message")}>
                  Default
                </Button>
              </div>
              <CodePreview 
                code={`import { toast } from "sonner";

toast.success("Success!");
toast.error("Error!");
toast.warning("Warning!");
toast.info("Info!");
toast("Default message");`}
              />
            </CardContent>
          </Card>

          {/* Advanced Toasts */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Advanced Toast Patterns</CardTitle>
              <CardDescription>Loading, promise, actions, and custom content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    const toastId = toast.loading("Loading...");
                    setTimeout(() => {
                      toast.success("Loaded!", { id: toastId });
                    }, 2000);
                  }}
                >
                  Loading → Success
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    toast.promise(
                      new Promise((resolve) => setTimeout(resolve, 2000)),
                      {
                        loading: "Saving changes...",
                        success: "Changes saved!",
                        error: "Failed to save",
                      }
                    );
                  }}
                >
                  Promise Toast
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    toast("Event deleted", {
                      action: {
                        label: "Undo",
                        onClick: () => toast.success("Restored!"),
                      },
                    });
                  }}
                >
                  With Action
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    toast("Order placed", {
                      description: "BTC/USDT • Long • 0.5 BTC @ $42,350",
                      duration: 5000,
                    });
                  }}
                >
                  With Description
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => toast.dismiss()}
                >
                  Dismiss All
                </Button>
              </div>
              <CodePreview 
                code={`// Loading toast that updates
const toastId = toast.loading("Loading...");
// Later...
toast.success("Done!", { id: toastId });

// Promise-based toast
toast.promise(fetchData(), {
  loading: "Loading...",
  success: "Data loaded!",
  error: "Failed to load",
});

// Toast with action button
toast("Item deleted", {
  action: {
    label: "Undo",
    onClick: () => restoreItem(),
  },
});

// Toast with description
toast("Order placed", {
  description: "BTC/USDT • Long • 0.5 BTC",
  duration: 5000,
});

// Dismiss all toasts
toast.dismiss();`}
              />
            </CardContent>
          </Card>

          {/* Trading-specific Toasts */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Trading Toast Patterns</CardTitle>
              <CardDescription>Common trading notification examples</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-trading-green/30 text-trading-green hover:bg-trading-green/10"
                  onClick={() => toast.success("Order Filled", { description: "Long 0.5 BTC @ $42,350.00" })}
                >
                  Order Filled
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-trading-red/30 text-trading-red hover:bg-trading-red/10"
                  onClick={() => toast.error("Order Rejected", { description: "Insufficient margin" })}
                >
                  Order Rejected
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-trading-yellow/30 text-trading-yellow hover:bg-trading-yellow/10"
                  onClick={() => toast.warning("Price Alert", { description: "BTC reached $45,000" })}
                >
                  Price Alert
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.info("Position Closed", { description: "Realized PnL: +$125.50 (+2.3%)" })}
                >
                  Position Closed
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>

      {/* Toast & Notifications */}
      <SectionWrapper
        id="toast-notifications"
        title="Toast & Notifications"
        platform="shared"
        description="Non-blocking notifications using Sonner library"
      >
        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="text-lg">Toast Types</CardTitle>
            <CardDescription>Click buttons to trigger different toast notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
              {/* Toast Triggers */}
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3"
                  onClick={() => toast.success("Operation completed successfully")}
                >
                  <span className="w-3 h-3 rounded-full bg-trading-green" />
                  Success Toast
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3"
                  onClick={() => toast.error("Something went wrong")}
                >
                  <span className="w-3 h-3 rounded-full bg-trading-red" />
                  Error Toast
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3"
                  onClick={() => toast.warning("Please review your input")}
                >
                  <span className="w-3 h-3 rounded-full bg-trading-yellow" />
                  Warning Toast
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3"
                  onClick={() => toast.info("Here's some information")}
                >
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  Info Toast
                </Button>
              </div>

              {/* Code Example */}
              <div className="bg-muted/30 rounded-xl p-4">
                <p className="text-sm font-medium mb-3">Usage</p>
                <code className="text-xs text-muted-foreground block whitespace-pre-wrap font-mono">
{`import { toast } from "sonner";

// Success - 操作成功
toast.success("Saved successfully");

// Error - 操作失败
toast.error("Failed to save");

// Warning - 警告提示
toast.warning("Check your input");

// Info - 一般信息
toast.info("New update available");`}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Toast with Actions */}
        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="text-lg">Toast with Actions</CardTitle>
            <CardDescription>Advanced toast patterns with actions and promise states</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => toast("Item deleted", {
                    action: {
                      label: "Undo",
                      onClick: () => toast.success("Restored!")
                    }
                  })}
                >
                  Toast with Undo Action
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => toast.promise(
                    new Promise((resolve) => setTimeout(resolve, 2000)),
                    {
                      loading: "Loading...",
                      success: "Data loaded!",
                      error: "Failed to load"
                    }
                  )}
                >
                  Promise Toast (Loading State)
                </Button>
              </div>
              <div className="bg-muted/30 rounded-xl p-4">
                <p className="text-sm font-medium mb-3">With Action</p>
                <code className="text-xs text-muted-foreground block whitespace-pre-wrap font-mono">
{`// With action button
toast("Item deleted", {
  action: {
    label: "Undo",
    onClick: () => restore()
  }
});

// Promise pattern
toast.promise(asyncFn(), {
  loading: "Loading...",
  success: "Done!",
  error: "Failed"
});`}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Guidelines */}
        <SubSection title="Usage Guidelines" description="When to use toasts vs other feedback patterns">
          <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
            <div className="bg-trading-green/10 border border-trading-green/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-trading-green" />
                <p className="text-sm font-medium text-trading-green">When to Use Toast</p>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Operation success feedback (save, delete, update)</li>
                <li>Non-blocking error notifications</li>
                <li>Brief status updates</li>
                <li>Confirmations for undoable actions</li>
              </ul>
            </div>
            <div className="bg-trading-red/10 border border-trading-red/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="h-4 w-4 text-trading-red" />
                <p className="text-sm font-medium text-trading-red">When NOT to Use Toast</p>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Critical confirmations requiring user action (use Dialog)</li>
                <li>Form validation errors (use inline errors)</li>
                <li>Persistent information (use Alert component)</li>
                <li>Complex multi-step feedback</li>
              </ul>
            </div>
          </div>

          <div className="bg-muted/30 rounded-xl p-4 mt-4">
            <p className="text-sm font-medium mb-2">Message Guidelines</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Keep messages short and clear (one line max)</li>
              <li>• Start with action verbs describing the result</li>
              <li>• Success examples: "Saved", "Updated", "Deleted"</li>
              <li>• Error examples: "Failed to save", "Unable to connect"</li>
            </ul>
          </div>
        </SubSection>
      </SectionWrapper>

      {/* Desktop Navigation Specification */}
      <DesktopNavigationSection isMobile={isMobile} />
    </div>
  );
};

// Desktop Navigation Section Component
const DesktopNavigationSection = ({ isMobile }: { isMobile: boolean }) => {
  const [desktopPreset, setDesktopPreset] = useState<"home" | "trade" | "detail">("home");

  return (
    <SectionWrapper
      id="desktop-nav-specs"
      title="Desktop Header Specification"
      platform="desktop"
      description="Layout and component rules for desktop headers across different page types"
    >
      {/* Preset Switcher */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-muted-foreground">Page Type:</span>
        <div className="flex gap-2">
          <Badge 
            variant={desktopPreset === "home" ? "default" : "outline"} 
            className="cursor-pointer hover:bg-primary/80"
            onClick={() => setDesktopPreset("home")}
          >
            Home / Events Page
          </Badge>
          <Badge 
            variant={desktopPreset === "trade" ? "default" : "outline"} 
            className="cursor-pointer hover:bg-primary/80"
            onClick={() => setDesktopPreset("trade")}
          >
            Trade Page
          </Badge>
          <Badge 
            variant={desktopPreset === "detail" ? "default" : "outline"} 
            className="cursor-pointer hover:bg-primary/80"
            onClick={() => setDesktopPreset("detail")}
          >
            Resolved Detail
          </Badge>
        </div>
      </div>

      {/* HOME / EVENTS PAGE HEADER */}
      {desktopPreset === "home" && (
        <Card className="trading-card mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              EventsDesktopHeader
            </CardTitle>
            <CardDescription>
              Primary navigation header used on Events, Portfolio, Leaderboard, and other main pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Visual Preview */}
            <div className="bg-background rounded-lg border border-border overflow-hidden mb-6">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              
              <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-8">
                  <Logo size="xl" />
                  <nav className="flex items-center gap-1">
                    {["Events", "Resolved", "Portfolio"].map((tab, i) => (
                      <button
                        key={tab}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          i === 0
                            ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(260_60%_55%/0.3)]"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 border border-primary/30 ml-1">
                      <Trophy className="w-4 h-4" />
                      Leaderboard
                    </button>
                  </nav>
                </div>

                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 bg-muted/30">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">EN</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30 border border-border/50 hover:border-trading-green/30">
                    <span className="text-sm text-muted-foreground">Balance:</span>
                    <span className="text-sm font-bold text-trading-green font-mono">$10,000.00</span>
                  </button>
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-muted/50">
                    <div className="w-9 h-9 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center">
                      <span className="text-sm text-primary font-medium">U</span>
                    </div>
                    <span className="text-sm font-medium">Username</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            {/* Component Specifications */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Component</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Spec</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr>
                    <td className="py-2 font-medium flex items-center gap-2"><Logo size="sm" /> Logo</td>
                    <td className="py-2 font-mono text-primary">size="xl" (h-8)</td>
                    <td className="py-2 text-muted-foreground">Left-aligned, clickable</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Nav Tabs</td>
                    <td className="py-2 font-mono">px-4 py-2 rounded-lg text-sm</td>
                    <td className="py-2 text-muted-foreground">Active: bg-primary + shadow glow</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Leaderboard</td>
                    <td className="py-2 font-mono">border border-primary/30</td>
                    <td className="py-2 text-muted-foreground">Featured style with Trophy icon</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Balance Display</td>
                    <td className="py-2 font-mono">font-mono text-trading-green</td>
                    <td className="py-2 text-muted-foreground">Clickable → /wallet</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Profile Avatar</td>
                    <td className="py-2 font-mono">h-9 w-9 border-2 border-primary/50</td>
                    <td className="py-2 text-muted-foreground">Dropdown: Portfolio, Settings, Sign Out</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <CodePreview 
              code={`import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";

<EventsDesktopHeader />

// With custom right content slot
<EventsDesktopHeader rightContent={<CustomButton />} />`}
              collapsible
              defaultExpanded={false}
            />
          </CardContent>
        </Card>
      )}

      {/* TRADE PAGE HEADER - Interactive Playground */}
      {desktopPreset === "trade" && <TradingHeaderPlayground />}

      {/* RESOLVED DETAIL PAGE HEADER */}
      {desktopPreset === "detail" && (
        <Card className="trading-card mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Detail Page Header
            </CardTitle>
            <CardDescription>
              Header for resolved event details, settlement pages - uses EventsDesktopHeader with rightContent
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Visual Preview */}
            <div className="bg-background rounded-lg border border-border overflow-hidden mb-6">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              
              <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-8">
                  <Logo size="xl" />
                  <nav className="flex items-center gap-1">
                    {["Events", "Resolved", "Portfolio"].map((tab, i) => (
                      <button
                        key={tab}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          i === 1
                            ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(260_60%_55%/0.3)]"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 border border-primary/30 ml-1">
                      <Trophy className="w-4 h-4" />
                      Leaderboard
                    </button>
                  </nav>
                </div>

                <div className="flex items-center gap-4">
                  {/* Right Content Slot - Share Button */}
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Share2 className="h-3.5 w-3.5" />
                    Share
                  </Button>
                  
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 bg-muted/30">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">EN</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30 border border-border/50">
                    <span className="text-sm text-muted-foreground">Balance:</span>
                    <span className="text-sm font-bold text-trading-green font-mono">$10,000.00</span>
                  </button>
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-muted/50">
                    <div className="w-9 h-9 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center">
                      <span className="text-sm text-primary font-medium">U</span>
                    </div>
                    <span className="text-sm font-medium">Username</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Detail pages use <code className="text-primary">EventsDesktopHeader</code> with the <code className="text-primary">rightContent</code> prop
              to add contextual actions like Share buttons.
            </p>

            <CodePreview 
              code={`import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";

// Resolved event detail page
<EventsDesktopHeader 
  rightContent={
    <Button variant="outline" size="sm" className="gap-1.5">
      <Share2 className="h-3.5 w-3.5" />
      Share
    </Button>
  }
/>`}
              collapsible
              defaultExpanded={false}
            />
          </CardContent>
        </Card>
      )}

      {/* Mobile vs Desktop Comparison */}
      <Card className="trading-card">
        <CardHeader>
          <CardTitle className="text-lg">Header Component Usage by Page</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Page</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Mobile</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Desktop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <tr>
                  <td className="py-2 font-medium">Home / Events</td>
                  <td className="py-2">MobileHeader + BottomNav</td>
                  <td className="py-2">EventsDesktopHeader</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Trade</td>
                  <td className="py-2">MobileHeader (event title)</td>
                  <td className="py-2">Embedded trading header</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Resolved Detail</td>
                  <td className="py-2">MobileHeader + back</td>
                  <td className="py-2">EventsDesktopHeader + rightContent</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Portfolio</td>
                  <td className="py-2">MobileHeader + BottomNav</td>
                  <td className="py-2">EventsDesktopHeader</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Wallet</td>
                  <td className="py-2">MobileHeader + back</td>
                  <td className="py-2">EventsDesktopHeader</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </SectionWrapper>
  );
};