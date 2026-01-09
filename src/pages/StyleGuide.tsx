import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { OptionChips } from "@/components/OptionChips";
import { ArrowLeft, Copy, Check, TrendingUp, TrendingDown, AlertCircle, Bell, Settings, Zap, Play, RotateCcw, Info, HelpCircle, Maximize2, X, Monitor, Smartphone, Tablet, Search, Download } from "lucide-react";
import omenxLogo from "@/assets/omenx-logo.svg";
import { MobileHeader } from "@/components/MobileHeader";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CATEGORY_STYLES, getCategoryFromName } from "@/lib/categoryUtils";

type DevicePreview = "auto" | "mobile" | "tablet" | "desktop";

const StyleGuide = () => {
  const actualIsMobile = useIsMobile();
  const navigate = useNavigate();
  const [devicePreview, setDevicePreview] = useState<DevicePreview>("auto");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState("opt1");
  const [searchQuery, setSearchQuery] = useState("");

  // Define all searchable sections with their IDs and keywords
  const sections = [
    { id: "brand-logo", title: "Brand Logo", keywords: ["logo", "brand", "omenx", "identity", "mark"] },
    { id: "typography", title: "Typography", keywords: ["font", "text", "heading", "type", "scale", "inter", "mono"] },
    { id: "playground", title: "Component Playground", keywords: ["playground", "interactive", "test", "try"] },
    { id: "button-playground", title: "Button Playground", keywords: ["button", "click", "action", "variant", "size"] },
    { id: "badge-playground", title: "Badge Playground", keywords: ["badge", "tag", "label", "status"] },
    { id: "input-playground", title: "Input Playground", keywords: ["input", "text", "field", "form", "type"] },
    { id: "progress-playground", title: "Progress Bar Playground", keywords: ["progress", "bar", "loading", "percentage"] },
    { id: "card-playground", title: "Card Playground", keywords: ["card", "container", "panel", "box"] },
    { id: "switch-playground", title: "Switch Playground", keywords: ["switch", "toggle", "on", "off", "boolean"] },
    { id: "slider-playground", title: "Slider Playground", keywords: ["slider", "range", "value", "min", "max"] },
    { id: "tabs-playground", title: "Tabs Playground", keywords: ["tabs", "navigation", "panel", "switch"] },
    { id: "tooltip-playground", title: "Tooltip Playground", keywords: ["tooltip", "hover", "hint", "help"] },
    { id: "popover-playground", title: "Popover Playground", keywords: ["popover", "popup", "overlay", "dropdown"] },
    { id: "dialog-playground", title: "Dialog / Modal Playground", keywords: ["dialog", "modal", "popup", "overlay", "confirm"] },
    { id: "mobile-header-playground", title: "Mobile Header Playground", keywords: ["header", "mobile", "navigation", "back", "logo", "title", "favorite", "share"] },
    { id: "colors", title: "Colors", keywords: ["color", "palette", "theme", "hsl", "variable"] },
    { id: "trading-colors", title: "Trading Colors Usage", keywords: ["trading", "green", "red", "purple", "profit", "loss"] },
    { id: "category-labels", title: "Category Labels", keywords: ["category", "label", "social", "crypto", "finance", "market", "badge", "tag"] },
    { id: "buttons", title: "Buttons", keywords: ["button", "click", "action", "primary", "secondary"] },
    { id: "badges", title: "Badges", keywords: ["badge", "tag", "status", "label"] },
    { id: "cards", title: "Cards", keywords: ["card", "container", "panel", "trading-card"] },
    { id: "form-elements", title: "Form Elements", keywords: ["form", "input", "switch", "control"] },
    { id: "option-chips", title: "Option Chips", keywords: ["chip", "option", "select", "choice"] },
    { id: "tabs", title: "Tabs", keywords: ["tabs", "navigation", "panel"] },
    { id: "animations", title: "Animations", keywords: ["animation", "fade", "slide", "pulse", "flash", "motion"] },
    { id: "spacing", title: "Spacing & Border Radius", keywords: ["spacing", "padding", "margin", "radius", "border", "rounded"] },
    { id: "icons", title: "Icons", keywords: ["icon", "lucide", "svg", "symbol"] },
    { id: "css-classes", title: "Custom CSS Classes", keywords: ["css", "class", "custom", "price", "chip", "tab", "scrollbar"] },
    { id: "mobile-patterns", title: "Mobile UI Patterns", keywords: ["mobile", "pattern", "button", "placement", "drawer", "spacing", "safe", "area"] },
    { id: "toast-notifications", title: "Toast & Notifications", keywords: ["toast", "notification", "alert", "message", "sonner", "success", "error", "warning"] },
    { id: "mobile-header", title: "Mobile Header", keywords: ["header", "mobile", "navigation", "back", "logo", "title", "favorite", "share", "countdown"] },
  ];

  // Filter sections based on search query
  const filterSection = (sectionId: string): boolean => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const section = sections.find(s => s.id === sectionId);
    if (!section) return true;
    return (
      section.title.toLowerCase().includes(query) ||
      section.keywords.some(k => k.includes(query))
    );
  };

  // Check if any playground component matches
  const playgroundMatches = (): boolean => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const playgroundSections = sections.filter(s => s.id.includes("playground"));
    return playgroundSections.some(s => 
      s.title.toLowerCase().includes(query) || 
      s.keywords.some(k => k.includes(query))
    );
  };

  // Override isMobile based on device preview selection
  const isMobile = devicePreview === "auto" 
    ? actualIsMobile 
    : devicePreview === "mobile" || devicePreview === "tablet";

  // Playground states
  const [buttonVariant, setButtonVariant] = useState<"default" | "secondary" | "destructive" | "outline" | "ghost" | "link">("default");
  const [buttonSize, setButtonSize] = useState<"default" | "sm" | "lg" | "icon">("default");
  const [buttonText, setButtonText] = useState("Click Me");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [badgeVariant, setBadgeVariant] = useState<"default" | "secondary" | "destructive" | "outline">("default");
  const [badgeText, setBadgeText] = useState("Badge");
  const [badgeCustomColor, setBadgeCustomColor] = useState<string>("none");

  const [inputPlaceholder, setInputPlaceholder] = useState("Enter text...");
  const [inputDisabled, setInputDisabled] = useState(false);
  const [inputType, setInputType] = useState<"text" | "password" | "number">("text");

  const [progressValue, setProgressValue] = useState(65);
  const [progressColor, setProgressColor] = useState<"green" | "red" | "purple">("green");

  const [cardStyle, setCardStyle] = useState<"default" | "trading">("trading");
  const [cardTitle, setCardTitle] = useState("Card Title");
  const [cardDescription, setCardDescription] = useState("Card description goes here");

  // Switch Playground
  const [switchChecked, setSwitchChecked] = useState(false);
  const [switchDisabled, setSwitchDisabled] = useState(false);
  const [switchLabel, setSwitchLabel] = useState("Enable feature");

  // Slider Playground
  const [sliderValue, setSliderValue] = useState([50]);
  const [sliderMin, setSliderMin] = useState(0);
  const [sliderMax, setSliderMax] = useState(100);
  const [sliderStep, setSliderStep] = useState(1);
  const [sliderDisabled, setSliderDisabled] = useState(false);

  // Tabs Playground
  const [tabsCount, setTabsCount] = useState(3);
  const [tabsStyle, setTabsStyle] = useState<"default" | "full-width">("default");
  const [tabLabels, setTabLabels] = useState(["Tab 1", "Tab 2", "Tab 3", "Tab 4"]);

  // Tooltip Playground
  const [tooltipText, setTooltipText] = useState("This is a helpful tooltip");
  const [tooltipSide, setTooltipSide] = useState<"top" | "right" | "bottom" | "left">("top");
  const [tooltipDelayDuration, setTooltipDelayDuration] = useState(200);

  // Popover Playground
  const [popoverTitle, setPopoverTitle] = useState("Popover Title");
  const [popoverContent, setPopoverContent] = useState("This is the popover content. It can contain any elements.");
  const [popoverSide, setPopoverSide] = useState<"top" | "right" | "bottom" | "left">("bottom");
  const [popoverAlign, setPopoverAlign] = useState<"start" | "center" | "end">("center");

  // Dialog Playground
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("Dialog Title");
  const [dialogDescription, setDialogDescription] = useState("This is a dialog description that explains what this dialog is for.");
  const [dialogSize, setDialogSize] = useState<"sm" | "md" | "lg" | "xl" | "full">("md");
  const [dialogShowFooter, setDialogShowFooter] = useState(true);
  const [dialogAnimation, setDialogAnimation] = useState<"fade" | "scale" | "slide">("scale");

  // Mobile Header Playground
  const [headerTitle, setHeaderTitle] = useState("Bitcoin price on January 31, 2026?");
  const [headerShowLogo, setHeaderShowLogo] = useState(false);
  const [headerShowBack, setHeaderShowBack] = useState(true);
  const [headerShowActions, setHeaderShowActions] = useState(true);
  const [headerIsFavorite, setHeaderIsFavorite] = useState(false);
  const [headerShowCountdown, setHeaderShowCountdown] = useState(true);
  const [headerShowTweets, setHeaderShowTweets] = useState(false);
  const [headerShowPrice, setHeaderShowPrice] = useState(true);
  const [headerTweetCount, setHeaderTweetCount] = useState(156);
  const [headerCurrentPrice, setHeaderCurrentPrice] = useState("$94,532.18");
  const [headerPriceChange, setHeaderPriceChange] = useState("+2.34%");

  const getDialogSizeClass = () => {
    switch (dialogSize) {
      case "sm": return "max-w-sm";
      case "md": return "max-w-md";
      case "lg": return "max-w-lg";
      case "xl": return "max-w-xl";
      case "full": return "max-w-[90vw] h-[80vh]";
      default: return "max-w-md";
    }
  };

  const getDialogAnimationClass = () => {
    switch (dialogAnimation) {
      case "fade": return "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out";
      case "scale": return "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95";
      case "slide": return "data-[state=open]:animate-slide-up data-[state=closed]:animate-fade-out";
      default: return "";
    }
  };

  const resetPlayground = () => {
    setButtonVariant("default");
    setButtonSize("default");
    setButtonText("Click Me");
    setButtonDisabled(false);
    setBadgeVariant("default");
    setBadgeText("Badge");
    setBadgeCustomColor("none");
    setInputPlaceholder("Enter text...");
    setInputDisabled(false);
    setInputType("text");
    setProgressValue(65);
    setProgressColor("green");
    setCardStyle("trading");
    setCardTitle("Card Title");
    setCardDescription("Card description goes here");
    setSwitchChecked(false);
    setSwitchDisabled(false);
    setSwitchLabel("Enable feature");
    setSliderValue([50]);
    setSliderMin(0);
    setSliderMax(100);
    setSliderStep(1);
    setSliderDisabled(false);
    setTabsCount(3);
    setTabsStyle("default");
    setTabLabels(["Tab 1", "Tab 2", "Tab 3", "Tab 4"]);
    setTooltipText("This is a helpful tooltip");
    setTooltipSide("top");
    setTooltipDelayDuration(200);
    setPopoverTitle("Popover Title");
    setPopoverContent("This is the popover content. It can contain any elements.");
    setPopoverSide("bottom");
    setPopoverAlign("center");
    setDialogTitle("Dialog Title");
    setDialogDescription("This is a dialog description that explains what this dialog is for.");
    setDialogSize("md");
    setDialogShowFooter(true);
    setDialogAnimation("scale");
    // Mobile Header
    setHeaderTitle("Bitcoin price on January 31, 2026?");
    setHeaderShowLogo(false);
    setHeaderShowBack(true);
    setHeaderShowActions(true);
    setHeaderIsFavorite(false);
    setHeaderShowCountdown(true);
    setHeaderShowTweets(false);
    setHeaderShowPrice(true);
    setHeaderTweetCount(156);
    setHeaderCurrentPrice("$94,532.18");
    setHeaderPriceChange("+2.34%");
    toast.success("Playground reset!");
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(label);
    toast.success(`Copied: ${text}`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  // State for tracking copied code snippets
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Reusable CodePreview component
  const CodePreview = ({ code, id }: { code: string; id: string }) => (
    <div className="mt-4 p-3 bg-background rounded-lg border border-border overflow-x-auto relative group">
      <code className="text-xs text-muted-foreground font-mono whitespace-nowrap pr-10">
        {code}
      </code>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => copyCode(code, id)}
      >
        {copiedCode === id ? (
          <Check className="h-3.5 w-3.5 text-trading-green" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  );

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
        { name: "Trading Green BG", variable: "--trading-green-bg", class: "bg-trading-green-bg", value: "142 50% 12%", usage: "Subtle green bg" },
        { name: "Trading Red", variable: "--trading-red", class: "bg-trading-red", value: "0 72% 51%", usage: "Loss, sell, error" },
        { name: "Trading Red Muted", variable: "--trading-red-muted", class: "bg-trading-red-muted", value: "0 50% 20%", usage: "Red backgrounds" },
        { name: "Trading Red BG", variable: "--trading-red-bg", class: "bg-trading-red-bg", value: "0 50% 12%", usage: "Subtle red bg" },
        { name: "Trading Purple", variable: "--trading-purple", class: "bg-trading-purple", value: "260 60% 55%", usage: "Brand emphasis" },
        { name: "Trading Purple Muted", variable: "--trading-purple-muted", class: "bg-trading-purple-muted", value: "260 40% 30%", usage: "Purple backgrounds" },
        { name: "Trading Yellow", variable: "--trading-yellow", class: "bg-trading-yellow", value: "45 93% 58%", usage: "Alerts, warnings" },
        { name: "Trading Yellow Muted", variable: "--trading-yellow-muted", class: "bg-trading-yellow-muted", value: "45 70% 30%", usage: "Yellow backgrounds" },
      ]
    },
    {
      title: "Border & Text Colors",
      description: "Borders, inputs, and text hierarchy",
      colors: [
        { name: "Border", variable: "--border", class: "bg-border", value: "222 25% 18%", usage: "Default borders" },
        { name: "Border Subtle", variable: "--border-subtle", class: "bg-border-subtle", value: "222 20% 14%", usage: "Subtle borders" },
        { name: "Input", variable: "--input", class: "bg-input", value: "222 30% 12%", usage: "Input backgrounds" },
        { name: "Foreground", variable: "--foreground", class: "bg-foreground", value: "210 40% 98%", usage: "Primary text" },
        { name: "Muted Foreground", variable: "--muted-foreground", class: "text-muted-foreground bg-muted", value: "215 20% 55%", usage: "Secondary text" },
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className={`font-semibold ${isMobile ? "text-lg" : "text-2xl"}`}>Style Guide</h1>
              <p className="text-sm text-muted-foreground">Design System Documentation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${isMobile ? "w-[140px]" : "w-[200px]"} pl-9 h-8 text-sm bg-muted/50 border-border/50`}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Device Preview Toggle */}
            <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={devicePreview === "auto" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 px-2 gap-1.5"
                    onClick={() => setDevicePreview("auto")}
                  >
                    <span className="text-xs">Auto</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Use actual device size</TooltipContent>
              </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={devicePreview === "mobile" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setDevicePreview("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mobile Preview</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={devicePreview === "tablet" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setDevicePreview("tablet")}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Tablet Preview</TooltipContent>
            </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={devicePreview === "desktop" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDevicePreview("desktop")}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Desktop Preview</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Device indicator banner */}
        {devicePreview !== "auto" && (
          <div className="mt-2 flex items-center justify-center gap-2 py-1.5 px-3 bg-trading-purple/10 border border-trading-purple/20 rounded-lg">
            {devicePreview === "mobile" && <Smartphone className="h-3.5 w-3.5 text-trading-purple" />}
            {devicePreview === "tablet" && <Tablet className="h-3.5 w-3.5 text-trading-purple" />}
            {devicePreview === "desktop" && <Monitor className="h-3.5 w-3.5 text-trading-purple" />}
            <span className="text-xs text-trading-purple font-medium">
              Previewing {devicePreview} layout
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-5 w-5 p-0 ml-1 hover:bg-trading-purple/20"
              onClick={() => setDevicePreview("auto")}
            >
              <X className="h-3 w-3 text-trading-purple" />
            </Button>
          </div>
        )}
      </header>

      <main className={`${isMobile ? "px-4 py-6" : "px-8 py-8 max-w-7xl mx-auto"} space-y-12`}>
        {/* Search results info */}
        {searchQuery && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
            <Search className="h-4 w-4" />
            <span>Showing results for "<span className="text-foreground font-medium">{searchQuery}</span>"</span>
            <Button variant="ghost" size="sm" className="h-6 ml-auto" onClick={() => setSearchQuery("")}>
              Clear
            </Button>
          </div>
        )}

        {/* Brand Logo Section */}
        {filterSection("brand-logo") && (
        <section id="brand-logo">
          <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">Brand Logo</h2>
          <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
            {/* Primary Logo - Dark Background */}
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-lg">Primary Logo (Dark BG)</CardTitle>
                <CardDescription>Use on dark backgrounds - default usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-background rounded-xl p-8 flex items-center justify-center border border-border/30">
                  <img src={omenxLogo} alt="OMENX Logo" className="h-12" />
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono flex-1 truncate">
                    import omenxLogo from "@/assets/omenx-logo.svg"
                  </code>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => copyCode('import omenxLogo from "@/assets/omenx-logo.svg"', 'logo-import')}
                  >
                    {copiedCode === 'logo-import' ? <Check className="h-3.5 w-3.5 text-trading-green" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Logo Sizes */}
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-lg">Logo Sizes</CardTitle>
                <CardDescription>Recommended size variants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Header (h-8)</span>
                    <img src={omenxLogo} alt="OMENX" className="h-8" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Standard (h-10)</span>
                    <img src={omenxLogo} alt="OMENX" className="h-10" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Large (h-12)</span>
                    <img src={omenxLogo} alt="OMENX" className="h-12" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Hero (h-16)</span>
                    <img src={omenxLogo} alt="OMENX" className="h-16" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logo on Light Background */}
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-lg">Light Background Usage</CardTitle>
                <CardDescription>When used on light backgrounds, add a dark container or invert</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-xl p-8 flex items-center justify-center">
                  <img src={omenxLogo} alt="OMENX Logo" className="h-12 invert" />
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Add <code className="bg-muted px-1 rounded">className="invert"</code> for light backgrounds
                </p>
              </CardContent>
            </Card>

            {/* Logo Guidelines */}
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-lg">Usage Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-trading-green mt-0.5 flex-shrink-0" />
                  <span>Always use the official SVG file for best quality</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-trading-green mt-0.5 flex-shrink-0" />
                  <span>Maintain aspect ratio when scaling</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-trading-green mt-0.5 flex-shrink-0" />
                  <span>Use white logo on dark backgrounds (primary usage)</span>
                </div>
                <div className="flex items-start gap-2">
                  <X className="h-4 w-4 text-trading-red mt-0.5 flex-shrink-0" />
                  <span>Don't stretch or distort the logo</span>
                </div>
                <div className="flex items-start gap-2">
                  <X className="h-4 w-4 text-trading-red mt-0.5 flex-shrink-0" />
                  <span>Don't change logo colors (except invert for light BG)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        )}

        {/* Typography Section */}
        {filterSection("typography") && (
        <section id="typography">
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
        )}

        {/* Component Playground Section */}
        {playgroundMatches() && (
        <section id="playground">
          <div className="flex items-center justify-between mb-6 border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-trading-purple" />
              <h2 className="text-xl font-semibold text-foreground">Component Playground</h2>
            </div>
            <Button variant="outline" size="sm" onClick={resetPlayground} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          <div className="space-y-8">
            {/* Button Playground */}
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-trading-green" />
                  Button Playground
                </CardTitle>
                <CardDescription>Customize button appearance and behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                  {/* Preview */}
                  <div className="bg-muted/30 rounded-xl p-6 flex items-center justify-center min-h-[120px]">
                    <Button 
                      variant={buttonVariant} 
                      size={buttonSize} 
                      disabled={buttonDisabled}
                      onClick={() => toast.success("Button clicked!")}
                    >
                      {buttonSize === "icon" ? <Settings className="h-4 w-4" /> : buttonText}
                    </Button>
                  </div>

                  {/* Controls */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Variant</Label>
                      <Select value={buttonVariant} onValueChange={(v) => setButtonVariant(v as typeof buttonVariant)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="destructive">Destructive</SelectItem>
                          <SelectItem value="outline">Outline</SelectItem>
                          <SelectItem value="ghost">Ghost</SelectItem>
                          <SelectItem value="link">Link</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Size</Label>
                      <Select value={buttonSize} onValueChange={(v) => setButtonSize(v as typeof buttonSize)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sm">Small</SelectItem>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="lg">Large</SelectItem>
                          <SelectItem value="icon">Icon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Text</Label>
                      <Input 
                        value={buttonText} 
                        onChange={(e) => setButtonText(e.target.value)}
                        placeholder="Button text"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Disabled</Label>
                      <Switch checked={buttonDisabled} onCheckedChange={setButtonDisabled} />
                    </div>
                  </div>
                </div>

                <CodePreview 
                  code={`<Button variant="${buttonVariant}" size="${buttonSize}"${buttonDisabled ? " disabled" : ""}>${buttonSize === "icon" ? "<Icon />" : buttonText}</Button>`}
                  id="button-code"
                />
              </CardContent>
            </Card>

            {/* Badge Playground */}
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-trading-purple" />
                  Badge Playground
                </CardTitle>
                <CardDescription>Customize badge variants and colors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                  {/* Preview */}
                  <div className="bg-muted/30 rounded-xl p-6 flex items-center justify-center min-h-[120px]">
                    <Badge 
                      variant={badgeCustomColor === "none" ? badgeVariant : "outline"}
                      className={
                        badgeCustomColor === "green" ? "bg-trading-green/20 text-trading-green border-trading-green/30" :
                        badgeCustomColor === "red" ? "bg-trading-red/20 text-trading-red border-trading-red/30" :
                        badgeCustomColor === "yellow" ? "bg-trading-yellow/20 text-trading-yellow border-trading-yellow/30" :
                        badgeCustomColor === "purple" ? "bg-trading-purple/20 text-trading-purple border-trading-purple/30" :
                        ""
                      }
                    >
                      {badgeText}
                    </Badge>
                  </div>

                  {/* Controls */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Variant</Label>
                      <Select value={badgeVariant} onValueChange={(v) => { setBadgeVariant(v as typeof badgeVariant); setBadgeCustomColor("none"); }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="destructive">Destructive</SelectItem>
                          <SelectItem value="outline">Outline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Trading Color</Label>
                      <Select value={badgeCustomColor} onValueChange={setBadgeCustomColor}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None (Use Variant)</SelectItem>
                          <SelectItem value="green">Trading Green</SelectItem>
                          <SelectItem value="red">Trading Red</SelectItem>
                          <SelectItem value="yellow">Trading Yellow</SelectItem>
                          <SelectItem value="purple">Trading Purple</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Text</Label>
                      <Input 
                        value={badgeText} 
                        onChange={(e) => setBadgeText(e.target.value)}
                        placeholder="Badge text"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Input Playground */}
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-trading-yellow" />
                  Input Playground
                </CardTitle>
                <CardDescription>Test input field configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                  {/* Preview */}
                  <div className="bg-muted/30 rounded-xl p-6 flex items-center justify-center min-h-[120px]">
                    <Input 
                      type={inputType}
                      placeholder={inputPlaceholder}
                      disabled={inputDisabled}
                      className="max-w-[240px]"
                    />
                  </div>

                  {/* Controls */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Type</Label>
                      <Select value={inputType} onValueChange={(v) => setInputType(v as typeof inputType)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="password">Password</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Placeholder</Label>
                      <Input 
                        value={inputPlaceholder} 
                        onChange={(e) => setInputPlaceholder(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Disabled</Label>
                      <Switch checked={inputDisabled} onCheckedChange={setInputDisabled} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Bar Playground */}
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-trading-red" />
                  Progress Bar Playground
                </CardTitle>
                <CardDescription>Adjust progress value and color</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                  {/* Preview */}
                  <div className="bg-muted/30 rounded-xl p-6 flex flex-col justify-center min-h-[120px] gap-2">
                    <div className={`h-3 rounded-full overflow-hidden ${
                      progressColor === "green" ? "bg-trading-green-muted" :
                      progressColor === "red" ? "bg-trading-red-muted" :
                      "bg-trading-purple-muted"
                    }`}>
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          progressColor === "green" ? "bg-trading-green" :
                          progressColor === "red" ? "bg-trading-red" :
                          "bg-trading-purple"
                        }`}
                        style={{ width: `${progressValue}%` }}
                      />
                    </div>
                    <p className={`text-center font-mono text-lg ${
                      progressColor === "green" ? "text-trading-green" :
                      progressColor === "red" ? "text-trading-red" :
                      "text-trading-purple"
                    }`}>
                      {progressValue}%
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Value: {progressValue}%</Label>
                      <Slider 
                        value={[progressValue]} 
                        onValueChange={(v) => setProgressValue(v[0])}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Color</Label>
                      <Select value={progressColor} onValueChange={(v) => setProgressColor(v as typeof progressColor)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="green">Green (Profit)</SelectItem>
                          <SelectItem value="red">Red (Loss)</SelectItem>
                          <SelectItem value="purple">Purple (Neutral)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card Playground */}
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indicator" />
                  Card Playground
                </CardTitle>
                <CardDescription>Customize card style and content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                  {/* Preview */}
                  <div className="bg-muted/30 rounded-xl p-6 flex items-center justify-center min-h-[180px]">
                    <Card className={cardStyle === "trading" ? "trading-card w-full max-w-[280px]" : "w-full max-w-[280px]"}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{cardTitle}</CardTitle>
                        <CardDescription className="text-xs">{cardDescription}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Sample card content area.</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Controls */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Style</Label>
                      <Select value={cardStyle} onValueChange={(v) => setCardStyle(v as typeof cardStyle)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="trading">Trading (Gradient)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Title</Label>
                      <Input 
                        value={cardTitle} 
                        onChange={(e) => setCardTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Description</Label>
                      <Input 
                        value={cardDescription} 
                        onChange={(e) => setCardDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <CodePreview 
                  code={`<Card${cardStyle === "trading" ? ' className="trading-card"' : ""}><CardHeader>...</CardHeader></Card>`}
                  id="card-code"
                />
              </CardContent>
            </Card>

            {/* Switch Playground */}
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-trading-green" />
                  Switch Playground
                </CardTitle>
                <CardDescription>Toggle switch with label and states</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                  {/* Preview */}
                  <div className="bg-muted/30 rounded-xl p-6 flex items-center justify-center min-h-[120px]">
                    <div className="flex items-center gap-3">
                      <Switch 
                        checked={switchChecked} 
                        onCheckedChange={setSwitchChecked}
                        disabled={switchDisabled}
                      />
                      <Label className={switchDisabled ? "text-muted-foreground" : ""}>
                        {switchLabel}
                      </Label>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Label Text</Label>
                      <Input 
                        value={switchLabel} 
                        onChange={(e) => setSwitchLabel(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Checked</Label>
                      <Switch checked={switchChecked} onCheckedChange={setSwitchChecked} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Disabled</Label>
                      <Switch checked={switchDisabled} onCheckedChange={setSwitchDisabled} />
                    </div>
                  </div>
                </div>

                <CodePreview 
                  code={`<Switch${switchChecked ? " checked" : ""}${switchDisabled ? " disabled" : ""} />`}
                  id="switch-code"
                />
              </CardContent>
            </Card>

            {/* Slider Playground */}
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-trading-purple" />
                  Slider Playground
                </CardTitle>
                <CardDescription>Adjust slider range and behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                  {/* Preview */}
                  <div className="bg-muted/30 rounded-xl p-6 flex flex-col justify-center min-h-[120px] gap-4">
                    <Slider 
                      value={sliderValue}
                      onValueChange={setSliderValue}
                      min={sliderMin}
                      max={sliderMax}
                      step={sliderStep}
                      disabled={sliderDisabled}
                    />
                    <p className="text-center font-mono text-lg text-trading-purple">
                      {sliderValue[0]}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="space-y-4">
                    <div className={`grid gap-4 ${isMobile ? "grid-cols-2" : "grid-cols-3"}`}>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Min</Label>
                        <Input 
                          type="number"
                          value={sliderMin} 
                          onChange={(e) => setSliderMin(Number(e.target.value))}
                          className="font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Max</Label>
                        <Input 
                          type="number"
                          value={sliderMax} 
                          onChange={(e) => setSliderMax(Number(e.target.value))}
                          className="font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Step</Label>
                        <Input 
                          type="number"
                          value={sliderStep} 
                          onChange={(e) => setSliderStep(Number(e.target.value))}
                          className="font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Disabled</Label>
                      <Switch checked={sliderDisabled} onCheckedChange={setSliderDisabled} />
                    </div>
                  </div>
                </div>

                <CodePreview 
                  code={`<Slider value={[${sliderValue[0]}]} min={${sliderMin}} max={${sliderMax}} step={${sliderStep}}${sliderDisabled ? " disabled" : ""} />`}
                  id="slider-code"
                />
              </CardContent>
            </Card>

            {/* Tabs Playground */}
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-trading-yellow" />
                  Tabs Playground
                </CardTitle>
                <CardDescription>Configure tab count and styling</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                  {/* Preview */}
                  <div className="bg-muted/30 rounded-xl p-4 min-h-[180px]">
                    <Tabs defaultValue="tab-0" className="w-full">
                      <TabsList className={tabsStyle === "full-width" ? "w-full bg-muted/30" : "bg-muted/30"}>
                        {Array.from({ length: tabsCount }).map((_, i) => (
                          <TabsTrigger 
                            key={i} 
                            value={`tab-${i}`}
                            className={tabsStyle === "full-width" ? "flex-1" : ""}
                          >
                            {tabLabels[i] || `Tab ${i + 1}`}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {Array.from({ length: tabsCount }).map((_, i) => (
                        <TabsContent key={i} value={`tab-${i}`} className="p-4">
                          <p className="text-sm text-muted-foreground">
                            Content for {tabLabels[i] || `Tab ${i + 1}`}
                          </p>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>

                  {/* Controls */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Number of Tabs: {tabsCount}</Label>
                      <Slider 
                        value={[tabsCount]}
                        onValueChange={(v) => setTabsCount(v[0])}
                        min={2}
                        max={4}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Style</Label>
                      <Select value={tabsStyle} onValueChange={(v) => setTabsStyle(v as typeof tabsStyle)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="full-width">Full Width</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Tab Labels</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {Array.from({ length: tabsCount }).map((_, i) => (
                          <Input
                            key={i}
                            value={tabLabels[i]}
                            onChange={(e) => {
                              const newLabels = [...tabLabels];
                              newLabels[i] = e.target.value;
                              setTabLabels(newLabels);
                            }}
                            placeholder={`Tab ${i + 1}`}
                            className="text-sm"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <CodePreview 
                  code={`<Tabs><TabsList${tabsStyle === "full-width" ? ' className="w-full"' : ""}>${Array.from({ length: tabsCount }).map((_, i) => `<TabsTrigger>${tabLabels[i]}</TabsTrigger>`).join("")}</TabsList></Tabs>`}
                  id="tabs-code"
                />
              </CardContent>
            </Card>

            {/* Tooltip Playground */}
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                  Tooltip Playground
                </CardTitle>
                <CardDescription>Customize tooltip position and delay</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                  {/* Preview */}
                  <div className="bg-muted/30 rounded-xl p-6 flex items-center justify-center min-h-[150px]">
                    <Tooltip delayDuration={tooltipDelayDuration}>
                      <TooltipTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <HelpCircle className="h-4 w-4" />
                          Hover me
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side={tooltipSide}>
                        <p>{tooltipText}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Controls */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Tooltip Text</Label>
                      <Input 
                        value={tooltipText} 
                        onChange={(e) => setTooltipText(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Position</Label>
                      <Select value={tooltipSide} onValueChange={(v) => setTooltipSide(v as typeof tooltipSide)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                          <SelectItem value="left">Left</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Delay: {tooltipDelayDuration}ms</Label>
                      <Slider 
                        value={[tooltipDelayDuration]}
                        onValueChange={(v) => setTooltipDelayDuration(v[0])}
                        min={0}
                        max={1000}
                        step={50}
                      />
                    </div>
                  </div>
                </div>

                <CodePreview 
                  code={`<Tooltip delayDuration={${tooltipDelayDuration}}><TooltipTrigger>...</TooltipTrigger><TooltipContent side="${tooltipSide}">${tooltipText}</TooltipContent></Tooltip>`}
                  id="tooltip-code"
                />
              </CardContent>
            </Card>

            {/* Popover Playground */}
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indicator" />
                  Popover Playground
                </CardTitle>
                <CardDescription>Configure popover position, alignment and content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                  {/* Preview */}
                  <div className="bg-muted/30 rounded-xl p-6 flex items-center justify-center min-h-[180px]">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <Info className="h-4 w-4" />
                          Click me
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side={popoverSide} align={popoverAlign} className="w-72">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">{popoverTitle}</h4>
                          <p className="text-sm text-muted-foreground">{popoverContent}</p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Controls */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Title</Label>
                      <Input 
                        value={popoverTitle} 
                        onChange={(e) => setPopoverTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Content</Label>
                      <Input 
                        value={popoverContent} 
                        onChange={(e) => setPopoverContent(e.target.value)}
                      />
                    </div>

                    <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Side</Label>
                        <Select value={popoverSide} onValueChange={(v) => setPopoverSide(v as typeof popoverSide)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="top">Top</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                            <SelectItem value="bottom">Bottom</SelectItem>
                            <SelectItem value="left">Left</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Align</Label>
                        <Select value={popoverAlign} onValueChange={(v) => setPopoverAlign(v as typeof popoverAlign)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="start">Start</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="end">End</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <CodePreview 
                  code={`<Popover><PopoverTrigger>...</PopoverTrigger><PopoverContent side="${popoverSide}" align="${popoverAlign}">...</PopoverContent></Popover>`}
                  id="popover-code"
                />
              </CardContent>
            </Card>

            {/* Dialog Playground */}
            <Card className="trading-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-trading-green" />
                  Dialog / Modal Playground
                </CardTitle>
                <CardDescription>Configure dialog size, animation and content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                  {/* Preview */}
                  <div className="bg-muted/30 rounded-xl p-6 flex items-center justify-center min-h-[180px]">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <Maximize2 className="h-4 w-4" />
                          Open Dialog
                        </Button>
                      </DialogTrigger>
                      <DialogContent className={`${getDialogSizeClass()} ${getDialogAnimationClass()}`}>
                        <DialogHeader>
                          <DialogTitle>{dialogTitle}</DialogTitle>
                          <DialogDescription>{dialogDescription}</DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-muted-foreground">
                            This is the main content area of the dialog. You can put any content here including forms, images, or other components.
                          </p>
                          {dialogSize === "full" && (
                            <div className="mt-4 p-4 bg-muted/30 rounded-lg h-[200px] flex items-center justify-center">
                              <p className="text-muted-foreground">Extended content area for full-size dialog</p>
                            </div>
                          )}
                        </div>
                        {dialogShowFooter && (
                          <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button onClick={() => { setDialogOpen(false); toast.success("Action confirmed!"); }}>Confirm</Button>
                          </DialogFooter>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Controls */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Title</Label>
                      <Input 
                        value={dialogTitle} 
                        onChange={(e) => setDialogTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Description</Label>
                      <Input 
                        value={dialogDescription} 
                        onChange={(e) => setDialogDescription(e.target.value)}
                      />
                    </div>

                    <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Size</Label>
                        <Select value={dialogSize} onValueChange={(v) => setDialogSize(v as typeof dialogSize)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sm">Small</SelectItem>
                            <SelectItem value="md">Medium</SelectItem>
                            <SelectItem value="lg">Large</SelectItem>
                            <SelectItem value="xl">Extra Large</SelectItem>
                            <SelectItem value="full">Full Screen</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Animation</Label>
                        <Select value={dialogAnimation} onValueChange={(v) => setDialogAnimation(v as typeof dialogAnimation)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fade">Fade</SelectItem>
                            <SelectItem value="scale">Scale (Default)</SelectItem>
                            <SelectItem value="slide">Slide Up</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Show Footer</Label>
                      <Switch checked={dialogShowFooter} onCheckedChange={setDialogShowFooter} />
                    </div>
                  </div>
                </div>

                <CodePreview 
                  code={`<Dialog><DialogTrigger>...</DialogTrigger><DialogContent className="${getDialogSizeClass()}">...</DialogContent></Dialog>`}
                  id="dialog-code"
                />
              </CardContent>
            </Card>
          </div>
        </section>
        )}

        {/* Mobile Header Playground */}
        {filterSection("mobile-header-playground") && (
        <section id="mobile-header-playground" className="scroll-mt-20">
          <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">Mobile Header Playground</h2>
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-trading-purple" />
                Mobile Header Playground
              </CardTitle>
              <CardDescription>实时预览 MobileHeader 组件的各种配置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Live Preview */}
              <div className="bg-muted/30 rounded-xl overflow-hidden border border-border">
                <div className="relative">
                  <MobileHeader 
                    title={headerTitle || undefined}
                    showLogo={headerShowLogo}
                    showBack={headerShowBack}
                    showActions={headerShowActions}
                    isFavorite={headerIsFavorite}
                    onFavoriteToggle={() => setHeaderIsFavorite(!headerIsFavorite)}
                    endTime={headerShowCountdown ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) : undefined}
                    tweetCount={headerShowTweets ? headerTweetCount : undefined}
                    currentPrice={headerShowPrice ? headerCurrentPrice : undefined}
                    priceChange24h={headerShowPrice ? headerPriceChange : undefined}
                    onTitleClick={() => toast.info("Title clicked - would open event selector")}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                {/* Left Column - Text Controls */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Title</Label>
                    <Input 
                      value={headerTitle} 
                      onChange={(e) => setHeaderTitle(e.target.value)}
                      placeholder="Enter title..."
                    />
                  </div>

                  <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Current Price</Label>
                      <Input 
                        value={headerCurrentPrice} 
                        onChange={(e) => setHeaderCurrentPrice(e.target.value)}
                        placeholder="$94,532.18"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Price Change</Label>
                      <Input 
                        value={headerPriceChange} 
                        onChange={(e) => setHeaderPriceChange(e.target.value)}
                        placeholder="+2.34%"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Tweet Count</Label>
                    <Input 
                      type="number"
                      value={headerTweetCount} 
                      onChange={(e) => setHeaderTweetCount(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                {/* Right Column - Toggle Controls */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-border/30">
                    <div>
                      <Label className="text-sm">Show Logo</Label>
                      <p className="text-xs text-muted-foreground">Trade pages should hide logo</p>
                    </div>
                    <Switch checked={headerShowLogo} onCheckedChange={setHeaderShowLogo} />
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-border/30">
                    <div>
                      <Label className="text-sm">Show Back Button</Label>
                      <p className="text-xs text-muted-foreground">Navigation indicator</p>
                    </div>
                    <Switch checked={headerShowBack} onCheckedChange={setHeaderShowBack} />
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-border/30">
                    <div>
                      <Label className="text-sm">Show Actions</Label>
                      <p className="text-xs text-muted-foreground">Favorite & Share buttons</p>
                    </div>
                    <Switch checked={headerShowActions} onCheckedChange={setHeaderShowActions} />
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-border/30">
                    <div>
                      <Label className="text-sm">Show Countdown</Label>
                      <p className="text-xs text-muted-foreground">Ends in timer</p>
                    </div>
                    <Switch checked={headerShowCountdown} onCheckedChange={setHeaderShowCountdown} />
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-border/30">
                    <div>
                      <Label className="text-sm">Show Tweet Count</Label>
                      <p className="text-xs text-muted-foreground">Social metrics</p>
                    </div>
                    <Switch checked={headerShowTweets} onCheckedChange={setHeaderShowTweets} />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label className="text-sm">Show Price</Label>
                      <p className="text-xs text-muted-foreground">Price-based events</p>
                    </div>
                    <Switch checked={headerShowPrice} onCheckedChange={setHeaderShowPrice} />
                  </div>
                </div>
              </div>

              {/* Preset Configurations */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Quick Presets</Label>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setHeaderTitle("Bitcoin price on January 31, 2026?");
                      setHeaderShowLogo(false);
                      setHeaderShowBack(true);
                      setHeaderShowActions(true);
                      setHeaderShowCountdown(true);
                      setHeaderShowTweets(false);
                      setHeaderShowPrice(true);
                    }}
                  >
                    Trade Page (Price)
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setHeaderTitle("Elon Musk # tweets January 10 - January 17, 2026");
                      setHeaderShowLogo(false);
                      setHeaderShowBack(true);
                      setHeaderShowActions(true);
                      setHeaderShowCountdown(true);
                      setHeaderShowTweets(true);
                      setHeaderShowPrice(false);
                    }}
                  >
                    Trade Page (Tweets)
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setHeaderTitle("");
                      setHeaderShowLogo(true);
                      setHeaderShowBack(false);
                      setHeaderShowActions(false);
                      setHeaderShowCountdown(false);
                      setHeaderShowTweets(false);
                      setHeaderShowPrice(false);
                    }}
                  >
                    Events List
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setHeaderTitle("Event Details");
                      setHeaderShowLogo(false);
                      setHeaderShowBack(true);
                      setHeaderShowActions(false);
                      setHeaderShowCountdown(false);
                      setHeaderShowTweets(false);
                      setHeaderShowPrice(false);
                    }}
                  >
                    Detail Page
                  </Button>
                </div>
              </div>

              <CodePreview 
                code={`<MobileHeader${headerTitle ? ` title="${headerTitle.substring(0, 30)}${headerTitle.length > 30 ? '...' : ''}"` : ''}${headerShowLogo ? '' : ' showLogo={false}'}${headerShowBack ? ' showBack' : ''}${headerShowActions ? ' showActions' : ''}${headerShowCountdown ? ' endTime={...}' : ''}${headerShowTweets ? ` tweetCount={${headerTweetCount}}` : ''}${headerShowPrice ? ` currentPrice="${headerCurrentPrice}"` : ''} />`}
                id="mobile-header-code"
              />
            </CardContent>
          </Card>
        </section>
        )}

        {/* Colors Section */}
        {filterSection("colors") && (
        <section id="colors">
          <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">Colors</h2>
          <div className="space-y-10">
            {colorSections.map((section) => (
              <div key={section.title}>
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-foreground mb-1">{section.title}</h3>
                  {section.description && (
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  )}
                </div>
                <div className={`grid gap-3 ${isMobile ? "grid-cols-2" : "grid-cols-4 lg:grid-cols-6"}`}>
                  {section.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => copyToClipboard(color.variable, color.name)}
                      className="group relative text-left"
                    >
                      <div
                        className={`h-14 rounded-lg ${color.class} border border-border/50 mb-2 flex items-center justify-center transition-all group-hover:scale-105 group-hover:border-primary/50`}
                      >
                        {copiedColor === color.name ? (
                          <Check className="h-5 w-5 text-foreground" />
                        ) : (
                          <Copy className="h-4 w-4 text-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                      <p className="text-xs font-medium truncate">{color.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono truncate">{color.variable}</p>
                      {(color as any).usage && (
                        <p className="text-[10px] text-primary/70 truncate mt-0.5">{(color as any).usage}</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        )}

        {/* Trading Colors Demo */}
        {filterSection("trading-colors") && (
        <section id="trading-colors">
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
        )}

        {/* Category Labels Section */}
        {filterSection("category-labels") && (
        <section id="category-labels">
          <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">Category Labels</h2>
          <div className="space-y-6">
            <div className="trading-card p-6">
              <h3 className="text-base font-semibold text-foreground mb-2">Unified Category System</h3>
              <p className="text-sm text-muted-foreground mb-6">
                All event category labels use consistent colors defined in <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">src/lib/categoryUtils.ts</code>. 
                Categories are determined by the event icon or name.
              </p>

              {/* Category Examples */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Available Categories</h4>
                <div className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-4"}`}>
                  {/* Social */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50 space-y-2">
                    <Badge className={`${CATEGORY_STYLES.Social.class} border-0`}>Social</Badge>
                    <p className="text-[10px] text-muted-foreground">Twitter, influencers</p>
                    <code className="text-[9px] bg-muted px-1 py-0.5 rounded font-mono block">
                      bg-primary/20 text-primary
                    </code>
                  </div>

                  {/* Crypto */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50 space-y-2">
                    <Badge className={`${CATEGORY_STYLES.Crypto.class} border-0`}>Crypto</Badge>
                    <p className="text-[10px] text-muted-foreground">Bitcoin, Ethereum</p>
                    <code className="text-[9px] bg-muted px-1 py-0.5 rounded font-mono block">
                      bg-trading-yellow/20 text-trading-yellow
                    </code>
                  </div>

                  {/* Finance */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50 space-y-2">
                    <Badge className={`${CATEGORY_STYLES.Finance.class} border-0`}>Finance</Badge>
                    <p className="text-[10px] text-muted-foreground">Fed rates, stocks</p>
                    <code className="text-[9px] bg-muted px-1 py-0.5 rounded font-mono block">
                      bg-trading-green/20 text-trading-green
                    </code>
                  </div>

                  {/* Politics */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50 space-y-2">
                    <Badge className={`${CATEGORY_STYLES.Politics.class} border-0`}>Politics</Badge>
                    <p className="text-[10px] text-muted-foreground">Elections, government</p>
                    <code className="text-[9px] bg-muted px-1 py-0.5 rounded font-mono block">
                      bg-trading-red/20 text-trading-red
                    </code>
                  </div>

                  {/* Tech */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50 space-y-2">
                    <Badge className={`${CATEGORY_STYLES.Tech.class} border-0`}>Tech</Badge>
                    <p className="text-[10px] text-muted-foreground">SpaceX, AI, Apple</p>
                    <code className="text-[9px] bg-muted px-1 py-0.5 rounded font-mono block">
                      bg-cyan-500/20 text-cyan-400
                    </code>
                  </div>

                  {/* Entertainment */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50 space-y-2">
                    <Badge className={`${CATEGORY_STYLES.Entertainment.class} border-0`}>Entertainment</Badge>
                    <p className="text-[10px] text-muted-foreground">Oscar, Grammy, movies</p>
                    <code className="text-[9px] bg-muted px-1 py-0.5 rounded font-mono block">
                      bg-orange-500/20 text-orange-400
                    </code>
                  </div>

                  {/* Sports */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50 space-y-2">
                    <Badge className={`${CATEGORY_STYLES.Sports.class} border-0`}>Sports</Badge>
                    <p className="text-[10px] text-muted-foreground">NBA, NFL, Olympics</p>
                    <code className="text-[9px] bg-muted px-1 py-0.5 rounded font-mono block">
                      bg-blue-500/20 text-blue-400
                    </code>
                  </div>

                  {/* General */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50 space-y-2">
                    <Badge className={`${CATEGORY_STYLES.General.class} border-0`}>General</Badge>
                    <p className="text-[10px] text-muted-foreground">Fallback category</p>
                    <code className="text-[9px] bg-muted px-1 py-0.5 rounded font-mono block">
                      bg-muted text-foreground
                    </code>
                  </div>
                </div>
              </div>

              {/* Adding New Categories Guide */}
              <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <h4 className="text-sm font-medium text-primary mb-2">📌 添加新分类的规则</h4>
                <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>每个分类必须有<strong className="text-foreground">独特颜色</strong>，不能与现有分类重复</li>
                  <li>在 <code className="bg-muted px-1 rounded">CATEGORY_STYLES</code> 添加样式定义</li>
                  <li>在 <code className="bg-muted px-1 rounded">getCategoryFromName</code> 添加关键词匹配</li>
                  <li>更新 StyleGuide 文档</li>
                </ol>
              </div>

              {/* Usage Examples */}
              <div className="mt-8 space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Usage Examples</h4>
                <div className={`grid gap-2 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                  <div className="p-2.5 bg-background rounded-lg border border-border flex items-center gap-2">
                    <Badge className={`${CATEGORY_STYLES.Social.class} border-0`}>Social</Badge>
                    <span className="text-xs text-muted-foreground truncate">Elon Musk # tweets</span>
                  </div>
                  <div className="p-2.5 bg-background rounded-lg border border-border flex items-center gap-2">
                    <Badge className={`${CATEGORY_STYLES.Crypto.class} border-0`}>Crypto</Badge>
                    <span className="text-xs text-muted-foreground truncate">Bitcoin price on Jan 31</span>
                  </div>
                  <div className="p-2.5 bg-background rounded-lg border border-border flex items-center gap-2">
                    <Badge className={`${CATEGORY_STYLES.Tech.class} border-0`}>Tech</Badge>
                    <span className="text-xs text-muted-foreground truncate">SpaceX Starship reach orbit</span>
                  </div>
                  <div className="p-2.5 bg-background rounded-lg border border-border flex items-center gap-2">
                    <Badge className={`${CATEGORY_STYLES.Entertainment.class} border-0`}>Entertainment</Badge>
                    <span className="text-xs text-muted-foreground truncate">Oscar Best Picture 2024</span>
                  </div>
                  <div className="p-2.5 bg-background rounded-lg border border-border flex items-center gap-2">
                    <Badge className={`${CATEGORY_STYLES.Politics.class} border-0`}>Politics</Badge>
                    <span className="text-xs text-muted-foreground truncate">Government shutdown end</span>
                  </div>
                  <div className="p-2.5 bg-background rounded-lg border border-border flex items-center gap-2">
                    <Badge className={`${CATEGORY_STYLES.Sports.class} border-0`}>Sports</Badge>
                    <span className="text-xs text-muted-foreground truncate">Super Bowl LVIII winner</span>
                  </div>
                </div>
              </div>

              {/* Code Example */}
              <div className="mt-8 space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Code Usage</h4>
                <div className="p-4 bg-background rounded-lg border border-border overflow-x-auto">
                  <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap">
{`import { getCategoryFromName, CATEGORY_STYLES, CategoryType } from "@/lib/categoryUtils";

// Get category info from event name
const categoryInfo = getCategoryFromName(event.name);

// Use CATEGORY_STYLES with .class for Tailwind classes
<Badge className={\`\${CATEGORY_STYLES[categoryInfo.label as CategoryType]?.class} border-0\`}>
  {categoryInfo.label}
</Badge>

// Available: Social, Crypto, Finance, Politics, Tech, Entertainment, Sports, General`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* Buttons Section */}
        {filterSection("buttons") && (
        <section id="buttons">
          <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">Buttons</h2>
          <div className="space-y-8">
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

            {/* NEW: Trading Buttons with full documentation */}
            <div className="trading-card p-6 space-y-6">
              <div>
                <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-trading-yellow" />
                  Trading Buttons (Standardized)
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use these CSS classes for ALL trading-related buttons across the app. 
                  <span className="text-trading-yellow font-medium"> All trading buttons use WHITE text (primary-foreground).</span>
                </p>
              </div>

              {/* Buy/Long Button */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <button className="btn-trading-green">
                    <TrendingUp className="h-4 w-4 inline mr-2" />
                    Buy | Long
                  </button>
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-trading-green">
                    .btn-trading-green
                  </code>
                </div>
                <p className="text-xs text-muted-foreground pl-1">
                  For: Buy actions, Long positions, Profit indicators, Success confirmations
                </p>
                <CodePreview 
                  code={`<button className="btn-trading-green">Buy | Long</button>`}
                  id="btn-green-code"
                />
              </div>

              {/* Sell/Short Button */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <button className="btn-trading-red">
                    <TrendingDown className="h-4 w-4 inline mr-2" />
                    Sell | Short
                  </button>
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-trading-red">
                    .btn-trading-red
                  </code>
                </div>
                <p className="text-xs text-muted-foreground pl-1">
                  For: Sell actions, Short positions, Loss indicators, Destructive actions
                </p>
                <CodePreview 
                  code={`<button className="btn-trading-red">Sell | Short</button>`}
                  id="btn-red-code"
                />
              </div>

              {/* Primary Brand Button */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <button className="btn-primary">
                    Place Order
                  </button>
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-primary">
                    .btn-primary
                  </code>
                </div>
                <p className="text-xs text-muted-foreground pl-1">
                  For: Primary CTAs, Navigation, Brand emphasis (Purple)
                </p>
                <CodePreview 
                  code={`<button className="btn-primary">Place Order</button>`}
                  id="btn-primary-code"
                />
              </div>

              {/* Inactive Toggle State */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <button className="btn-trading-inactive">
                    Inactive Option
                  </button>
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-muted-foreground">
                    .btn-trading-inactive
                  </code>
                </div>
                <p className="text-xs text-muted-foreground pl-1">
                  For: Unselected toggle options in Long/Short switches
                </p>
              </div>

              {/* Usage Example: Toggle Group */}
              <div className="space-y-3 pt-4 border-t border-border/50">
                <h4 className="text-sm font-medium text-foreground">Usage Example: Long/Short Toggle</h4>
                <div className="flex rounded-xl overflow-hidden border border-border/50 bg-background/50 p-0.5 w-fit">
                  <button className="btn-trading-green px-5 py-2 text-sm rounded-lg">Long</button>
                  <button className="btn-trading-inactive px-5 py-2 text-sm rounded-lg">Short</button>
                </div>
                <CodePreview 
                  code={`<div className="flex rounded-xl border border-border/50 p-0.5">
  <button className={side === "long" ? "btn-trading-green" : "btn-trading-inactive"}>Long</button>
  <button className={side === "short" ? "btn-trading-red" : "btn-trading-inactive"}>Short</button>
</div>`}
                  id="toggle-example-code"
                />
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
        )}

        {/* Badges Section */}
        {filterSection("badges") && (
        <section id="badges">
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
        )}

        {/* Cards Section */}
        {filterSection("cards") && (
        <section id="cards">
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
        )}

        {/* Form Elements */}
        {filterSection("form-elements") && (
        <section id="form-elements">
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
        )}

        {/* Option Chips */}
        {filterSection("option-chips") && (
        <section id="option-chips">
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
        )}

        {/* Tabs */}
        {filterSection("tabs") && (
        <section id="tabs">
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
        )}

        {/* Animations */}
        {filterSection("animations") && (
        <section id="animations">
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
        )}

        {/* Spacing & Radius */}
        {filterSection("spacing") && (
        <section id="spacing">
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
        )}

        {/* Icons */}
        {filterSection("icons") && (
        <section id="icons">
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
        )}

        {/* CSS Custom Classes */}
        {filterSection("css-classes") && (
        <section id="css-classes">
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
        )}

        {/* Mobile UI Patterns Section */}
        {filterSection("mobile-patterns") && (
        <section id="mobile-patterns">
          <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">Mobile UI Patterns</h2>
          <p className="text-muted-foreground mb-6">
            Consistent patterns for mobile interfaces to ensure unified user experience.
          </p>
          
          <div className="grid gap-6">
            {/* Button Placement Rules */}
            <Card className="trading-card p-4 md:p-6">
              <h3 className="text-sm font-medium mb-4">Button Placement Rules</h3>
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">1. Card Actions</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Primary action buttons in cards should be right-aligned.
                  </p>
                  <div className="border border-border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">Card Title</p>
                        <p className="text-sm text-muted-foreground">Description text</p>
                      </div>
                      <Button size="sm" className="btn-primary">Edit</Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">2. Drawer Actions</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Primary actions full-width, secondary actions can be side-by-side.
                  </p>
                  <div className="border border-border rounded-lg p-3 space-y-2">
                    <Button className="w-full btn-primary">Confirm</Button>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">Cancel</Button>
                      <Button variant="destructive" className="flex-1">Delete</Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">3. Item with Actions</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    When content is complex, put action button below content, right-aligned.
                  </p>
                  <div className="border border-border rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">🦊</div>
                      <div className="flex-1">
                        <p className="font-mono text-sm">0x1234...5678</p>
                        <p className="text-xs text-muted-foreground">Ethereum Mainnet</p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </div>
                  </div>
                </div>
              </div>
              <CodePreview 
                code="// Card: justify-between | Drawer: w-full | Item: mt-3 flex justify-end" 
                id="mobile-button-placement" 
              />
            </Card>

            {/* MobileDrawer Usage */}
            <Card className="trading-card p-4 md:p-6">
              <h3 className="text-sm font-medium mb-4">MobileDrawer Component</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Use MobileDrawer for all bottom sheets on mobile. It includes drag handle, safe area padding, and consistent styling.
              </p>
              <div className="space-y-3">
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">Basic Usage</p>
                  <code className="text-xs text-muted-foreground block">
                    {`<MobileDrawer open={open} onOpenChange={setOpen} title="Title">`}
                  </code>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">With List Items</p>
                  <code className="text-xs text-muted-foreground block whitespace-pre-wrap">
{`<MobileDrawerList>
  <MobileDrawerListItem icon={User} label="Profile" onClick={...} />
  <MobileDrawerListItem icon={Settings} label="Settings" onClick={...} />
</MobileDrawerList>`}
                  </code>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">With Actions</p>
                  <code className="text-xs text-muted-foreground block whitespace-pre-wrap">
{`<MobileDrawerActions>
  <Button className="w-full">Confirm</Button>
</MobileDrawerActions>`}
                  </code>
                </div>
              </div>
            </Card>

            {/* Spacing Guidelines */}
            <Card className="trading-card p-4 md:p-6">
              <h3 className="text-sm font-medium mb-4">Mobile Spacing</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm">Page padding</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">px-4</code>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm">Card padding</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">p-4</code>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm">Section gap</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">space-y-4</code>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm">Bottom nav safe area</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">pb-safe (5rem)</code>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm">Drawer safe area</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">pb-safe (auto)</code>
                </div>
              </div>
            </Card>
          </div>
        </section>
        )}

        {/* Toast & Notifications Section */}
        {filterSection("toast-notifications") && (
        <section id="toast-notifications">
          <h2 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-2">Toast & Notifications</h2>
          <p className="text-muted-foreground mb-6">
            使用 Sonner 库实现 Toast 通知。位置固定在屏幕顶部中央。
          </p>
          
          <div className="grid gap-6">
            {/* Toast Types */}
            <Card className="trading-card p-4 md:p-6">
              <h3 className="text-sm font-medium mb-4">Toast Types</h3>
              <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
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
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm font-medium mb-3">Usage</p>
                  <code className="text-xs text-muted-foreground block whitespace-pre-wrap">
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
            </Card>

            {/* Toast with Actions */}
            <Card className="trading-card p-4 md:p-6">
              <h3 className="text-sm font-medium mb-4">Toast with Actions</h3>
              <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
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
                  <code className="text-xs text-muted-foreground block whitespace-pre-wrap">
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
            </Card>

            {/* When to Use */}
            <Card className="trading-card p-4 md:p-6">
              <h3 className="text-sm font-medium mb-4">Usage Guidelines</h3>
              <div className="space-y-4">
                <div className="bg-trading-green/10 border border-trading-green/30 rounded-xl p-4">
                  <p className="text-sm font-medium text-trading-green mb-2">✓ 使用 Toast 的场景</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>操作成功反馈（保存、删除、更新）</li>
                    <li>非阻塞性错误提示</li>
                    <li>短暂的状态通知</li>
                    <li>可撤销操作的确认</li>
                  </ul>
                </div>
                <div className="bg-trading-red/10 border border-trading-red/30 rounded-xl p-4">
                  <p className="text-sm font-medium text-trading-red mb-2">✗ 不使用 Toast 的场景</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>需要用户确认的重要操作（用 Dialog）</li>
                    <li>表单验证错误（用 inline error）</li>
                    <li>需要持久显示的信息（用 Alert）</li>
                    <li>复杂的多步骤反馈</li>
                  </ul>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">Message 规范</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 简短明确，不超过一行</li>
                    <li>• 使用动词开头描述结果</li>
                    <li>• Success: "Saved", "Updated", "Deleted"</li>
                    <li>• Error: "Failed to save", "Unable to connect"</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </section>
        )}

        {/* Mobile Header Section */}
        {filterSection("mobile-header") && (
        <section id="mobile-header" className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-1 bg-trading-purple rounded-full" />
            <h2 className={`font-semibold ${isMobile ? "text-lg" : "text-xl"}`}>Mobile Header 设计规范</h2>
          </div>
          <div className="grid gap-4">
            {/* Overview */}
            <Card className="p-6">
              <h3 className="text-base font-medium mb-4">概述</h3>
              <p className="text-sm text-muted-foreground mb-4">
                MobileHeader 是统一的移动端头部组件，用于<strong>功能型页面</strong>。它提供一致的导航体验，包括返回按钮、Logo、标题、和操作按钮。
              </p>
              <div className="bg-muted/30 rounded-xl p-4">
                <code className="text-xs font-mono text-muted-foreground">
                  import {"{ MobileHeader }"} from "@/components/MobileHeader";
                </code>
              </div>
            </Card>

            {/* Page Type Classification */}
            <Card className="p-6 border-trading-yellow/30 bg-trading-yellow/5">
              <h3 className="text-base font-medium mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-trading-yellow" />
                页面类型分类 (重要)
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-trading-green/10 border border-trading-green/30 rounded-xl p-4">
                  <p className="text-sm font-medium text-trading-green mb-2">✓ 使用 MobileHeader 的页面</p>
                  <p className="text-xs text-muted-foreground mb-2">功能型页面 - 标准化导航体验</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Events 列表页 (/events)</li>
                    <li>Resolved 列表页 (/resolved)</li>
                    <li>Trade 页面 (/trade, /trade/order)</li>
                    <li>Portfolio 页面 (/portfolio)</li>
                    <li>Settings 页面 (/settings)</li>
                    <li>Wallet 页面 (/wallet)</li>
                    <li>Event Detail 页面</li>
                  </ul>
                </div>
                <div className="bg-trading-red/10 border border-trading-red/30 rounded-xl p-4">
                  <p className="text-sm font-medium text-trading-red mb-2">✗ 不使用 MobileHeader 的页面</p>
                  <p className="text-xs text-muted-foreground mb-2">运营/营销型页面 - 自定义视觉设计</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Leaderboard 页面 (/leaderboard)</li>
                    <li>Landing/营销页面</li>
                    <li>活动推广页面</li>
                    <li>任何需要自定义Hero设计的页面</li>
                  </ul>
                  <p className="text-xs text-trading-yellow mt-3 p-2 bg-trading-yellow/10 rounded">
                    ⚠️ 这些页面有独特的视觉设计，应自己实现header
                  </p>
                </div>
              </div>
            </Card>

            {/* Logo Rules */}
            <Card className="p-6">
              <h3 className="text-base font-medium mb-4">Logo 显示规则</h3>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>原则：仅底部导航主入口页显示Logo</strong>，二级页面不显示Logo以保持标题居中。
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-trading-green/10 border border-trading-green/30 rounded-xl p-4">
                  <p className="text-sm font-medium text-trading-green mb-2">✓ 显示 Logo (主入口页)</p>
                  <p className="text-xs text-muted-foreground mb-2">底部导航直接进入，无返回按钮</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Home 首页 (/) - rightContent: 图标按钮</li>
                    <li>Events 列表页 (/events) - rightContent: 状态下拉</li>
                    <li>Resolved 列表页 (/resolved) - rightContent: 状态下拉</li>
                    <li>Portfolio 页面 (/portfolio) - rightContent: Tab下拉</li>
                  </ul>
                </div>
                <div className="bg-trading-red/10 border border-trading-red/30 rounded-xl p-4">
                  <p className="text-sm font-medium text-trading-red mb-2">✗ 不显示 Logo (二级页面)</p>
                  <p className="text-xs text-muted-foreground mb-2">有返回按钮，标题居中</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Trade 页面 (/trade, /trade/order)</li>
                    <li>Order Preview 页面 (/order-preview)</li>
                    <li>Wallet 页面 (/wallet)</li>
                    <li>Settings 页面 (/settings)</li>
                    <li>Event Detail 页面</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Right Content Rules */}
            <Card className="p-6">
              <h3 className="text-base font-medium mb-4">rightContent 规则 (主入口页专用)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                主入口页使用 <code className="bg-muted px-1 py-0.5 rounded text-xs">rightContent</code> 放置右侧功能元素，不同页面有不同用途：
              </p>
              <div className="space-y-3">
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">图标按钮组</p>
                  <p className="text-xs text-muted-foreground mb-2">适用：Home 首页</p>
                  <code className="text-xs font-mono text-muted-foreground block">
                    rightContent={"{<div className=\"flex items-center gap-1\">"}
                    <br />{"  <Button variant=\"ghost\" size=\"icon\">...</Button>"}
                    <br />{"</div>}"}
                  </code>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">状态/Tab 下拉选择器</p>
                  <p className="text-xs text-muted-foreground mb-2">适用：Events, Resolved, Portfolio</p>
                  <code className="text-xs font-mono text-muted-foreground block">
                    rightContent={"{<MobileStatusDropdown ... />}"}
                    <br />或
                    <br />rightContent={"{<PortfolioTabDropdown ... />}"}
                  </code>
                </div>
              </div>
            </Card>

            {/* Back Button Rules */}
            <Card className="p-6">
              <h3 className="text-base font-medium mb-4">返回按钮规则</h3>
              <div className="space-y-3">
                <div className="bg-trading-red/10 border border-trading-red/30 rounded-xl p-4">
                  <p className="text-sm font-medium text-trading-red mb-2">⚠️ BottomNav 入口页永远不显示返回键</p>
                  <p className="text-xs text-muted-foreground mb-2">无论通过何种方式导航到这些页面，都不应显示返回按钮</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Home 首页 (/)</li>
                    <li>Events 列表页 (/events)</li>
                    <li>Leaderboard 排行榜 (/leaderboard)</li>
                    <li>Trade 交易页 (/trade)</li>
                    <li>Portfolio 我的页 (/portfolio)</li>
                  </ul>
                  <p className="text-xs text-primary mt-2 font-mono">
                    代码实现: MobileHeader 自动检测 BOTTOM_NAV_ROUTES
                  </p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">二级页面 - 自动检测 (默认行为)</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• navigationType === "PUSH" → 显示返回按钮</li>
                    <li>• navigationType === "POP" / "REPLACE" → 隐藏返回按钮</li>
                  </ul>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">强制覆盖 (特殊场景)</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• showBack={"{true}"} → 强制显示</li>
                    <li>• showBack={"{false}"} → 强制隐藏</li>
                    <li>• backTo="/path" → 自定义返回路径</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Title Rules */}
            <Card className="p-6">
              <h3 className="text-base font-medium mb-4">标题布局规则</h3>
              <div className="space-y-3">
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">基本规则</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 标题居中显示</li>
                    <li>• 最多显示 2 行 (line-clamp-2)</li>
                    <li>• 超长标题末尾显示省略号</li>
                  </ul>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">可点击标题</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 传入 onTitleClick 时显示下拉箭头</li>
                    <li>• 用于 Trade 页面的 Event 选择器</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Stats Row */}
            <Card className="p-6">
              <h3 className="text-base font-medium mb-4">统计信息行 (Trade 页面专用)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                当存在统计数据时，会在标题下方显示独立的统计信息行：
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="bg-trading-red/10 border border-trading-red/30 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-trading-red rounded-full" />
                    <span className="text-sm font-medium">Ends in</span>
                  </div>
                  <p className="text-xs text-muted-foreground">倒计时 (endTime prop)</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="text-sm font-medium">Tweets</span>
                  </div>
                  <p className="text-xs text-muted-foreground">推文计数 (tweetCount prop)</p>
                </div>
                <div className="bg-trading-green/10 border border-trading-green/30 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-trading-green rounded-full" />
                    <span className="text-sm font-medium">Price</span>
                  </div>
                  <p className="text-xs text-muted-foreground">实时价格 (currentPrice prop)</p>
                </div>
              </div>
              <div className="mt-4 bg-primary/10 border border-primary/30 rounded-xl p-4">
                <p className="text-sm font-medium text-primary mb-2">📌 核心规则：头部只显示一个最重要的值</p>
                <p className="text-xs text-muted-foreground mb-2">
                  每种实时数据在头部统计栏只展示一个核心值，其他详细数据放在 Popup 中：
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li><strong>Price 价格</strong>：只显示当前价格，24h 变化百分比放在 Popup</li>
                  <li><strong>Tweets 推文</strong>：只显示当前计数，统计周期等放在 Popup</li>
                  <li><strong>比分/其他</strong>：只显示最关键数值，详情放在 Popup</li>
                </ul>
                <p className="text-xs text-primary/80 mt-2 italic">
                  目的：保持头部简洁，避免信息过载，用户点击可查看详情
                </p>
              </div>
            </Card>

            {/* Action Buttons */}
            <Card className="p-6">
              <h3 className="text-base font-medium mb-4">右侧操作按钮</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">showActions={"{true}"}</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 显示收藏按钮 (Heart)</li>
                    <li>• 显示分享按钮 (Share2)</li>
                    <li>• 需配合 isFavorite, onFavoriteToggle</li>
                  </ul>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">rightContent</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 自定义右侧内容</li>
                    <li>• 会覆盖 showActions</li>
                    <li>• 用于状态下拉菜单等</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Usage Examples */}
            <Card className="p-6">
              <h3 className="text-base font-medium mb-4">使用示例</h3>
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">基础用法 (Events 页面)</p>
                  <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`<MobileHeader 
  showLogo 
  rightContent={<MobileStatusDropdown />} 
/>`}
                  </pre>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">Trade 页面</p>
                  <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`<MobileHeader 
  title={selectedEvent.name}
  endTime={selectedEvent.endTime}
  showActions
  showBack={true}
  backTo={backTo}
  showLogo={false}
  tweetCount={selectedEvent.tweetCount}
  currentPrice={selectedEvent.currentPrice}
  priceChange24h={selectedEvent.priceChange24h}
  onTitleClick={() => setEventSheetOpen(true)}
  isFavorite={favorites.has(selectedEvent.id)}
  onFavoriteToggle={() => toggleFavorite(selectedEvent.id)}
/>`}
                  </pre>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">详情页面</p>
                  <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`<MobileHeader 
  title="Event Details"
  showLogo={false}
/>`}
                  </pre>
                </div>
              </div>
            </Card>

            {/* Props Reference */}
            <Card className="p-6">
              <h3 className="text-base font-medium mb-4">Props 参考</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 font-medium">Prop</th>
                      <th className="text-left py-2 px-2 font-medium">Type</th>
                      <th className="text-left py-2 px-2 font-medium">Default</th>
                      <th className="text-left py-2 px-2 font-medium">说明</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 font-mono text-xs">title</td>
                      <td className="py-2 px-2">string</td>
                      <td className="py-2 px-2">-</td>
                      <td className="py-2 px-2">标题文本</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 font-mono text-xs">showLogo</td>
                      <td className="py-2 px-2">boolean</td>
                      <td className="py-2 px-2">true</td>
                      <td className="py-2 px-2">是否显示 Logo</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 font-mono text-xs">showBack</td>
                      <td className="py-2 px-2">boolean</td>
                      <td className="py-2 px-2">auto</td>
                      <td className="py-2 px-2">强制显示/隐藏返回按钮</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 font-mono text-xs">backTo</td>
                      <td className="py-2 px-2">string</td>
                      <td className="py-2 px-2">-</td>
                      <td className="py-2 px-2">自定义返回路径</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 font-mono text-xs">showActions</td>
                      <td className="py-2 px-2">boolean</td>
                      <td className="py-2 px-2">false</td>
                      <td className="py-2 px-2">显示收藏/分享按钮</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 font-mono text-xs">rightContent</td>
                      <td className="py-2 px-2">ReactNode</td>
                      <td className="py-2 px-2">-</td>
                      <td className="py-2 px-2">自定义右侧内容</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 font-mono text-xs">endTime</td>
                      <td className="py-2 px-2">Date</td>
                      <td className="py-2 px-2">-</td>
                      <td className="py-2 px-2">倒计时结束时间</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 font-mono text-xs">tweetCount</td>
                      <td className="py-2 px-2">number</td>
                      <td className="py-2 px-2">-</td>
                      <td className="py-2 px-2">推文计数</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 font-mono text-xs">currentPrice</td>
                      <td className="py-2 px-2">string</td>
                      <td className="py-2 px-2">-</td>
                      <td className="py-2 px-2">当前价格</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 font-mono text-xs">onTitleClick</td>
                      <td className="py-2 px-2">function</td>
                      <td className="py-2 px-2">-</td>
                      <td className="py-2 px-2">标题点击回调</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-2 font-mono text-xs">isFavorite</td>
                      <td className="py-2 px-2">boolean</td>
                      <td className="py-2 px-2">false</td>
                      <td className="py-2 px-2">是否已收藏</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 font-mono text-xs">onFavoriteToggle</td>
                      <td className="py-2 px-2">function</td>
                      <td className="py-2 px-2">-</td>
                      <td className="py-2 px-2">收藏切换回调</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </section>
        )}
      </main>
    </div>
  );
};

export default StyleGuide;
