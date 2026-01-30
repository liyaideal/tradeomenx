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

            {/* Full Address Display */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Full Address (Copyable)</h4>
              <div className="p-3 bg-muted/20 rounded-lg">
                <p className="text-xs font-mono text-muted-foreground break-all">
                  0x8f3a2b1c4d5e6f7890123456789abcdef0123456789abcdef0123456789abcd
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
    </div>
  );
};
