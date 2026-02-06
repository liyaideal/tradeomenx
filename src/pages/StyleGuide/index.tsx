import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  ViewportSwitcher, 
  ViewportBanner, 
  type ViewportSize,
  PlatformBadge,
} from "./components";
import {
  DesignTokensSection,
  TypographySection,
  CommonUISection,
  FormsSection,
  TradingSection,
  WalletSection,
  MobilePatternsSection,
  UserIdentitySection,
} from "./sections";

const StyleGuideIndex = () => {
  const navigate = useNavigate();
  const actualIsMobile = useIsMobile();
  const [viewport, setViewport] = useState<ViewportSize>("auto");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("tokens");

  // Determine effective isMobile based on viewport selection
  const isMobile = viewport === "auto" 
    ? actualIsMobile 
    : viewport === "mobile" || viewport === "tablet";

  const tabs = [
    { id: "tokens", label: "Tokens", icon: "🎨" },
    { id: "typography", label: "Typography", icon: "🔤" },
    { id: "ui", label: "Common UI", icon: "🧩" },
    { id: "forms", label: "Forms", icon: "📝" },
    { id: "trading", label: "Trading", icon: "💹" },
    { id: "wallet", label: "Wallet", icon: "💰" },
    { id: "mobile", label: "Mobile", icon: "📱" },
    { id: "identity", label: "Identity", icon: "👤" },
  ];

  return (
    <div className={`min-h-screen bg-background ${isMobile ? "pb-20" : ""}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border ${isMobile ? "px-4 py-3" : "px-8 py-4"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className={`font-semibold ${isMobile ? "text-lg" : "text-2xl"}`}>Style Guide</h1>
              <p className="text-sm text-muted-foreground">Design System Documentation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${isMobile ? "w-[120px]" : "w-[180px]"} pl-9 h-8 text-sm bg-muted/50 border-border/50`}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Viewport Switcher */}
            <ViewportSwitcher value={viewport} onChange={setViewport} />
          </div>
        </div>

        <ViewportBanner viewport={viewport} onClose={() => setViewport("auto")} />
      </header>

      {/* Main Content with Tabs */}
      <main className={`${isMobile ? "px-4 py-4" : "px-8 py-6 max-w-7xl mx-auto"}`}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`mb-6 ${isMobile ? "w-full overflow-x-auto flex-nowrap" : ""}`}>
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className={isMobile ? "flex-shrink-0" : ""}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2 mb-6">
              <Search className="h-4 w-4" />
              <span>Filtering for "<span className="text-foreground font-medium">{searchQuery}</span>"</span>
              <Button variant="ghost" size="sm" className="h-6 ml-auto" onClick={() => setSearchQuery("")}>
                Clear
              </Button>
            </div>
          )}

          {/* Tab Content */}
          <TabsContent value="tokens" className="mt-0">
            <DesignTokensSection isMobile={isMobile} />
          </TabsContent>

          <TabsContent value="typography" className="mt-0">
            <TypographySection isMobile={isMobile} />
          </TabsContent>

          <TabsContent value="ui" className="mt-0">
            <CommonUISection isMobile={isMobile} />
          </TabsContent>

          <TabsContent value="forms" className="mt-0">
            <FormsSection isMobile={isMobile} />
          </TabsContent>

          <TabsContent value="trading" className="mt-0">
            <TradingSection isMobile={isMobile} />
          </TabsContent>

          <TabsContent value="wallet" className="mt-0">
            <WalletSection isMobile={isMobile} />
          </TabsContent>

          <TabsContent value="mobile" className="mt-0">
            <MobilePatternsSection isMobile={isMobile} />
          </TabsContent>

          <TabsContent value="identity" className="mt-0">
            <UserIdentitySection isMobile={isMobile} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StyleGuideIndex;
