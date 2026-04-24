import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Is this really free? What's the catch?",
    a: "Yes — really free. There's no deposit, no fee, no hidden lock-up. We're spending our own money on these airdrops because we want you to try OmenX risk-free. The only 'catch' is the eligibility rules: your Polymarket position must be ≥ $200, held 3+ days, and on a market we also list.",
  },
  {
    q: "Do you control my Polymarket wallet?",
    a: "No. The connection uses an EIP-712 signature, which proves you own the wallet without granting any permission to move funds. We can read your public on-chain positions — that's it. We literally cannot touch your money even if we wanted to.",
  },
  {
    q: "When and how do I get the cash?",
    a: "Once you connect your wallet, qualifying positions show up as airdrops in your portfolio. Click 'Activate' (within 72 hours) and the free hedge becomes a real position. When the OmenX market settles, your PnL is paid out in USDC on Base — withdraw to your wallet anytime.",
  },
  {
    q: "What if my Polymarket position wins?",
    a: "Then you win on Polymarket and your free OmenX hedge expires worthless — but you didn't pay a cent for it, so net-net you're still up. We give you a free option, not a guaranteed double-up.",
  },
  {
    q: "Why are you doing this?",
    a: "Honestly: customer acquisition. Most prediction-market traders haven't heard of OmenX yet. Giving them a free hedge on positions they already hold is the cheapest way to get them through the door. If our product is good, they stay. If not, they leave with free money.",
  },
  {
    q: "Are you regulated?",
    a: "OmenX runs on Base and settles in USDC. Smart-contract trades are publicly verifiable on-chain. See our /transparency page for the live audit. Use of OmenX is subject to our Terms of Service — please confirm legality in your jurisdiction.",
  },
];

export const HedgeFAQ = () => {
  return (
    <section className="border-b border-border/40 bg-card">
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-24">
        <div className="mb-8 text-center md:mb-10">
          <h2 className="text-2xl font-bold tracking-tight md:text-4xl">
            Frequently asked
          </h2>
          <p className="mt-2 text-sm text-muted-foreground md:mt-3 md:text-base">
            The questions everyone asks first.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          defaultValue="faq-0"
          className="space-y-3"
        >
          {FAQS.map((item, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="overflow-hidden rounded-xl border border-border/40 bg-background/40 px-4 last:border-b md:px-5"
            >
              <AccordionTrigger className="text-left text-sm font-medium leading-snug hover:no-underline md:text-base md:leading-normal">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
