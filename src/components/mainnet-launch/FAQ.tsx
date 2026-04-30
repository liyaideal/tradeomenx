import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionShell, SectionTitle } from "./SectionShell";
import { trackMainnetLaunch } from "@/lib/mainnetLaunch";

const faqs = [
  { id: "volume", q: "What counts as trading volume?", a: "Trading volume = Open position amount + Close position amount. Only contract trading counts. Spot trading and fiat deposits are not included." },
  { id: "reward-time", q: "When do I get my reward?", a: "Rewards are distributed daily by 18:00 (UTC+8), covering trades completed the previous day. You'll see USDC credited to your trading account." },
  { id: "both-events", q: "Can I win both Event 1 and Event 2 rewards?", a: "Yes. Your first 5K volume qualifies you for Event 1 and starts counting toward Event 2 tiers. One trade path, two rewards." },
  { id: "cumulative", q: "Are Event 2 tier rewards cumulative?", a: "No. You receive the reward for the highest tier you reach. For example, if you hit $100K volume, you get $20 — not $5 + $10 + $20." },
  { id: "deposit", q: "Do I need to deposit $5,000?", a: "No. $5,000 is trading volume, not deposit amount. With leverage, you can reach this volume with a much smaller deposit. For example, 10x leverage on a $500 position can create $5,000 volume when you open and close it." },
  { id: "catch", q: "What's the catch?", a: "We just launched mainnet and want traders on the platform. The rewards come from our marketing budget. Trade, earn your bonus, and if you like the platform, stick around. That's the whole plan." },
];

export const FAQ = () => (
  <SectionShell>
    <SectionTitle eyebrow="FAQ" title="Operational details." />
    <Accordion
      type="single"
      collapsible
      className="border-y border-border/55"
      onValueChange={(value) => value && trackMainnetLaunch("mainnet_launch_faq_expand", { question_id: value })}
    >
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id} className="border-border/45">
          <AccordionTrigger className="py-5 text-left text-sm font-semibold text-foreground hover:no-underline md:text-base">
            <span className="pr-6">{faq.q}</span>
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-sm leading-6 text-muted-foreground md:text-base">
            {faq.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </SectionShell>
);
