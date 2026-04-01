import { SeoPageLayout } from "@/components/seo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    category: "Getting Started",
    items: [
      {
        q: "What is OmenX?",
        a: "OmenX is an event-based trading platform where you can trade on the outcomes of real-world events — from crypto prices and sports results to political elections and economic indicators. Each event is represented as a market with options priced between $0 and $1.",
      },
      {
        q: "How do I create an account?",
        a: "Click 'Sign In' and register using your email, Google account, or Telegram. Once registered, you can access trial funds to start trading immediately without depositing any real money.",
      },
      {
        q: "What are trial funds?",
        a: "Trial funds are virtual credits given to new users so you can explore and practice trading without financial risk. They function identically to real funds in terms of market mechanics, but cannot be withdrawn as cash.",
      },
      {
        q: "Is OmenX available in my country?",
        a: "OmenX is available in most jurisdictions. However, users from sanctioned regions or countries where event trading is explicitly prohibited may be restricted. Please refer to our Terms of Service for detailed eligibility criteria.",
      },
    ],
  },
  {
    category: "Trading Mechanics",
    items: [
      {
        q: "How does event trading work?",
        a: "Each event has two or more options (e.g., Yes/No). Options are priced between $0.00 and $1.00, reflecting market-implied probability. If you buy a 'Yes' option at $0.35 and the event resolves in favor of 'Yes', the option settles at $1.00, giving you a profit of $0.65 per contract.",
      },
      {
        q: "What is leverage?",
        a: "Leverage allows you to control a larger position with less capital. For example, 5x leverage means a $100 margin controls a $500 position. While leverage amplifies potential profits, it also amplifies potential losses.",
      },
      {
        q: "What are limit orders vs. market orders?",
        a: "A market order executes immediately at the best available price. A limit order lets you specify the exact price at which you want to buy or sell — it will only execute when the market reaches your target price.",
      },
      {
        q: "How are events settled?",
        a: "Events are settled based on verifiable real-world outcomes using trusted data sources. Once an event concludes, the winning option settles at $1.00 and losing options settle at $0.00. Settlement typically occurs within minutes of the event outcome being confirmed.",
      },
      {
        q: "What is the order book?",
        a: "The order book displays all open buy and sell orders for an event option at different price levels. It provides transparency into market depth, liquidity, and the current best bid/ask prices.",
      },
    ],
  },
  {
    category: "Account & Funds",
    items: [
      {
        q: "How do I deposit funds?",
        a: "Navigate to Wallet → Deposit. OmenX supports deposits in USDT and USDC across multiple blockchain networks including Ethereum, Polygon, Arbitrum, BSC, Solana, and Tron. A unique deposit address is generated for your account.",
      },
      {
        q: "How do I withdraw?",
        a: "Go to Wallet → Withdraw. Enter the amount and your destination wallet address. Withdrawals are processed after a security review, typically within 24 hours.",
      },
      {
        q: "What fees does OmenX charge?",
        a: "OmenX charges a small trading fee on each executed order. There are no fees for deposits. Withdrawal fees vary by blockchain network to cover gas costs. See the fee schedule in your account settings for current rates.",
      },
    ],
  },
  {
    category: "Rewards & Points",
    items: [
      {
        q: "How do I earn points?",
        a: "You earn points by completing tasks such as daily check-ins, placing trades, referring friends, and engaging with the platform. Points can be redeemed for trial trading funds.",
      },
      {
        q: "What is the referral program?",
        a: "Share your unique referral code with friends. When they sign up and become active traders, both you and your friend earn bonus points. The program supports multi-level referrals for additional rewards.",
      },
      {
        q: "How do I redeem points?",
        a: "Go to the Rewards page and click 'Redeem'. Points are converted to trial funds at a fixed exchange rate. Redeemed funds are credited to your trial balance instantly.",
      },
    ],
  },
  {
    category: "Security & Risk",
    items: [
      {
        q: "Is my money safe?",
        a: "OmenX employs industry-standard security practices including encrypted data storage, secure authentication, and segregated user funds. We never store private keys and all crypto transactions are verified on-chain.",
      },
      {
        q: "What is the risk indicator?",
        a: "The account risk indicator shows your overall portfolio risk level based on your positions, leverage, and available margin. A higher risk level means you are closer to potential liquidation on leveraged positions.",
      },
      {
        q: "Can I lose more than my deposit?",
        a: "No. OmenX uses a margin system where your maximum loss is limited to the margin allocated to each position. If your margin is depleted, the position is automatically closed to prevent negative balances.",
      },
    ],
  },
];

const FaqPage = () => {
  return (
    <SeoPageLayout
      title="Frequently Asked Questions"
      description="Everything you need to know about trading on OmenX — from getting started to advanced strategies."
    >
      <div className="space-y-8">
        {faqData.map((section) => (
          <section key={section.category}>
            <h2 className="!mt-0">{section.category}</h2>
            <Accordion type="single" collapsible className="w-full">
              {section.items.map((item, idx) => (
                <AccordionItem key={idx} value={`${section.category}-${idx}`} className="border-border/30">
                  <AccordionTrigger className="text-left text-foreground hover:no-underline text-sm md:text-base py-3">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>

      {/* JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.flatMap((s) =>
              s.items.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              }))
            ),
          }),
        }}
      />
    </SeoPageLayout>
  );
};

export default FaqPage;
