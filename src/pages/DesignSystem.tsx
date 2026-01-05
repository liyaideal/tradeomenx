import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  Settings, 
  ChevronRight, 
  Star,
  Zap,
  Check,
  X,
  AlertTriangle,
  Info
} from "lucide-react";

const DesignSystem = () => {
  const [inputValue, setInputValue] = useState("");

  // Color token groups
  const primaryColors = [
    { name: "primary", var: "--primary", desc: "主色调" },
    { name: "primary-lighter", var: "--primary-lighter", desc: "悬停状态" },
    { name: "primary-darker", var: "--primary-darker", desc: "激活状态" },
  ];

  const functionalColors = [
    { name: "success", var: "--success", desc: "成功/买入" },
    { name: "success-light", var: "--success-light", desc: "成功浅色" },
    { name: "error", var: "--error", desc: "错误/卖出" },
    { name: "error-light", var: "--error-light", desc: "错误浅色" },
    { name: "warning", var: "--warning", desc: "警告" },
    { name: "warning-light", var: "--warning-light", desc: "警告浅色" },
    { name: "info", var: "--info", desc: "信息" },
    { name: "info-light", var: "--info-light", desc: "信息浅色" },
  ];

  const accentColors = [
    { name: "accent-cyan", var: "--accent-cyan", desc: "青色" },
    { name: "accent-cyan-light", var: "--accent-cyan-light", desc: "青色浅" },
    { name: "accent-pink", var: "--accent-pink", desc: "粉色" },
    { name: "accent-pink-light", var: "--accent-pink-light", desc: "粉色浅" },
    { name: "accent-amber", var: "--accent-amber", desc: "琥珀色" },
    { name: "accent-emerald", var: "--accent-emerald", desc: "翡翠绿" },
    { name: "accent-blue", var: "--accent-blue", desc: "蓝色" },
  ];

  const textColors = [
    { name: "foreground/95", opacity: "95%", desc: "主要文字" },
    { name: "foreground/75", opacity: "75%", desc: "次要文字" },
    { name: "foreground/55", opacity: "55%", desc: "三级文字" },
    { name: "foreground/35", opacity: "35%", desc: "四级文字" },
  ];

  return (
    <div className="min-h-screen p-8 space-y-12 max-w-6xl mx-auto">
      {/* Header */}
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground/95">
          Glassmorphism Design System
        </h1>
        <p className="text-foreground/70 text-lg">
          所有颜色、组件和样式token的完整展示
        </p>
      </header>

      {/* Primary Colors */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground/95">Primary Colors 主色调</h2>
        <div className="grid grid-cols-3 gap-4">
          {primaryColors.map((color) => (
            <div key={color.name} className="glass-card p-4 space-y-3">
              <div 
                className="h-20 rounded-lg" 
                style={{ backgroundColor: `hsl(var(${color.var}))` }}
              />
              <div>
                <p className="font-medium text-foreground/95">{color.name}</p>
                <p className="text-sm text-foreground/55">{color.desc}</p>
                <code className="text-xs text-primary">{color.var}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Functional Colors */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground/95">Functional Colors 功能色</h2>
        <div className="grid grid-cols-4 gap-4">
          {functionalColors.map((color) => (
            <div key={color.name} className="glass-card-secondary p-4 space-y-3">
              <div 
                className="h-16 rounded-lg" 
                style={{ backgroundColor: `hsl(var(${color.var}))` }}
              />
              <div>
                <p className="font-medium text-foreground/95 text-sm">{color.name}</p>
                <p className="text-xs text-foreground/55">{color.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Accent Colors */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground/95">Accent Colors 强调色</h2>
        <p className="text-foreground/70">用于数据可视化和分类</p>
        <div className="flex flex-wrap gap-4">
          {accentColors.map((color) => (
            <div key={color.name} className="flex items-center gap-3 glass-card-secondary p-3 pr-5">
              <div 
                className="w-10 h-10 rounded-lg" 
                style={{ backgroundColor: `hsl(var(${color.var}))` }}
              />
              <div>
                <p className="font-medium text-foreground/95 text-sm">{color.name}</p>
                <p className="text-xs text-foreground/55">{color.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Text Colors */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground/95">Text Colors 文字颜色</h2>
        <div className="glass-card p-6 space-y-4">
          {textColors.map((color) => (
            <div key={color.name} className="flex items-center gap-4">
              <span 
                className="text-lg font-medium w-48"
                style={{ color: `hsl(var(--foreground) / ${color.opacity})` }}
              >
                Sample Text 示例文字
              </span>
              <span className="text-sm text-foreground/55">
                text-foreground/{color.opacity.replace('%', '')} - {color.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Glass Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground/95">Glass Cards 玻璃卡片</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-2">
            <h3 className="font-semibold text-foreground/95">glass-card</h3>
            <p className="text-foreground/70 text-sm">主要玻璃卡片，带紫色光晕</p>
            <code className="text-xs text-primary block">bg-white/8 backdrop-blur-xl</code>
          </div>
          <div className="glass-card-secondary p-6 space-y-2">
            <h3 className="font-semibold text-foreground/95">glass-card-secondary</h3>
            <p className="text-foreground/70 text-sm">次要玻璃元素</p>
            <code className="text-xs text-primary block">bg-white/5 backdrop-blur-lg</code>
          </div>
          <div className="glass-card-elevated p-6 space-y-2">
            <h3 className="font-semibold text-foreground/95">glass-card-elevated</h3>
            <p className="text-foreground/70 text-sm">提升层级卡片，用于模态框</p>
            <code className="text-xs text-primary block">bg-white/12 backdrop-blur-2xl</code>
          </div>
          <div className="glass-card-strong p-6 space-y-2">
            <h3 className="font-semibold text-foreground/95">glass-card-strong</h3>
            <p className="text-foreground/70 text-sm">强调区域，带主色调背景</p>
            <code className="text-xs text-primary block">bg-primary/15 backdrop-blur-lg</code>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground/95">Buttons 按钮</h2>
        
        {/* Glass Buttons */}
        <div className="glass-card p-6 space-y-6">
          <h3 className="font-medium text-foreground/95">Glass Buttons 玻璃按钮</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <button className="glass-button-primary">
              <Zap className="w-4 h-4" />
              <span>Primary Button</span>
            </button>
            <button className="glass-button-secondary">
              <Settings className="w-4 h-4" />
              <span>Secondary Button</span>
            </button>
            <button className="glass-button-icon">
              <Bell className="w-5 h-5 text-foreground/70" />
            </button>
            <button className="glass-button-icon">
              <Star className="w-5 h-5 text-foreground/70" />
            </button>
          </div>
        </div>

        {/* Trading Buttons */}
        <div className="glass-card p-6 space-y-6">
          <h3 className="font-medium text-foreground/95">Trading Buttons 交易按钮</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <button className="btn-trading-green flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span>Buy / Long</span>
            </button>
            <button className="btn-trading-red flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              <span>Sell / Short</span>
            </button>
          </div>
        </div>

        {/* Shadcn Buttons */}
        <div className="glass-card p-6 space-y-6">
          <h3 className="font-medium text-foreground/95">Shadcn UI Buttons</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>
      </section>

      {/* Tags & Badges */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground/95">Tags & Badges 标签</h2>
        <div className="glass-card p-6 space-y-6">
          <div className="space-y-3">
            <h3 className="font-medium text-foreground/95">Glass Tags</h3>
            <div className="flex flex-wrap gap-3">
              <span className="glass-tag">Default Tag</span>
              <span className="glass-tag-success">
                <Check className="w-3 h-3" />
                Success
              </span>
              <span className="glass-tag-error">
                <X className="w-3 h-3" />
                Error
              </span>
              <span className="glass-tag-warning">
                <AlertTriangle className="w-3 h-3" />
                Warning
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium text-foreground/95">Shadcn Badges</h3>
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Inputs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground/95">Inputs 输入框</h2>
        <div className="glass-card p-6 space-y-6">
          <div className="space-y-3">
            <h3 className="font-medium text-foreground/95">Glass Input</h3>
            <input 
              type="text" 
              className="glass-input max-w-md" 
              placeholder="Enter amount..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <h3 className="font-medium text-foreground/95">Shadcn Input</h3>
            <Input className="max-w-md" placeholder="Shadcn input..." />
          </div>
          <div className="space-y-3">
            <h3 className="font-medium text-foreground/95">Glass Inset</h3>
            <div className="glass-inset p-4 max-w-md">
              <p className="text-foreground/70 text-sm">Inset container for embedded content</p>
            </div>
          </div>
        </div>
      </section>

      {/* Option Chips */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground/95">Option Chips 选项芯片</h2>
        <div className="glass-card p-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <button className="option-chip option-chip-active">Active Option</button>
            <button className="option-chip option-chip-inactive">Inactive Option</button>
            <button className="option-chip option-chip-inactive">Another Option</button>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground/95">Progress 进度条</h2>
        <div className="glass-card p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-foreground/70">Glass Progress</span>
              <span className="text-primary">67%</span>
            </div>
            <div className="glass-progress">
              <div className="glass-progress-fill" style={{ width: "67%" }} />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-foreground/70">Another Example</span>
              <span className="text-primary">35%</span>
            </div>
            <div className="glass-progress">
              <div className="glass-progress-fill" style={{ width: "35%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Glow Effects */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground/95">Glow Effects 光晕效果</h2>
        <div className="grid grid-cols-5 gap-4">
          <div className="glass-card-secondary p-6 flex flex-col items-center gap-3 glow-primary">
            <div className="w-12 h-12 rounded-full bg-primary" />
            <span className="text-sm text-foreground/70">glow-primary</span>
          </div>
          <div className="glass-card-secondary p-6 flex flex-col items-center gap-3 glow-cyan">
            <div className="w-12 h-12 rounded-full bg-accent-cyan" />
            <span className="text-sm text-foreground/70">glow-cyan</span>
          </div>
          <div className="glass-card-secondary p-6 flex flex-col items-center gap-3 glow-pink">
            <div className="w-12 h-12 rounded-full bg-accent-pink" />
            <span className="text-sm text-foreground/70">glow-pink</span>
          </div>
          <div className="glass-card-secondary p-6 flex flex-col items-center gap-3 glow-success">
            <div className="w-12 h-12 rounded-full bg-success" />
            <span className="text-sm text-foreground/70">glow-success</span>
          </div>
          <div className="glass-card-secondary p-6 flex flex-col items-center gap-3 glow-error">
            <div className="w-12 h-12 rounded-full bg-error" />
            <span className="text-sm text-foreground/70">glow-error</span>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground/95">Typography 字体排版</h2>
        <div className="glass-card p-6 space-y-4">
          <div className="space-y-1">
            <span className="text-xs text-foreground/55">Display - text-5xl font-semibold</span>
            <p className="text-5xl font-semibold text-foreground/95">48px Display</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-foreground/55">Headline - text-4xl font-semibold</span>
            <p className="text-4xl font-semibold text-foreground/95">36px Headline</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-foreground/55">Page Title - text-2xl font-semibold</span>
            <p className="text-2xl font-semibold text-foreground/95">24px Page Title</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-foreground/55">Card Title - text-base font-semibold</span>
            <p className="text-base font-semibold text-foreground/95">16px Card Title</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-foreground/55">Body Default - text-base font-normal</span>
            <p className="text-base font-normal text-foreground/95">16px Body Text</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-foreground/55">Body Small - text-sm font-normal</span>
            <p className="text-sm font-normal text-foreground/95">14px Small Text</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-foreground/55">Caption - text-xs font-normal</span>
            <p className="text-xs font-normal text-foreground/95">12px Caption</p>
          </div>
        </div>
      </section>

      {/* Shadows */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground/95">Shadows 阴影</h2>
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-glass-primary/8 p-6 rounded-xl shadow-glass-sm flex flex-col items-center gap-3">
            <span className="text-foreground/95 font-medium">shadow-glass-sm</span>
            <span className="text-xs text-foreground/55">Subtle</span>
          </div>
          <div className="bg-glass-primary/8 p-6 rounded-xl shadow-glass flex flex-col items-center gap-3">
            <span className="text-foreground/95 font-medium">shadow-glass</span>
            <span className="text-xs text-foreground/55">Standard</span>
          </div>
          <div className="bg-glass-primary/8 p-6 rounded-xl shadow-glass-lg flex flex-col items-center gap-3">
            <span className="text-foreground/95 font-medium">shadow-glass-lg</span>
            <span className="text-xs text-foreground/55">Large</span>
          </div>
          <div className="bg-glass-primary/8 p-6 rounded-xl shadow-glass-xl flex flex-col items-center gap-3">
            <span className="text-foreground/95 font-medium">shadow-glass-xl</span>
            <span className="text-xs text-foreground/55">Extra Large</span>
          </div>
        </div>
      </section>

      {/* Dividers */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground/95">Dividers 分隔线</h2>
        <div className="glass-card p-6 space-y-6">
          <div className="space-y-2">
            <span className="text-sm text-foreground/70">glass-divider (subtle)</span>
            <div className="glass-divider" />
          </div>
          <div className="space-y-2">
            <span className="text-sm text-foreground/70">glass-divider-strong</span>
            <div className="glass-divider-strong" />
          </div>
        </div>
      </section>

      {/* Border Radius */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground/95">Border Radius 圆角</h2>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 bg-primary/30 border border-primary/50 rounded-sm" />
            <span className="text-sm text-foreground/70">rounded-sm (8px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 bg-primary/30 border border-primary/50 rounded" />
            <span className="text-sm text-foreground/70">rounded (12px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 bg-primary/30 border border-primary/50 rounded-lg" />
            <span className="text-sm text-foreground/70">rounded-lg (16px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 bg-primary/30 border border-primary/50 rounded-xl" />
            <span className="text-sm text-foreground/70">rounded-xl (20px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 bg-primary/30 border border-primary/50 rounded-full" />
            <span className="text-sm text-foreground/70">rounded-full</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8">
        <p className="text-foreground/55 text-sm">
          Glassmorphism Design System v1.0 — Built with Tailwind CSS
        </p>
      </footer>
    </div>
  );
};

export default DesignSystem;
