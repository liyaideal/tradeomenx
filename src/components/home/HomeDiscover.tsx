import { useNavigate } from "react-router-dom";
import { BarChart3, Clock, TrendingUp, Loader2, Flame, Flag, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CampaignBannerCarousel } from "@/components/campaign/CampaignBannerCarousel";
import { SectionHeader } from "@/components/home/SectionHeader";
import { useAuth } from "@/hooks/useAuth";
import { usePositions } from "@/hooks/usePositions";
import { useActiveEvents } from "@/hooks/useActiveEvents";
import { getCategoryFromName, CATEGORY_STYLES, CategoryType } from "@/lib/categoryUtils";

const getCountdown = (endTime: Date) => {
  const now = new Date();
  const diff = endTime.getTime() - now.getTime();
  if (diff <= 0) return "Ended";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days}D ${hours}h ${minutes}m`;
  return `${hours}h ${minutes}m`;
};

export const HomeDiscover = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { positions } = usePositions();
  const { events: dbEvents, isLoading: isLoadingEvents } = useActiveEvents();

  const settlementSoon = dbEvents
    .filter((e) => e.end_date && new Date(e.end_date).getTime() > Date.now())
    .sort((a, b) => new Date(a.end_date!).getTime() - new Date(b.end_date!).getTime())
    .slice(0, 1);

  return (
    <div className="space-y-8">
      <CampaignBannerCarousel variant="mobile" />

      {user && positions.length > 0 && (
        <section>
          <SectionHeader
            icon={Wallet}
            tone="trading-purple"
            eyebrow="Portfolio"
            title="My positions"
            actionLabel="View all"
            onAction={() => navigate("/trade/order", { state: { tab: "Positions" } })}
            rightSlot={
              <button
                onClick={() => navigate("/trade/order", { state: { tab: "Positions" } })}
                className="flex flex-shrink-0 items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-primary"
              >
                <span className="font-mono text-muted-foreground/80">{positions.length}</span>
                <span className="opacity-50">·</span>
                View all
              </button>
            }
          />
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x snap-mandatory">
            {positions.slice(0, 5).map((position, index) => {
              const isProfit = position.pnl.startsWith("+");
              return (
                <div
                  key={index}
                  className="flex-shrink-0 w-[260px] snap-start cursor-pointer rounded-2xl border border-border/40 bg-card p-4 space-y-3 transition-colors hover:bg-card-hover"
                  onClick={() => navigate("/trade/order", { state: { tab: "Positions", highlightPosition: index } })}
                >
                  <p className="text-sm font-semibold text-foreground line-clamp-2 min-h-[2.5rem]">
                    {position.event}
                  </p>

                  <div className="flex items-center gap-2">
                    <Badge
                      className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 ${
                        position.type === "long"
                          ? "bg-trading-green/15 text-trading-green border-trading-green/25"
                          : "bg-trading-red/15 text-trading-red border-trading-red/25"
                      }`}
                    >
                      {position.type === "long" ? "Long" : "Short"}
                    </Badge>
                    <span className="text-xs font-medium text-muted-foreground">{position.option}</span>
                  </div>

                  <div className="flex items-end justify-between border-t border-border/30 pt-3">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        Unrealized
                      </span>
                      <div className={`font-mono text-base font-semibold ${isProfit ? "text-trading-green" : "text-trading-red"}`}>
                        {position.pnl}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        ROI
                      </span>
                      <div className={`font-mono text-base font-semibold ${isProfit ? "text-trading-green" : "text-trading-red"}`}>
                        {position.pnlPercent}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <SectionHeader
          icon={Flame}
          tone="trading-red"
          eyebrow="Trending"
          title="Hot markets"
          actionLabel="More"
          onAction={() => navigate("/events")}
        />

        {isLoadingEvents ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Loading markets…
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {dbEvents.slice(0, 4).map((event, index) => {
              const endDate = event.end_date ? new Date(event.end_date) : new Date();
              const countdown = getCountdown(endDate);
              const categoryInfo = getCategoryFromName(event.name);
              return (
                <div
                  key={event.id}
                  className="trading-card p-4 space-y-3 animate-fade-in cursor-pointer hover:bg-card-hover transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => navigate(`/trade?event=${event.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-3">
                      <h4 className="font-medium text-foreground">{event.name}</h4>
                      <Badge
                        variant={CATEGORY_STYLES[categoryInfo.label as CategoryType]?.variant || "general"}
                        className="mt-1.5 text-[10px] font-medium border-0 px-2 py-0.5"
                      >
                        {categoryInfo.label}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      className="bg-trading-green hover:bg-trading-green/90 text-white h-7 px-3 gap-1 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/trade?event=${event.id}`);
                      }}
                    >
                      <TrendingUp className="h-3.5 w-3.5" />
                      Trade
                    </Button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {event.options.map((option) => (
                      <div key={option.id} className="flex-shrink-0 min-w-[100px] bg-muted/50 rounded-lg p-2.5">
                        <span className="text-[10px] text-muted-foreground line-clamp-1">{option.label}</span>
                        <div className="text-base font-bold font-mono text-foreground">${option.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <BarChart3 className="h-3.5 w-3.5 text-primary" />
                      <span>Volume: {event.volume || "$0"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-trading-yellow">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{countdown}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <SectionHeader
          icon={Flag}
          tone="trading-yellow"
          eyebrow="Expiring"
          title="Settlement soon"
          subtitle="Last chance to trade"
        />

        {isLoadingEvents ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10">
            <Loader2 className="h-5 w-5 animate-spin text-trading-yellow" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Loading markets…
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {settlementSoon.map((event) => {
              const endDate = new Date(event.end_date!);
              const countdown = getCountdown(endDate);
              const categoryInfo = getCategoryFromName(event.name);
              return (
                <div
                  key={event.id}
                  className="trading-card p-4 space-y-3 border-trading-yellow/30 cursor-pointer hover:bg-card-hover transition-colors"
                  onClick={() => navigate(`/trade?event=${event.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-3">
                      <h4 className="font-medium text-foreground">{event.name}</h4>
                      <Badge
                        variant={CATEGORY_STYLES[categoryInfo.label as CategoryType]?.variant || "general"}
                        className="mt-1.5 text-[10px] font-medium border-0 px-2 py-0.5"
                      >
                        {categoryInfo.label}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      className="bg-trading-green hover:bg-trading-green/90 text-white h-7 px-3 gap-1 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/trade?event=${event.id}`);
                      }}
                    >
                      <TrendingUp className="h-3.5 w-3.5" />
                      Trade
                    </Button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {event.options.map((option) => (
                      <div key={option.id} className="flex-shrink-0 min-w-[100px] bg-muted/50 rounded-lg p-2.5">
                        <span className="text-[10px] text-muted-foreground line-clamp-1">{option.label}</span>
                        <div className="text-base font-bold font-mono text-foreground">${option.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-trading-yellow text-sm">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Settles in {countdown}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
