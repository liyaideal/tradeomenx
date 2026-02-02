import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ExternalLink,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { SectionWrapper, SubSection } from "../components/SectionWrapper";
import { CodePreview } from "../components/CodePreview";
import { cn } from "@/lib/utils";

interface WalletSectionProps {
  isMobile: boolean;
}

// Status configuration
const STATUS_CONFIG: Record<string, {
  icon: typeof Clock;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  animate?: boolean;
}> = {
  pending: {
    icon: Clock,
    label: "Pending",
    color: "text-trading-yellow",
    bgColor: "bg-trading-yellow/10",
    borderColor: "border-trading-yellow/20",
  },
  processing: {
    icon: Loader2,
    label: "Processing",
    color: "text-trading-yellow",
    bgColor: "bg-trading-yellow/10",
    borderColor: "border-trading-yellow/20",
    animate: true,
  },
  completed: {
    icon: CheckCircle2,
    label: "Completed",
    color: "text-trading-green",
    bgColor: "bg-trading-green/10",
    borderColor: "border-trading-green/20",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    color: "text-trading-red",
    bgColor: "bg-trading-red/10",
    borderColor: "border-trading-red/20",
  },
  cancelled: {
    icon: AlertCircle,
    label: "Cancelled",
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
    borderColor: "border-border",
  },
};

// Explorer URLs
const EXPLORER_URLS: Record<string, string> = {
  'Ethereum': 'https://etherscan.io/tx/',
  'BNB Smart Chain (BEP20)': 'https://bscscan.com/tx/',
  'Polygon': 'https://polygonscan.com/tx/',
  'Arbitrum One': 'https://arbiscan.io/tx/',
  'Solana': 'https://solscan.io/tx/',
};

export const WalletSection = ({ isMobile }: WalletSectionProps) => {
  const [demoConfirmations, setDemoConfirmations] = useState(8);

  return (
    <div className="space-y-12">
      {/* Transaction Status Badges */}
      <SectionWrapper
        id="transaction-status"
        title="Transaction Status Badges"
        platform="shared"
        description="Consistent status indicators for deposits, withdrawals, and trades"
      >
        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="text-lg">Status Badge Variants</CardTitle>
            <CardDescription>Use these consistent status styles across all transaction types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* All Status Examples */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <div key={key} className="flex flex-col items-center gap-2 p-4 bg-muted/20 rounded-lg">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      config.bgColor
                    )}>
                      <Icon className={cn("h-5 w-5", config.color, config.animate && "animate-spin")} />
                    </div>
                    <Badge variant="outline" className={cn("text-xs", config.color, config.borderColor)}>
                      {config.label}
                    </Badge>
                    <code className="text-[10px] text-muted-foreground">{key}</code>
                  </div>
                );
              })}
            </div>

            {/* Usage Examples */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Usage in Transaction Cards</h4>
              <div className="grid gap-3">
                {/* Deposit Example */}
                <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-trading-green/20 flex items-center justify-center">
                      <ArrowDownLeft className="h-4 w-4 text-trading-green" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">+$500.00</p>
                      <p className="text-xs text-muted-foreground">Deposit • Ethereum</p>
                    </div>
                  </div>
                  <Badge className="bg-trading-green/10 text-trading-green border-trading-green/20">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                </div>

                {/* Withdraw Example */}
                <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-trading-yellow/20 flex items-center justify-center">
                      <ArrowUpRight className="h-4 w-4 text-trading-yellow" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">-$200.00</p>
                      <p className="text-xs text-muted-foreground">Withdrawal • Polygon</p>
                    </div>
                  </div>
                  <Badge className="bg-trading-yellow/10 text-trading-yellow border-trading-yellow/20">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Processing
                  </Badge>
                </div>
              </div>
            </div>

            <CodePreview 
              code={`const STATUS_CONFIG = {
  pending: { icon: Clock, color: "text-trading-yellow", bgColor: "bg-trading-yellow/10" },
  processing: { icon: Loader2, color: "text-trading-yellow", animate: true },
  completed: { icon: CheckCircle2, color: "text-trading-green" },
  failed: { icon: XCircle, color: "text-trading-red" },
};

<Badge className={cn(config.bgColor, config.color, config.borderColor)}>
  <Icon className={cn("h-3 w-3 mr-1", config.animate && "animate-spin")} />
  {config.label}
</Badge>`}
            />
          </CardContent>
        </Card>
      </SectionWrapper>

      {/* Stepper / Progress Timeline */}
      <SectionWrapper
        id="stepper-timeline"
        title="Stepper / Progress Timeline"
        platform="shared"
        description="Visual progress indicators for multi-step processes"
      >
        <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
          {/* Vertical Stepper */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Vertical Stepper</CardTitle>
              <CardDescription>Used in withdrawal flow and deposit tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {[
                  { label: "Initiated", status: "completed" },
                  { label: "Processing", status: "completed" },
                  { label: "Confirming", status: "current" },
                  { label: "Complete", status: "pending" },
                ].map((step, index, arr) => (
                  <div key={step.label} className="flex gap-3">
                    {/* Step Indicator */}
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center border-2",
                        step.status === "completed" && "bg-trading-green border-trading-green",
                        step.status === "current" && "bg-trading-yellow/20 border-trading-yellow",
                        step.status === "pending" && "bg-muted border-border"
                      )}>
                        {step.status === "completed" && <CheckCircle2 className="h-4 w-4 text-white" />}
                        {step.status === "current" && <Loader2 className="h-4 w-4 text-trading-yellow animate-spin" />}
                        {step.status === "pending" && <span className="text-xs text-muted-foreground">{index + 1}</span>}
                      </div>
                      {index < arr.length - 1 && (
                        <div className={cn(
                          "w-0.5 h-8 my-1",
                          step.status === "completed" ? "bg-trading-green" : "bg-border"
                        )} />
                      )}
                    </div>
                    {/* Step Content */}
                    <div className="pt-1.5 pb-4">
                      <p className={cn(
                        "text-sm font-medium",
                        step.status === "pending" && "text-muted-foreground"
                      )}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Block Confirmations */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Block Confirmations</CardTitle>
              <CardDescription>Progress bar for blockchain confirmations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-trading-yellow/5 border border-trading-yellow/20 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-trading-yellow animate-spin" />
                    <span className="text-sm font-medium">Confirming deposit</span>
                  </div>
                  <span className="text-xs text-muted-foreground">~2 min</span>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Block confirmations</span>
                    <span className="font-mono text-trading-yellow">{demoConfirmations}/15</span>
                  </div>
                  <Progress 
                    value={(demoConfirmations / 15) * 100} 
                    className="h-2 [&>div]:bg-trading-yellow [&>div]:animate-pulse"
                  />
                </div>
              </div>

              {/* Completed State */}
              <div className="p-4 bg-trading-green/5 border border-trading-green/20 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-trading-green" />
                    <span className="text-sm font-medium">Deposit confirmed</span>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Block confirmations</span>
                    <span className="font-mono text-trading-green">15/15</span>
                  </div>
                  <Progress value={100} className="h-2 [&>div]:bg-trading-green" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>

      {/* Blockchain Explorer Links */}
      <SectionWrapper
        id="explorer-links"
        title="Blockchain Explorer Links"
        platform="shared"
        description="Consistent styling for transaction hashes and addresses"
      >
        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="text-lg">Explorer Link Patterns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Truncated Hash */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Truncated Transaction Hash</h4>
              <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg w-fit">
                <a 
                  href="https://etherscan.io/tx/0x8f3a2b1c4d5e6f7890123456789abcdef0123456789abcdef0123456789abcd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-primary hover:underline font-mono"
                >
                  0x8f3a2b...9abcd
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <CodePreview 
                code={`const truncateTxHash = (hash: string) => \`\${hash.slice(0, 8)}...\${hash.slice(-5)}\`;

<a href={\`\${EXPLORER_URL}\${txHash}\`} target="_blank" className="text-primary font-mono">
  {truncateTxHash(txHash)}
  <ExternalLink className="h-3 w-3" />
</a>`}
              />
            </div>

            {/* Security: Color-Coded Address Display */}
            <div className="space-y-4 p-4 border border-primary/20 rounded-xl bg-primary/5">
              <div>
                <h4 className="text-sm font-semibold text-primary mb-1">🔐 Security: Color-Coded Address Display</h4>
                <p className="text-xs text-muted-foreground">
                  Alphanumeric differentiation to prevent character confusion (e.g., '6' vs 'b', '0' vs 'O')
                </p>
              </div>

              {/* Visual Example */}
              <div className="p-5 bg-card/80 border border-border/50 rounded-xl">
                <div className="font-mono text-lg leading-relaxed text-center flex flex-wrap justify-center gap-x-3 gap-y-2">
                  <span className="tracking-wide">
                    <span className="text-primary">0</span>
                    <span className="text-foreground">x</span>
                  </span>
                  {/* 742d */}
                  <span className="tracking-wide">
                    <span className="text-primary">7</span>
                    <span className="text-primary">4</span>
                    <span className="text-primary">2</span>
                    <span className="text-foreground">d</span>
                  </span>
                  {/* 35Cc */}
                  <span className="tracking-wide">
                    <span className="text-primary">3</span>
                    <span className="text-primary">5</span>
                    <span className="text-foreground">C</span>
                    <span className="text-foreground">c</span>
                  </span>
                  {/* 6634 */}
                  <span className="tracking-wide">
                    <span className="text-primary">6</span>
                    <span className="text-primary">6</span>
                    <span className="text-primary">3</span>
                    <span className="text-primary">4</span>
                  </span>
                  {/* C053 */}
                  <span className="tracking-wide">
                    <span className="text-foreground">C</span>
                    <span className="text-primary">0</span>
                    <span className="text-primary">5</span>
                    <span className="text-primary">3</span>
                  </span>
                </div>
              </div>

              {/* Color Legend */}
              <div className="flex items-center justify-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary" />
                  <span>Digits (0-9)</span>
                  <code className="text-muted-foreground">text-primary</code>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-foreground" />
                  <span>Letters (a-f)</span>
                  <code className="text-muted-foreground">text-foreground</code>
                </div>
              </div>

              {/* Why This Matters */}
              <div className="p-3 bg-trading-yellow/5 border border-trading-yellow/20 rounded-lg">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-trading-yellow">⚠️ When to use:</span>{' '}
                  Always apply this pattern in <code>FullAddressSheet</code> and any full deposit address display. 
                  Helps users verify addresses without confusing similar characters.
                </p>
              </div>

              <CodePreview 
                code={`// src/components/deposit/FullAddressSheet.tsx
{chunks.map((chunk, i) => (
  <span key={i}>
    {chunk.map((item, j) => (
      <span 
        key={j}
        className={item.isDigit ? 'text-primary' : 'text-foreground'}
      >
        {item.char}
      </span>
    ))}
  </span>
))}`}
              />
            </div>

            {/* Truncated Address */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Truncated Address (Non-Security Context)</h4>
              <p className="text-xs text-muted-foreground">For transaction history lists, truncated mono addresses are acceptable.</p>
              <div className="p-3 bg-muted/20 rounded-lg">
                <p className="text-xs font-mono text-muted-foreground break-all">
                  0x8f3a2b...9abcd
                </p>
              </div>
            </div>

            {/* Network Explorer URLs */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Supported Network Explorers</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground font-medium">Network</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Explorer URL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {Object.entries(EXPLORER_URLS).map(([network, url]) => (
                      <tr key={network}>
                        <td className="py-2">{network}</td>
                        <td className="py-2 font-mono text-muted-foreground">{url}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </SectionWrapper>

      {/* Share Poster Design System */}
      <SectionWrapper
        id="share-posters"
        title="Share Poster Design System"
        platform="shared"
        description="Visual standards for shareable image posters (deposit addresses, trade results, leaderboard rankings)"
      >
        <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
          {/* Poster Structure */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Poster Structure</CardTitle>
              <CardDescription>Common layout pattern for all share posters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-to-b from-[#1a1a2e] to-[#16162a] rounded-xl space-y-4">
                {/* Header */}
                <div className="flex items-center justify-center gap-2 pb-3 border-b border-white/10">
                  <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">Ω</span>
                  </div>
                  <span className="text-sm font-semibold text-white">OmenX</span>
                </div>
                
                {/* Content Zone */}
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-white/50 text-center">Main Content Area</p>
                  <p className="text-xs text-white/30 text-center mt-1">(QR, Stats, PnL, etc.)</p>
                </div>
                
                {/* Warning Zone */}
                <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-[10px] text-amber-400 text-center">⚠️ Warning/Info Zone</p>
                </div>
                
                {/* Footer */}
                <div className="text-center pt-2 border-t border-white/10">
                  <p className="text-[10px] text-white/30">Footer (CTA, URL, Referral)</p>
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Structure:</strong> Header → Content → Warning → Footer</p>
                <p><strong>Background:</strong> Dark gradient <code>from-[#1a1a2e] to-[#16162a]</code></p>
                <p><strong>Content Zones:</strong> <code>bg-white/5</code> with <code>border-white/10</code></p>
              </div>
            </CardContent>
          </Card>

          {/* Color Themes */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg">Theme Variants</CardTitle>
              <CardDescription>Context-aware color themes for different poster types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Win Theme */}
              <div className="p-3 bg-trading-green/10 border border-trading-green/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-trading-green">Win / Profit Theme</p>
                    <p className="text-xs text-muted-foreground">Settlement wins, positive PnL</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded bg-trading-green" title="#22c55e" />
                    <div className="w-6 h-6 rounded bg-trading-green/20" title="20% opacity" />
                  </div>
                </div>
              </div>

              {/* Loss Theme */}
              <div className="p-3 bg-trading-red/10 border border-trading-red/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-trading-red">Loss Theme</p>
                    <p className="text-xs text-muted-foreground">Settlement losses, negative PnL</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded bg-trading-red" title="#ef4444" />
                    <div className="w-6 h-6 rounded bg-trading-red/20" title="20% opacity" />
                  </div>
                </div>
              </div>

              {/* Neutral Theme */}
              <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-primary">Neutral / Brand Theme</p>
                    <p className="text-xs text-muted-foreground">Deposits, addresses, leaderboard</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded bg-primary" title="primary" />
                    <div className="w-6 h-6 rounded bg-primary/20" title="20% opacity" />
                  </div>
                </div>
              </div>

              {/* Special Themes */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-gradient-to-r from-amber-500/20 to-yellow-400/20 border border-amber-400/30 rounded-lg">
                  <p className="text-xs font-semibold text-amber-400">Gold (Top Rank)</p>
                </div>
                <div className="p-2 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 border border-cyan-400/30 rounded-lg">
                  <p className="text-xs font-semibold text-cyan-400">Neon (Alt Theme)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Poster Components Reference */}
        <Card className="trading-card mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Poster Components</CardTitle>
            <CardDescription>Reference for all share poster implementations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-medium">Component</th>
                    <th className="text-left py-2 pr-4 font-medium">Purpose</th>
                    <th className="text-left py-2 pr-4 font-medium">Key Elements</th>
                    <th className="text-left py-2 font-medium">Theme</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4 font-mono text-xs text-foreground">SharePosterContent</td>
                    <td className="py-3 pr-4">Deposit address sharing</td>
                    <td className="py-3 pr-4">QR code, color-coded address, network warning</td>
                    <td className="py-3">Neutral/Brand</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4 font-mono text-xs text-foreground">SettlementShareCard</td>
                    <td className="py-3 pr-4">Trade result sharing</td>
                    <td className="py-3 pr-4">PnL amount, ROI %, event name, entry/exit</td>
                    <td className="py-3">Win/Loss dynamic</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-4 font-mono text-xs text-foreground">EventShareCard</td>
                    <td className="py-3 pr-4">Event outcome sharing</td>
                    <td className="py-3 pr-4">Winning option, final price, user position</td>
                    <td className="py-3">Win/Loss dynamic</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-foreground">Leaderboard Card</td>
                    <td className="py-3 pr-4">Ranking sharing</td>
                    <td className="py-3 pr-4">Rank position, username, stats, referral</td>
                    <td className="py-3">Gold/Neon/Brutal</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-muted/20 rounded-lg">
              <h4 className="text-sm font-semibold mb-3">Implementation Pattern</h4>
              <CodePreview 
                code={`// 1. Create poster content component (pure visual)
const SharePosterContent = forwardRef<HTMLDivElement, Props>(
  ({ data }, ref) => (
    <div ref={ref} className="w-[400px] bg-gradient-to-b from-[#1a1a2e] to-[#16162a] p-8 rounded-2xl">
      {/* Logo Header */}
      {/* Main Content (QR, Stats, etc.) */}
      {/* Warning/Info */}
      {/* Footer */}
    </div>
  )
);

// 2. Wrap in Dialog (Desktop) or Drawer (Mobile)
// 3. Use html-to-image to generate PNG
import { toPng } from 'html-to-image';

const dataUrl = await toPng(posterRef.current, {
  quality: 1,
  pixelRatio: 2,  // 2x for retina
});

// 4. Share via navigator.share or download
const blob = await fetch(dataUrl).then(r => r.blob());
const file = new File([blob], 'share.png', { type: 'image/png' });
navigator.share({ files: [file] });`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Design Rules */}
        <Card className="trading-card mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Design Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">✅ Must Have</h4>
                <ul className="text-xs text-muted-foreground space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-trading-green shrink-0 mt-0.5" />
                    <span>Brand logo in header (OmenX Ω symbol)</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-trading-green shrink-0 mt-0.5" />
                    <span>Fixed width <code>w-[400px]</code> for consistent output</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-trading-green shrink-0 mt-0.5" />
                    <span>Dark gradient background for Web3 aesthetic</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-trading-green shrink-0 mt-0.5" />
                    <span>QR code with white background (scannable)</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-trading-green shrink-0 mt-0.5" />
                    <span>Color-coded addresses (digits = primary, letters = white)</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-trading-green shrink-0 mt-0.5" />
                    <span>Network/asset warning for deposits</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold">❌ Avoid</h4>
                <ul className="text-xs text-muted-foreground space-y-2">
                  <li className="flex gap-2">
                    <XCircle className="h-3.5 w-3.5 text-trading-red shrink-0 mt-0.5" />
                    <span>Using Tailwind classes for colors in poster (use inline styles for html-to-image)</span>
                  </li>
                  <li className="flex gap-2">
                    <XCircle className="h-3.5 w-3.5 text-trading-red shrink-0 mt-0.5" />
                    <span>Variable width containers (causes inconsistent exports)</span>
                  </li>
                  <li className="flex gap-2">
                    <XCircle className="h-3.5 w-3.5 text-trading-red shrink-0 mt-0.5" />
                    <span>Light backgrounds (doesn't match brand aesthetic)</span>
                  </li>
                  <li className="flex gap-2">
                    <XCircle className="h-3.5 w-3.5 text-trading-red shrink-0 mt-0.5" />
                    <span>Truncated addresses in share posters (show full)</span>
                  </li>
                  <li className="flex gap-2">
                    <XCircle className="h-3.5 w-3.5 text-trading-red shrink-0 mt-0.5" />
                    <span>Missing token/network context</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </SectionWrapper>
    </div>
  );
};
