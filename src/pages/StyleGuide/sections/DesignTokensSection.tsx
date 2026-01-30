import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Search, Home, Settings, User, Bell, Menu, ChevronRight, X, Plus, Minus, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, ExternalLink, Download, Upload, Trash2, Edit, Eye, EyeOff, Lock, Unlock, Star, Heart, Share2, Filter, RefreshCw, MoreHorizontal, MoreVertical, Calendar, Clock, MapPin, Phone, Mail, Link, Image, File, Folder, Camera, Mic, Video, Volume2, VolumeX, Play, Pause, SkipBack, SkipForward, Maximize, Minimize, ZoomIn, ZoomOut, RotateCw, RotateCcw, Undo, Redo, Copy as CopyIcon, Clipboard, Check as CheckIcon, AlertCircle, AlertTriangle, Info, HelpCircle, XCircle, CheckCircle2, Loader2, TrendingUp, TrendingDown, BarChart2, PieChart, Activity, Wallet, CreditCard, DollarSign, Percent, Hash, AtSign, Globe, Wifi, WifiOff, Battery, BatteryCharging, Sun, Moon, Cloud, Zap } from "lucide-react";
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

      {/* Icons */}
      <SectionWrapper 
        id="icons" 
        title="Lucide Icons" 
        platform="shared"
        description="Icon library using lucide-react - tree-shakable SVG icons"
      >
        <div className="space-y-6">
          {/* Usage Guide */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Icon Usage</CardTitle>
              <CardDescription>Import icons individually for tree-shaking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodePreview 
                code={`import { Camera, Settings, Bell } from 'lucide-react';

// Basic usage
<Camera />

// With props
<Camera color="red" size={48} strokeWidth={1.5} />

// With Tailwind classes
<Camera className="h-6 w-6 text-primary" />`}
              />
              
              {/* Props Table */}
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Available Props</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-muted-foreground font-medium">Prop</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Type</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Default</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      <tr><td className="py-2 font-mono">size</td><td className="py-2">number</td><td className="py-2 text-muted-foreground">24</td></tr>
                      <tr><td className="py-2 font-mono">color</td><td className="py-2">string</td><td className="py-2 text-muted-foreground">currentColor</td></tr>
                      <tr><td className="py-2 font-mono">strokeWidth</td><td className="py-2">number</td><td className="py-2 text-muted-foreground">2</td></tr>
                      <tr><td className="py-2 font-mono">absoluteStrokeWidth</td><td className="py-2">boolean</td><td className="py-2 text-muted-foreground">false</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Icon Sizes */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Icon Sizes</CardTitle>
              <CardDescription>Recommended size scale for different contexts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-4 ${isMobile ? "grid-cols-2" : "grid-cols-5"}`}>
                {[
                  { size: "h-3 w-3", label: "12px", usage: "Inline badges" },
                  { size: "h-4 w-4", label: "16px", usage: "Button icons" },
                  { size: "h-5 w-5", label: "20px", usage: "List items" },
                  { size: "h-6 w-6", label: "24px", usage: "Navigation" },
                  { size: "h-8 w-8", label: "32px", usage: "Empty states" },
                ].map(({ size, label, usage }) => (
                  <div key={size} className="p-4 bg-muted/20 rounded-lg text-center">
                    <Bell className={`${size} mx-auto mb-2`} />
                    <code className="text-xs block">{size}</code>
                    <p className="text-[10px] text-muted-foreground mt-1">{usage}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Icons by Category */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Common Icons by Category</CardTitle>
              <CardDescription>Frequently used icons organized by function</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Navigation */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Navigation</h4>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: Home, name: "Home" },
                    { icon: Search, name: "Search" },
                    { icon: Menu, name: "Menu" },
                    { icon: Settings, name: "Settings" },
                    { icon: User, name: "User" },
                    { icon: Bell, name: "Bell" },
                    { icon: ChevronRight, name: "ChevronRight" },
                    { icon: ArrowLeft, name: "ArrowLeft" },
                    { icon: ExternalLink, name: "ExternalLink" },
                  ].map(({ icon: Icon, name }) => (
                    <div key={name} className="flex flex-col items-center gap-1 p-2 hover:bg-muted/30 rounded-lg cursor-pointer group" onClick={() => { navigator.clipboard.writeText(name); toast.success(`Copied: ${name}`); }}>
                      <Icon className="h-5 w-5" />
                      <span className="text-[10px] text-muted-foreground group-hover:text-foreground">{name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Actions</h4>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: Plus, name: "Plus" },
                    { icon: Minus, name: "Minus" },
                    { icon: X, name: "X" },
                    { icon: Edit, name: "Edit" },
                    { icon: Trash2, name: "Trash2" },
                    { icon: CopyIcon, name: "Copy" },
                    { icon: Download, name: "Download" },
                    { icon: Upload, name: "Upload" },
                    { icon: Share2, name: "Share2" },
                    { icon: RefreshCw, name: "RefreshCw" },
                    { icon: Filter, name: "Filter" },
                    { icon: MoreHorizontal, name: "MoreHorizontal" },
                  ].map(({ icon: Icon, name }) => (
                    <div key={name} className="flex flex-col items-center gap-1 p-2 hover:bg-muted/30 rounded-lg cursor-pointer group" onClick={() => { navigator.clipboard.writeText(name); toast.success(`Copied: ${name}`); }}>
                      <Icon className="h-5 w-5" />
                      <span className="text-[10px] text-muted-foreground group-hover:text-foreground">{name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Feedback */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Status & Feedback</h4>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: CheckCircle2, name: "CheckCircle2", color: "text-trading-green" },
                    { icon: XCircle, name: "XCircle", color: "text-trading-red" },
                    { icon: AlertCircle, name: "AlertCircle", color: "text-trading-yellow" },
                    { icon: AlertTriangle, name: "AlertTriangle", color: "text-trading-yellow" },
                    { icon: Info, name: "Info", color: "text-primary" },
                    { icon: HelpCircle, name: "HelpCircle", color: "text-muted-foreground" },
                    { icon: Loader2, name: "Loader2", color: "text-trading-yellow" },
                    { icon: CheckIcon, name: "Check", color: "text-trading-green" },
                  ].map(({ icon: Icon, name, color }) => (
                    <div key={name} className="flex flex-col items-center gap-1 p-2 hover:bg-muted/30 rounded-lg cursor-pointer group" onClick={() => { navigator.clipboard.writeText(name); toast.success(`Copied: ${name}`); }}>
                      <Icon className={`h-5 w-5 ${color}`} />
                      <span className="text-[10px] text-muted-foreground group-hover:text-foreground">{name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trading */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Trading & Finance</h4>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: TrendingUp, name: "TrendingUp", color: "text-trading-green" },
                    { icon: TrendingDown, name: "TrendingDown", color: "text-trading-red" },
                    { icon: BarChart2, name: "BarChart2" },
                    { icon: PieChart, name: "PieChart" },
                    { icon: Activity, name: "Activity" },
                    { icon: Wallet, name: "Wallet" },
                    { icon: CreditCard, name: "CreditCard" },
                    { icon: DollarSign, name: "DollarSign" },
                    { icon: Percent, name: "Percent" },
                  ].map(({ icon: Icon, name, color }) => (
                    <div key={name} className="flex flex-col items-center gap-1 p-2 hover:bg-muted/30 rounded-lg cursor-pointer group" onClick={() => { navigator.clipboard.writeText(name); toast.success(`Copied: ${name}`); }}>
                      <Icon className={`h-5 w-5 ${color || ""}`} />
                      <span className="text-[10px] text-muted-foreground group-hover:text-foreground">{name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visibility & Security */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Visibility & Security</h4>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: Eye, name: "Eye" },
                    { icon: EyeOff, name: "EyeOff" },
                    { icon: Lock, name: "Lock" },
                    { icon: Unlock, name: "Unlock" },
                  ].map(({ icon: Icon, name }) => (
                    <div key={name} className="flex flex-col items-center gap-1 p-2 hover:bg-muted/30 rounded-lg cursor-pointer group" onClick={() => { navigator.clipboard.writeText(name); toast.success(`Copied: ${name}`); }}>
                      <Icon className="h-5 w-5" />
                      <span className="text-[10px] text-muted-foreground group-hover:text-foreground">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Icon with Button */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Icons in Buttons</CardTitle>
              <CardDescription>Common icon + button patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add</Button>
                <Button size="sm" variant="secondary"><Download className="h-4 w-4 mr-1" />Download</Button>
                <Button size="sm" variant="outline"><Settings className="h-4 w-4 mr-1" />Settings</Button>
                <Button size="sm" variant="destructive"><Trash2 className="h-4 w-4 mr-1" />Delete</Button>
                <Button size="icon" variant="ghost"><MoreVertical className="h-4 w-4" /></Button>
                <Button size="icon" variant="outline"><RefreshCw className="h-4 w-4" /></Button>
              </div>
              <CodePreview 
                code={`<Button size="sm">
  <Plus className="h-4 w-4 mr-1" />
  Add
</Button>

<Button size="icon" variant="ghost">
  <MoreVertical className="h-4 w-4" />
</Button>`}
              />
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>

      {/* Animations */}
      <SectionWrapper 
        id="animations" 
        title="Animations" 
        platform="shared"
        description="CSS keyframe animations defined in tailwind.config.ts"
      >
        <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
          {/* Fade Animations */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Fade Animations</CardTitle>
              <CardDescription>Smooth opacity + transform transitions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="w-12 h-12 bg-primary rounded-lg mx-auto mb-2 animate-fade-in" />
                  <code className="text-xs">animate-fade-in</code>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="w-12 h-12 bg-primary rounded-lg mx-auto mb-2 animate-[fade-in_0.3s_ease-out_infinite_alternate]" />
                  <code className="text-xs">fade-in loop</code>
                </div>
              </div>
              <CodePreview 
                code={`// Fade in with upward motion
<div className="animate-fade-in">Content</div>

// Custom duration
<div className="animate-[fade-in_0.5s_ease-out]">Content</div>`}
              />
            </CardContent>
          </Card>

          {/* Scale Animations */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Scale Animations</CardTitle>
              <CardDescription>Scale + opacity for emphasis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="w-12 h-12 bg-trading-purple rounded-lg mx-auto mb-2 animate-scale-in" />
                  <code className="text-xs">animate-scale-in</code>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="w-12 h-12 bg-trading-purple rounded-lg mx-auto mb-2 animate-[scale-in_0.2s_ease-out_infinite_alternate]" />
                  <code className="text-xs">scale-in loop</code>
                </div>
              </div>
              <CodePreview 
                code={`<div className="animate-scale-in">Modal</div>
<div className="animate-enter">Combined fade+scale</div>`}
              />
            </CardContent>
          </Card>

          {/* Slide Animations */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Slide Animations</CardTitle>
              <CardDescription>For sidebars, drawers, sheets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg overflow-hidden">
                <div className="w-16 h-16 bg-trading-green rounded-lg animate-[slide-in-right_0.5s_ease-out_infinite_alternate]" />
              </div>
              <CodePreview 
                code={`<Sheet>
  <SheetContent className="animate-slide-in-right">
    Sidebar content
  </SheetContent>
</Sheet>`}
              />
            </CardContent>
          </Card>

          {/* Accordion Animations */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Accordion Animations</CardTitle>
              <CardDescription>Height + opacity for expandable content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-xs text-muted-foreground">
                Used automatically by Radix Accordion component
              </div>
              <CodePreview 
                code={`// Applied automatically by shadcn Accordion
<AccordionContent>
  Animates with accordion-down/up
</AccordionContent>`}
              />
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>

      {/* Custom CSS Classes */}
      <SectionWrapper 
        id="custom-classes" 
        title="Custom CSS Classes" 
        platform="shared"
        description="Utility classes defined in index.css and tailwind.config.ts"
      >
        <div className="space-y-6">
          {/* Interactive Effects */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Interactive Effects</CardTitle>
              <CardDescription>Hover and interaction utilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
                {/* Hover Scale */}
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-3 hover-scale cursor-pointer" />
                  <code className="text-xs">.hover-scale</code>
                  <p className="text-xs text-muted-foreground mt-1">Hover to see effect</p>
                </div>

                {/* Story Link */}
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <a href="#" className="story-link text-primary font-medium" onClick={(e) => e.preventDefault()}>
                    Hover me
                  </a>
                  <div className="mt-3">
                    <code className="text-xs">.story-link</code>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Underline animation</p>
                </div>

                {/* Pulse */}
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="w-4 h-4 bg-trading-red rounded-full mx-auto mb-3 pulse" />
                  <code className="text-xs">.pulse</code>
                  <p className="text-xs text-muted-foreground mt-1">Attention indicator</p>
                </div>
              </div>
              <CodePreview 
                code={`// Scale on hover
<Card className="hover-scale">Hover me</Card>

// Animated underline link
<a className="story-link">Learn more</a>

// Pulsing indicator
<span className="pulse bg-red-500 rounded-full" />`}
              />
            </CardContent>
          </Card>

          {/* Trading Card Style */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Trading Card</CardTitle>
              <CardDescription>Gradient background with proper borders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Default Card</p>
                  <Card className="p-4">
                    <p className="text-sm">Standard card styling</p>
                  </Card>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Trading Card</p>
                  <Card className="trading-card p-4">
                    <p className="text-sm">Enhanced trading card</p>
                  </Card>
                </div>
              </div>
              <CodePreview 
                code={`<Card className="trading-card">
  <CardContent>
    Trading-specific card with gradient
  </CardContent>
</Card>`}
              />
            </CardContent>
          </Card>

          {/* Price Flash Effects */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Price Flash Effects</CardTitle>
              <CardDescription>Used in OrderBook and TradesHistory for real-time updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-4 ${isMobile ? "grid-cols-2" : "grid-cols-4"}`}>
                <div className="p-3 bg-trading-green/20 rounded-lg text-center border border-trading-green/30">
                  <span className="text-trading-green font-mono">$1,234.56</span>
                  <p className="text-xs text-muted-foreground mt-1">Price Up</p>
                </div>
                <div className="p-3 bg-trading-red/20 rounded-lg text-center border border-trading-red/30">
                  <span className="text-trading-red font-mono">$1,234.56</span>
                  <p className="text-xs text-muted-foreground mt-1">Price Down</p>
                </div>
                <div className="p-3 rounded-lg text-center border border-border">
                  <span className="text-foreground font-mono">$1,234.56</span>
                  <p className="text-xs text-muted-foreground mt-1">Neutral</p>
                </div>
                <div className="p-3 bg-trading-yellow/20 rounded-lg text-center border border-trading-yellow/30">
                  <span className="text-trading-yellow font-mono">Pending</span>
                  <p className="text-xs text-muted-foreground mt-1">Warning</p>
                </div>
              </div>
              <CodePreview 
                code={`// Price increase flash
<span className="bg-trading-green/20 text-trading-green">
  $1,234.56
</span>

// Price decrease flash
<span className="bg-trading-red/20 text-trading-red">
  $1,234.56
</span>`}
              />
            </CardContent>
          </Card>

          {/* Scrollbar Utilities */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Scrollbar Utilities</CardTitle>
              <CardDescription>Custom scrollbar styling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Hidden Scrollbar</p>
                  <div className="h-24 overflow-auto scrollbar-hide bg-muted/30 rounded-lg p-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <p key={i} className="text-xs py-1">Scrollable content line {i + 1}</p>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Default Scrollbar</p>
                  <div className="h-24 overflow-auto bg-muted/30 rounded-lg p-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <p key={i} className="text-xs py-1">Scrollable content line {i + 1}</p>
                    ))}
                  </div>
                </div>
              </div>
              <CodePreview 
                code={`// Hide scrollbar but keep functionality
<div className="overflow-auto scrollbar-hide">
  Scrollable content
</div>`}
              />
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>
    </div>
  );
};
