import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Check, X, Zap } from "lucide-react";
import { SectionWrapper, SubSection } from "../components/SectionWrapper";
import { CodePreview } from "../components/CodePreview";
import { PriceText, PercentText, AmountText, LabelText, AddressText } from "@/components/typography";

interface TypographySectionProps {
  isMobile: boolean;
}

export const TypographySection = ({ isMobile }: TypographySectionProps) => {
  // Playground states
  const [typoPriceValue, setTypoPriceValue] = useState(1234.56);
  const [typoPricePrefix, setTypoPricePrefix] = useState("$");
  const [typoPriceDecimals, setTypoPriceDecimals] = useState(2);
  const [typoPriceShowSign, setTypoPriceShowSign] = useState(false);
  const [typoPriceColorByValue, setTypoPriceColorByValue] = useState(false);
  
  const [typoPercentValue, setTypoPercentValue] = useState(12.34);
  const [typoPercentDecimals, setTypoPercentDecimals] = useState(2);
  const [typoPercentShowSign, setTypoPercentShowSign] = useState(true);
  const [typoPercentColorByValue, setTypoPercentColorByValue] = useState(true);
  
  const [typoAmountValue, setTypoAmountValue] = useState(500);
  const [typoAmountDecimals, setTypoAmountDecimals] = useState(0);
  const [typoAmountSuffix, setTypoAmountSuffix] = useState(" contracts");
  
  const [typoLabelText, setTypoLabelText] = useState("Option Label");
  const [typoLabelSize, setTypoLabelSize] = useState<"xs" | "sm" | "base" | "lg">("base");
  const [typoLabelMuted, setTypoLabelMuted] = useState(false);
  
  const [typoAddress, setTypoAddress] = useState("0x1234567890abcdef1234567890abcdef12345678");
  const [typoAddressTruncate, setTypoAddressTruncate] = useState(true);

  return (
    <div className="space-y-12">
      {/* Font Families */}
      <SectionWrapper
        id="typography-fonts"
        title="Font Families"
        platform="shared"
        description="Inter for text labels and headlines, JetBrains Mono for numerical data"
      >
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
            <CardContent className="space-y-2">
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

        {/* Usage Guidelines */}
        <Card className="trading-card border-primary/30 mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              Font Usage Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Content Type</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Font</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Class</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr><td className="py-2">Prices & Currency</td><td className="py-2 font-mono">JetBrains Mono</td><td className="py-2"><code className="text-primary">font-mono</code></td></tr>
                  <tr><td className="py-2">Percentages & ROI</td><td className="py-2 font-mono">JetBrains Mono</td><td className="py-2"><code className="text-primary">font-mono</code></td></tr>
                  <tr><td className="py-2">Wallet Addresses</td><td className="py-2 font-mono">JetBrains Mono</td><td className="py-2"><code className="text-primary">font-mono</code></td></tr>
                  <tr><td className="py-2">Titles & Headlines</td><td className="py-2">Inter</td><td className="py-2"><code className="text-muted-foreground">(default)</code></td></tr>
                  <tr><td className="py-2">Labels & Options</td><td className="py-2">Inter</td><td className="py-2"><code className="text-muted-foreground">(default)</code></td></tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </SectionWrapper>

      {/* Typography Components */}
      <SectionWrapper
        id="typography-components"
        title="Typography Components"
        platform="shared"
        description="Semantic typography components from @/components/typography"
      >
        <div className="space-y-6">
          {/* PriceText */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-trading-green" />
                PriceText
              </CardTitle>
              <CardDescription>Display prices and currency values</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                <div className="bg-muted/30 rounded-xl p-6 flex flex-col items-center justify-center min-h-[120px] gap-4">
                  <span className="text-xs text-muted-foreground">Live Preview</span>
                  <div className="text-2xl">
                    <PriceText 
                      value={typoPriceValue} 
                      prefix={typoPricePrefix}
                      decimals={typoPriceDecimals}
                      showSign={typoPriceShowSign}
                      colorByValue={typoPriceColorByValue}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Value</Label>
                      <Input type="number" value={typoPriceValue} onChange={(e) => setTypoPriceValue(parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Prefix</Label>
                      <Input value={typoPricePrefix} onChange={(e) => setTypoPricePrefix(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Show Sign (+/-)</Label>
                    <Switch checked={typoPriceShowSign} onCheckedChange={setTypoPriceShowSign} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Color by Value</Label>
                    <Switch checked={typoPriceColorByValue} onCheckedChange={setTypoPriceColorByValue} />
                  </div>
                </div>
              </div>
              <CodePreview 
                code={`<PriceText value={${typoPriceValue}} prefix="${typoPricePrefix}"${typoPriceShowSign ? " showSign" : ""}${typoPriceColorByValue ? " colorByValue" : ""} />`}
              />
            </CardContent>
          </Card>

          {/* PercentText */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-trading-purple" />
                PercentText
              </CardTitle>
              <CardDescription>Display percentages with automatic formatting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                <div className="bg-muted/30 rounded-xl p-6 flex flex-col items-center justify-center min-h-[120px] gap-4">
                  <span className="text-xs text-muted-foreground">Live Preview</span>
                  <div className="text-2xl">
                    <PercentText 
                      value={typoPercentValue} 
                      decimals={typoPercentDecimals}
                      showSign={typoPercentShowSign}
                      colorByValue={typoPercentColorByValue}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Value</Label>
                    <Input type="number" value={typoPercentValue} onChange={(e) => setTypoPercentValue(parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Show Sign</Label>
                    <Switch checked={typoPercentShowSign} onCheckedChange={setTypoPercentShowSign} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Color by Value</Label>
                    <Switch checked={typoPercentColorByValue} onCheckedChange={setTypoPercentColorByValue} />
                  </div>
                </div>
              </div>
              <CodePreview 
                code={`<PercentText value={${typoPercentValue}}${typoPercentShowSign ? " showSign" : ""}${typoPercentColorByValue ? " colorByValue" : ""} />`}
              />
            </CardContent>
          </Card>

          {/* AddressText */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-trading-yellow" />
                AddressText
              </CardTitle>
              <CardDescription>Display wallet/contract addresses with optional truncation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                <div className="bg-muted/30 rounded-xl p-6 flex flex-col items-center justify-center min-h-[120px] gap-4">
                  <span className="text-xs text-muted-foreground">Live Preview</span>
                  <div className="text-lg">
                    <AddressText 
                      address={typoAddress}
                      truncate={typoAddressTruncate}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Address</Label>
                    <Input value={typoAddress} onChange={(e) => setTypoAddress(e.target.value)} className="font-mono text-xs" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Truncate</Label>
                    <Switch checked={typoAddressTruncate} onCheckedChange={setTypoAddressTruncate} />
                  </div>
                </div>
              </div>
              <CodePreview 
                code={`<AddressText address="${typoAddress.slice(0, 20)}..."${typoAddressTruncate ? " truncate" : ""} />`}
              />
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>
    </div>
  );
};
