import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ExternalLink, ChevronDown } from "lucide-react";
import { MobileTradingLayout, useMobileTradingContext } from "@/components/MobileTradingLayout";
import { TradeForm } from "@/components/TradeForm";
import { OrderCard } from "@/components/OrderCard";
import { PositionCard } from "@/components/PositionCard";
import { useOrdersStore } from "@/stores/useOrdersStore";
import { usePositionsStore } from "@/stores/usePositionsStore";
import { generateOrderBookData } from "@/lib/tradingUtils";
import { useOrderSimulation } from "@/hooks/useOrderSimulation";

interface LocationState {
  tab?: string;
  highlightPosition?: number;
}

function TradeOrderContent() {
  const location = useLocation();
  const state = location.state as LocationState | null;
  
  const { orders } = useOrdersStore();
  const { positions } = usePositionsStore();
  const { selectedEvent, selectedOptionData } = useMobileTradingContext();
  
  // Enable order simulation for auto-filling
  useOrderSimulation();
  
  const [bottomTab, setBottomTab] = useState(state?.tab || "Orders");
  const [highlightedPosition, setHighlightedPosition] = useState<number | null>(state?.highlightPosition ?? null);
  const positionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tabSectionRef = useRef<HTMLDivElement | null>(null);
  const hasScrolledToSection = useRef(false);

  // Scroll to positions section when coming from "View All"
  useEffect(() => {
    if (state?.tab === "Positions" && highlightedPosition === null && !hasScrolledToSection.current) {
      hasScrolledToSection.current = true;
      setTimeout(() => {
        if (tabSectionRef.current) {
          const headerOffset = 100; // Account for sticky header
          const elementPosition = tabSectionRef.current.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }, 100);
    }
  }, [state?.tab, highlightedPosition]);

  // Scroll to and highlight specific position when clicking a card
  useEffect(() => {
    if (highlightedPosition !== null && positionRefs.current[highlightedPosition]) {
      // Mark as scrolled to prevent the section scroll from triggering later
      hasScrolledToSection.current = true;
      
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = positionRefs.current[highlightedPosition];
        if (element) {
          const headerOffset = 200; // Account for sticky header and tab bar
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }, 100);
      
      // Clear highlight after animation
      const timer = setTimeout(() => {
        setHighlightedPosition(null);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [highlightedPosition]);

  // Generate order book data based on selected option's price
  const orderBookData = useMemo(() => {
    const basePrice = parseFloat(selectedOptionData.price);
    return generateOrderBookData(basePrice, 10);
  }, [selectedOptionData.price]);

  return (
    <div className="pb-8 overflow-x-hidden">
      {/* Main Content Area - Two Column Layout */}
      <div className="flex w-full">
        {/* Left: Trade Form + Price Info */}
        <div className="flex-1 min-w-0 border-r border-border/30">
          {/* Price Header */}
          <div className="px-3 py-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] text-muted-foreground">Price</div>
                <div className="text-xl font-bold font-mono">{selectedOptionData.price}</div>
                <div className="text-[10px] text-muted-foreground">
                  Funding: -0.0001% / Next: in 28min
                </div>
              </div>
              <button className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <ExternalLink className="w-3 h-3" />
                Event Info
              </button>
            </div>
          </div>

          {/* Trade Form */}
          <TradeForm 
            selectedPrice={selectedOptionData.price} 
            eventName={selectedEvent.name}
            optionLabel={selectedOptionData.label}
          />
        </div>

        {/* Right: Order Book */}
        <div className="w-[120px] flex-shrink-0">
          <div className="px-1.5 py-1.5">
            <div className="grid grid-cols-2 text-[9px] text-muted-foreground mb-1">
              <span>Price</span>
              <span className="text-right">Amount</span>
            </div>
          </div>
          
          {/* Asks */}
          <div className="overflow-y-auto scrollbar-hide">
            {orderBookData.asks.slice(0, 10).map((ask, index) => (
              <div
                key={`ask-${index}`}
                className="flex justify-between px-1.5 py-0.5 text-[10px]"
              >
                <span className="price-red">{ask.price}</span>
                <span className="text-muted-foreground font-mono">{ask.amount}</span>
              </div>
            ))}
          </div>

          {/* Current Price */}
          <div className="px-1.5 py-1.5 text-center">
            <span className="text-sm font-bold font-mono">{selectedOptionData.price}</span>
          </div>

          {/* Bids */}
          <div className="overflow-y-auto scrollbar-hide">
            {orderBookData.bids.slice(0, 10).map((bid, index) => (
              <div
                key={`bid-${index}`}
                className="flex justify-between px-1.5 py-0.5 text-[10px]"
              >
                <span className="price-green">{bid.price}</span>
                <span className="text-muted-foreground font-mono">{bid.amount}</span>
              </div>
            ))}
          </div>

          {/* Depth Selector */}
          <div className="flex items-center justify-between px-1.5 py-1.5 border-t border-border/30 mt-1">
            <span className="text-[9px] text-muted-foreground">Depth</span>
            <button className="flex items-center gap-0.5 text-[10px]">
              0.1
              <ChevronDown className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Orders/Positions Tabs */}
      <div ref={tabSectionRef} className="flex px-4 mt-2 border-b border-border/30">
        {["Orders", "Positions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setBottomTab(tab)}
            className={`py-2 mr-6 text-sm font-medium transition-all ${
              bottomTab === tab
                ? "text-trading-purple border-b-2 border-trading-purple"
                : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders/Positions Content */}
      <div className="px-4 py-3 space-y-3">
        {bottomTab === "Orders" && orders
          .filter(order => order.status === 'Pending' || order.status === 'Partial Filled')
          .map((order, displayIndex) => {
            const actualIndex = orders.findIndex(o => o === order);
            return (
              <OrderCard 
                key={actualIndex} 
                {...order} 
              />
            );
          })
        }
        {bottomTab === "Positions" && positions.map((position, index) => (
          <div 
            key={index} 
            ref={(el) => (positionRefs.current[index] = el)}
            className={`transition-all duration-500 ${
              highlightedPosition === index 
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-lg" 
                : ""
            }`}
          >
            <PositionCard {...position} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TradeOrder() {
  return (
    <MobileTradingLayout activeTab="Trade">
      <TradeOrderContent />
    </MobileTradingLayout>
  );
}
