import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TradingCharts from "./pages/TradingCharts";
import TradeOrder from "./pages/TradeOrder";
import OrderPreview from "./pages/OrderPreview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="max-w-md mx-auto min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<TradingCharts />} />
            <Route path="/trade" element={<TradingCharts />} />
            <Route path="/trade/order" element={<TradeOrder />} />
            <Route path="/order-preview" element={<OrderPreview />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
