import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TradingCharts from "./pages/TradingCharts";
import TradeOrder from "./pages/TradeOrder";
import OrderPreview from "./pages/OrderPreview";
import DesktopTrading from "./pages/DesktopTrading";
import StyleGuide from "./pages/StyleGuide";
import EventsPage from "./pages/EventsPage";
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
            <Route path="/" element={<TradingPage />} />
            <Route path="/trade" element={<TradingPage />} />
            <Route path="/trade/order" element={<TradeOrderPage />} />
            <Route path="/order-preview" element={<OrderPreview />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/style-guide" element={<StyleGuide />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ResponsiveLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
