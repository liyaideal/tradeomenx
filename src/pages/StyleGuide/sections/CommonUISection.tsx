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
import { RotateCcw, Info, HelpCircle, Settings, Bell, User } from "lucide-react";
import { toast } from "sonner";
import { SectionWrapper } from "../components/SectionWrapper";
import { CodePreview } from "../components/CodePreview";

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

  // Dialog Playground
  const [dialogOpen, setDialogOpen] = useState(false);

  // Tooltip Playground
  const [tooltipSide, setTooltipSide] = useState<"top" | "right" | "bottom" | "left">("top");
  const [tooltipDelay, setTooltipDelay] = useState(200);

  // Popover Playground
  const [popoverSide, setPopoverSide] = useState<"top" | "right" | "bottom" | "left">("bottom");
  const [popoverAlign, setPopoverAlign] = useState<"start" | "center" | "end">("center");

  // Card Playground
  const [cardStyle, setCardStyle] = useState<"default" | "trading">("default");

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
            <Badge className="bg-trading-green/10 text-trading-green border-trading-green/20">+12.34%</Badge>
            <Badge className="bg-trading-red/10 text-trading-red border-trading-red/20">-5.67%</Badge>
            <Badge className="bg-trading-purple/10 text-trading-purple border-trading-purple/20">Active</Badge>
            <Badge className="bg-trading-yellow/10 text-trading-yellow border-trading-yellow/20">Pending</Badge>
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
            <CardDescription>Toggle between default and trading card styles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
              <div className="bg-muted/30 rounded-xl p-6 flex items-center justify-center min-h-[180px]">
                <Card className={cardStyle === "trading" ? "trading-card w-full max-w-[280px]" : "w-full max-w-[280px]"}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Sample Card</CardTitle>
                    <CardDescription className="text-xs">Card description text</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Card content goes here</p>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Card Style</Label>
                  <Select value={cardStyle} onValueChange={(v) => setCardStyle(v as typeof cardStyle)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="trading">Trading Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p><strong>Default:</strong> Standard shadcn/ui card with subtle border</p>
                  <p><strong>Trading:</strong> Enhanced card with gradient background and glow effects</p>
                </div>
              </div>
            </div>
            <CodePreview 
              code={cardStyle === "trading" 
                ? `<Card className="trading-card">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>`
                : `<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>`}
            />
          </CardContent>
        </Card>

        {/* Card Examples Side by Side */}
        <div className={`grid gap-6 mt-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Default Card</CardTitle>
              <CardDescription className="text-xs">Standard border styling</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Use for general content containers</p>
            </CardContent>
          </Card>
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-base">Trading Card</CardTitle>
              <CardDescription className="text-xs">Enhanced gradient styling</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Use for trading-specific content</p>
            </CardContent>
          </Card>
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
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tab1" className="w-full">
              <TabsList className="w-full">
                {Array.from({ length: tabsCount }).map((_, i) => (
                  <TabsTrigger key={i} value={`tab${i + 1}`} className="flex-1">
                    Tab {i + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
              {Array.from({ length: tabsCount }).map((_, i) => (
                <TabsContent key={i} value={`tab${i + 1}`} className="p-4 bg-muted/20 rounded-lg mt-2">
                  Content for Tab {i + 1}
                </TabsContent>
              ))}
            </Tabs>
            <div className="flex items-center gap-4 mt-4">
              <Label className="text-xs">Tab Count</Label>
              <Slider value={[tabsCount]} onValueChange={([v]) => setTabsCount(v)} min={2} max={5} className="w-32" />
              <span className="text-xs font-mono">{tabsCount}</span>
            </div>
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
          </CardHeader>
          <CardContent>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog Title</DialogTitle>
                  <DialogDescription>
                    This is a dialog description that explains what this dialog is for.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground">Dialog content goes here.</p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <CodePreview 
              code={`<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
            />
          </CardContent>
        </Card>
      </SectionWrapper>

      {/* Toast Notifications */}
      <SectionWrapper
        id="toasts"
        title="Toast Notifications"
        platform="shared"
        description="Non-blocking feedback messages using Sonner"
      >
        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="text-lg">Toast Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => toast.success("Success message!")}>
                Success Toast
              </Button>
              <Button variant="outline" onClick={() => toast.error("Error message!")}>
                Error Toast
              </Button>
              <Button variant="outline" onClick={() => toast.warning("Warning message!")}>
                Warning Toast
              </Button>
              <Button variant="outline" onClick={() => toast.info("Info message!")}>
                Info Toast
              </Button>
            </div>
            <CodePreview 
              code={`import { toast } from "sonner";

toast.success("Success!");
toast.error("Error!");
toast.warning("Warning!");
toast.info("Info!");`}
            />
          </CardContent>
        </Card>
      </SectionWrapper>
    </div>
  );
};