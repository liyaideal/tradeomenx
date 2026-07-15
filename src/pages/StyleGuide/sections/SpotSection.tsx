import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LIFECYCLE_BADGE } from "@/lib/usStockSessions";
import { SectionWrapper } from "../components/SectionWrapper";

interface Props { isMobile: boolean }

export const SpotSection = ({ isMobile }: Props) => {
  const buildBook = (mid: number, seed: number) => {
    const halfSpread = 0.02;
    const asks: { price: number; size: number }[] = [];
    const bids: { price: number; size: number }[] = [];
    let askSize = 200, bidSize = 200;
    for (let i = 0; i < 6; i++) {
      asks.push({ price: mid + halfSpread + i * 0.01, size: Math.round(askSize) });
      bids.push({ price: mid - halfSpread - i * 0.01, size: Math.round(bidSize) });
      askSize *= 0.82; bidSize *= 0.82;
    }
    return { bids, asks };
  };
  const book = buildBook(0.58, 42);

  return (
    <div className="space-y-8">
      {/* Lifecycle badges */}
      <SectionWrapper id="spot-lifecycle" title="Spot lifecycle badges" description="Every US-stock daily up/down state">
        <div className="flex flex-wrap gap-2">
          {Object.entries(LIFECYCLE_BADGE).map(([k, v]) => (
            <Badge key={k} variant="outline" className={`text-[10px] border ${v.className}`}>
              {v.label}
            </Badge>
          ))}
        </div>
      </SectionWrapper>

      {/* Order book preview */}
      <SectionWrapper id="spot-book" title="Mock LP order book" description="10-level book, LP quote mode chip 'NORMAL'">
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3 max-w-md space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Order Book</h3>
            <Badge variant="outline" className="text-[10px] text-muted-foreground border-muted-foreground/30">NORMAL</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="space-y-0.5">
              <div className="flex justify-between text-[10px] uppercase text-muted-foreground pb-1 border-b border-border/40"><span>Bid</span><span>Size</span></div>
              {book.bids.map((l, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-trading-green">{l.price.toFixed(2)}</span>
                  <span className="text-muted-foreground">{l.size}</span>
                </div>
              ))}
            </div>
            <div className="space-y-0.5">
              <div className="flex justify-between text-[10px] uppercase text-muted-foreground pb-1 border-b border-border/40"><span>Ask</span><span>Size</span></div>
              {book.asks.map((l, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-trading-red">{l.price.toFixed(2)}</span>
                  <span className="text-muted-foreground">{l.size}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Trade form buy + sell */}
      <SectionWrapper id="spot-form" title="Spot trade form — Buy & Sell" description="No leverage / TP / SL / funding / liq. inputs">
        <div className="grid gap-4 md:grid-cols-2">
          {(["buy", "sell"] as const).map((side) => (
            <div key={side} className="rounded-lg border border-border/60 bg-card p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button className="py-2 rounded-md text-sm font-semibold border bg-trading-green/15 text-trading-green border-trading-green/40">
                  Up <div className="text-[11px] font-mono opacity-70">$0.58</div>
                </button>
                <button className="py-2 rounded-md text-sm font-semibold border text-muted-foreground border-border">
                  Not Up <div className="text-[11px] font-mono opacity-70">$0.42</div>
                </button>
              </div>
              <div className="inline-flex w-full items-center gap-1 rounded-md border border-border/60 bg-muted/30 p-1">
                <button className={`flex-1 py-1.5 rounded text-sm font-medium capitalize ${side === "buy" ? "bg-trading-green/20 text-trading-green" : "text-muted-foreground"}`}>Buy</button>
                <button className={`flex-1 py-1.5 rounded text-sm font-medium capitalize ${side === "sell" ? "bg-trading-red/20 text-trading-red" : "text-muted-foreground"}`}>Sell</button>
              </div>
              <div className="space-y-1"><label className="text-xs text-muted-foreground">Limit price ($)</label><Input defaultValue="0.58" /></div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">
                  {side === "buy" ? "Amount ($)" : "Amount ($) — held: 200 shares"}
                </label>
                <Input defaultValue="58" />
              </div>
              <div className="rounded-md bg-muted/30 p-2.5 text-xs font-mono space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Cost</span><span>$58.00</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Max loss</span><span>${side === "buy" ? "58.00" : "0.00"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Payout if right</span><span>$100.00 <span className="text-muted-foreground">(100 × $1)</span></span></div>
              </div>
              <Button className="w-full h-11" variant={side === "buy" ? "default" : "destructive"}>
                {side === "buy" ? "Buy Up" : "Sell Up"}
              </Button>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* SPOT position row */}
      <SectionWrapper id="spot-row" title="SPOT position row" description="Leverage / Liq. / Funding hidden; SPOT badge shown">
        <div className="rounded-lg border border-border/60 bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">SPOT</Badge>
              <span className="text-xs text-muted-foreground">—</span>
            </div>
            <div className="text-xs font-semibold text-trading-green">+$12.00 (+20.7%)</div>
          </div>
          <h3 className="font-medium text-sm">NVDA · Up on Jul 15?</h3>
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs font-mono">
            <div><div className="text-muted-foreground">Entry</div><div>$0.58</div></div>
            <div><div className="text-muted-foreground">Mark</div><div>$0.70</div></div>
            <div><div className="text-muted-foreground">Size</div><div>100 sh</div></div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};
