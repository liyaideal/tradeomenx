import { SeoPageLayout } from "@/components/seo";
import { useState } from "react";
import { Search } from "lucide-react";

const glossaryTerms = [
  { term: "Ask Price", definition: "The lowest price at which a seller is willing to sell an event option. Also known as the 'offer' price." },
  { term: "Bid Price", definition: "The highest price a buyer is willing to pay for an event option." },
  { term: "Binary Event", definition: "An event with exactly two possible outcomes (e.g., Yes or No). The options are complementary — if Yes is priced at $0.60, No is effectively $0.40." },
  { term: "Contract", definition: "A single unit of an event option. Each contract settles at either $1.00 (winning outcome) or $0.00 (losing outcome)." },
  { term: "Entry Price", definition: "The price at which a position is opened. Your profit or loss is determined by the difference between the entry price and the settlement or exit price." },
  { term: "Event Market", definition: "A tradable market created around a specific real-world event, such as 'Will BTC exceed $100K by December 2026?'" },
  { term: "Implied Probability", definition: "The market-derived probability of an outcome, calculated from the option price. A $0.70 option implies a 70% probability of that outcome occurring." },
  { term: "Leverage", definition: "A multiplier that allows traders to control larger positions with less capital. 10x leverage means $100 in margin controls a $1,000 position." },
  { term: "Limit Order", definition: "An order to buy or sell an option at a specific price or better. It remains in the order book until filled, canceled, or expired." },
  { term: "Liquidation", definition: "The automatic closing of a leveraged position when the margin can no longer sustain the unrealized loss, preventing negative account balances." },
  { term: "Margin", definition: "The collateral required to open and maintain a leveraged position. It represents the maximum amount you can lose on that position." },
  { term: "Mark Price", definition: "The real-time estimated fair value of an option, used for calculating unrealized PnL and risk metrics." },
  { term: "Market Order", definition: "An order that executes immediately at the best available price in the order book, guaranteeing execution but not price." },
  { term: "Option", definition: "A specific tradable outcome within an event market. For example, in a 'BTC > $100K?' event, 'Yes' and 'No' are the two options." },
  { term: "Order Book", definition: "A real-time list of all pending buy (bid) and sell (ask) orders for a given option, sorted by price and time priority." },
  { term: "PnL (Profit & Loss)", definition: "The financial result of a trade or position. Unrealized PnL reflects the current paper gain/loss; realized PnL is locked in when a position is closed or settled." },
  { term: "Position", definition: "An active trade that has been executed but not yet closed or settled. Positions have a side (long/short), entry price, and current mark price." },
  { term: "Resolution", definition: "The process of determining the outcome of an event. Once resolved, winning options settle at $1.00 and losing options at $0.00." },
  { term: "Settlement", definition: "The final step after resolution where profits and losses are calculated and credited or debited to traders' accounts." },
  { term: "Slippage", definition: "The difference between the expected price of a trade and the actual execution price, often occurring with large market orders in low-liquidity conditions." },
  { term: "Spread", definition: "The difference between the best bid and best ask price. A tighter spread indicates higher liquidity and lower trading costs." },
  { term: "Stop Loss (SL)", definition: "An automatic order that closes a position when it reaches a specified loss level, limiting downside risk." },
  { term: "Take Profit (TP)", definition: "An automatic order that closes a position when it reaches a specified profit level, locking in gains." },
  { term: "Trial Funds", definition: "Virtual credits provided to users for risk-free trading practice. Trial funds cannot be withdrawn but function identically to real funds in market mechanics." },
  { term: "Volume", definition: "The total value or number of contracts traded on a specific event or across the platform within a given time period." },
];

const GlossaryPage = () => {
  const [search, setSearch] = useState("");

  const filtered = glossaryTerms.filter(
    (t) =>
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, typeof glossaryTerms>>((acc, item) => {
    const letter = item.term[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(item);
    return acc;
  }, {});

  return (
    <SeoPageLayout
      title="Glossary"
      description="Comprehensive dictionary of event trading terminology used on OmenX."
    >
      {/* Search */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
      </div>

      {/* Terms */}
      <div className="space-y-8">
        {Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([letter, terms]) => (
            <section key={letter}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-primary">{letter}</span>
                <div className="flex-1 h-px bg-border/30" />
              </div>
              <dl className="space-y-4">
                {terms.map((t) => (
                  <div key={t.term} id={t.term.toLowerCase().replace(/\s+/g, "-")}>
                    <dt className="text-sm font-semibold text-foreground">{t.term}</dt>
                    <dd className="text-sm text-muted-foreground mt-1 leading-relaxed">{t.definition}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
      </div>

      {/* JSON-LD DefinedTermSet */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            name: "OmenX Event Trading Glossary",
            description: "Comprehensive dictionary of event trading terminology",
            definedTerm: glossaryTerms.map((t) => ({
              "@type": "DefinedTerm",
              name: t.term,
              description: t.definition,
            })),
          }),
        }}
      />
    </SeoPageLayout>
  );
};

export default GlossaryPage;
