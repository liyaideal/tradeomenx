import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MobileHome from "./pages/MobileHome";
import TradingCharts from "./pages/TradingCharts";
import TradeOrder from "./pages/TradeOrder";
import OrderPreview from "./pages/OrderPreview";
import DesktopTrading from "./pages/DesktopTrading";
import StyleGuide from "./pages/StyleGuide";
import EventsPage from "./pages/EventsPage";
import ResolvedPage from "./pages/ResolvedPage";
import ResolvedEventDetail from "./pages/ResolvedEventDetail";
import Leaderboard from "./pages/Leaderboard";
import Portfolio from "./pages/Portfolio";
import PortfolioSettlements from "./pages/PortfolioSettlements";
import SettlementDetail from "./pages/SettlementDetail";
import Wallet from "./pages/Wallet";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { useIsMobile } from "./hooks/use-mobile";

const queryClient = new QueryClient();

// Responsive layout wrapper
const ResponsiveLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return <div className="max-w-md mx-auto min-h-screen bg-background">{children}</div>;
  }
  
  return <div className="min-h-screen bg-background">{children}</div>;
};

// Route component that shows different pages based on device
const HomePage = () => {
  const isMobile = useIsMobile();
  return isMobile ? <MobileHome /> : <EventsPage />;
};

const TradingPage = () => {
  const isMobile = useIsMobile();
  return isMobile ? <TradingCharts /> : <DesktopTrading />;
};

const TradeOrderPage = () => {
  const isMobile = useIsMobile();
  return isMobile ? <TradeOrder /> : <DesktopTrading />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ResponsiveLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/trade" element={<TradingPage />} />
            <Route path="/trade/order" element={<TradeOrderPage />} />
            <Route path="/order-preview" element={<OrderPreview />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/resolved" element={<ResolvedPage />} />
            <Route path="/resolved/:eventId" element={<ResolvedEventDetail />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/settlements" element={<PortfolioSettlements />} />
            <Route path="/portfolio/settlement/:settlementId" element={<SettlementDetail />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/style-guide" element={<StyleGuide />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ResponsiveLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
