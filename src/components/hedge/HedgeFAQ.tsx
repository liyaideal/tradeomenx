import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HedgePosterFrame } from "./HedgePosterFrame";

const FAQS = [
  {
    q: "Is this free money?",
    a: "No. A Trial Position Voucher is not cash and is not withdrawable. It's used to open a hedge position on OmenX. If that position closes in profit, you can redeem rewards under the campaign rules.",
  },
  {
    q: "What if my hedge loses?",
    a: "Losses on the trial position won't be deducted from your main account balance.",
  },
  {
    q: "Is the 500U reward guaranteed?",
    a: "No. The max redeemable reward depends on your hedge position's performance, the entry price, and the campaign reward cap.",
  },
  {
    q: "Why connect my Polymarket wallet?",
    a: "So OmenX can read your on-chain World Cup exposure and match it with the right hedge. We only read positions — connecting does not move your funds.",
  },
];

export const HedgeFAQ = () => {
  return (
    <section className="bg-[#FDFCF0] py-12 md:py-20">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="mb-8 md:mb-10">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#1D4ED8]">
            FAQ
          </p>
          <h2 className="mt-2 font-display text-3xl uppercase leading-tight tracking-tight text-[#0E0E0E] md:text-5xl">
            Quick answers.
          </h2>
        </div>

        <Accordion type="single" collapsible defaultValue="faq-0" className="space-y-3">
          {FAQS.map((item, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="overflow-hidden border-2 border-[#0E0E0E] bg-white px-5"
            >
              <AccordionTrigger className="text-left font-display text-base uppercase tracking-tight text-[#0E0E0E] hover:no-underline md:text-lg">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-[#0E0E0E]/80 md:text-base">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
