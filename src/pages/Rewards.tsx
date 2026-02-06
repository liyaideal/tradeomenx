import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Gift, Star, Trophy, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav } from "@/components/BottomNav";
import { MobileHeader } from "@/components/MobileHeader";
import { EventsDesktopHeader } from "@/components/EventsDesktopHeader";
import { usePoints } from "@/hooks/usePoints";
import { useTasks, TaskWithProgress } from "@/hooks/useTasks";
import { useReferral } from "@/hooks/useReferral";
import { useUserProfile } from "@/hooks/useUserProfile";
import { RedeemDialog } from "@/components/rewards/RedeemDialog";
import { ReferralCard } from "@/components/rewards/ReferralCard";
import { PointsHistoryList } from "@/components/rewards/PointsHistoryList";
import { TaskCard } from "@/components/rewards/TaskCard";
import { TreasureDropButton } from "@/components/rewards/TreasureDropButton";
import { LoginPrompt } from "@/components/LoginPrompt";

export default function Rewards() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const { user } = useUserProfile();
  const { pointsBalance, frozenPoints, lifetimeEarned, config, isLoading: isLoadingPoints } = usePoints();
  const { tasks, completedCount, totalCount, claimReward, isClaiming, refreshTaskStatus } = useTasks();
  const { referralCode, referralLink, stats: referralStats } = useReferral();
  const { profile } = useUserProfile();
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);
  
  // State to control the share modal from outside ReferralCard
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Ref to trigger share modal after tab switch
  const pendingShareRef = useRef(false);
  
  // Get initial tab from URL params
  const initialTab = searchParams.get("tab") || "tasks";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Refresh task status when component mounts
  useEffect(() => {
    if (user) {
      refreshTaskStatus();
    }
  }, [user]);

  // Sync tab with URL params
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && ["tasks", "referral", "history"].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // Trigger share modal after switching to referral tab
  useEffect(() => {
    if (activeTab === 'referral' && pendingShareRef.current) {
      pendingShareRef.current = false;
      // Small delay to ensure UI has updated
      setTimeout(() => {
        setShowShareModal(true);
      }, 300);
    }
  }, [activeTab]);

  // Handle "Go Complete" action for tasks
  const handleGoComplete = (task: TaskWithProgress) => {
    const action = task.trigger_condition?.action as string;
    
    if (action === 'share_x') {
      // Switch to referral tab and trigger X share
      pendingShareRef.current = true;
      setActiveTab('referral');
    } else if (action === 'first_trade') {
      // Navigate to trading page
      navigate('/');
    } else if (action === 'referral_qualified') {
      // Switch to referral tab to invite friends
      setActiveTab('referral');
    }
  };

  if (!user) {
    return (
      <LoginPrompt 
        title="Rewards Center"
        description="Sign in to access your rewards and earn points!" 
      />
    );
  }

  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const minRedeemThreshold = config?.min_redeem_threshold?.points || 100;
  const canRedeem = pointsBalance >= minRedeemThreshold;

  const content = (
    <div className="space-y-6">
      {/* Points Balance Card */}
      <Card className="trading-card p-6 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Points Balance</p>
              <p className="text-3xl font-bold text-primary font-mono">{pointsBalance.toLocaleString()}</p>
            </div>
          </div>
          <Button
            onClick={() => setRedeemDialogOpen(true)}
            disabled={!canRedeem}
            className="btn-primary"
          >
            <Gift className="w-4 h-4 mr-2" />
            Redeem
          </Button>
        </div>
        
        {frozenPoints > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Lock className="w-3 h-3" />
            <span>{frozenPoints.toLocaleString()} points frozen</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Lifetime Earned</span>
          <span className="font-medium">{lifetimeEarned.toLocaleString()} pts</span>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Expires: Dec 31, 2026</span>
            <span>Min. {minRedeemThreshold} pts to redeem</span>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="referral">Referral</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-4 space-y-3">
          {/* Task Progress - Now inside Tasks tab */}
          <Card className="trading-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                Task Progress
              </h3>
              <span className="text-sm text-muted-foreground">{completedCount}/{totalCount}</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </Card>

          {tasks.length === 0 ? (
            <Card className="trading-card p-8 text-center">
              <Gift className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No tasks available</p>
            </Card>
          ) : (
            tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onClaim={claimReward} 
                isClaiming={isClaiming}
                onGoComplete={handleGoComplete}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="referral" className="mt-4">
          <ReferralCard 
            externalShareModalOpen={showShareModal}
            onExternalShareModalChange={setShowShareModal}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <PointsHistoryList />
        </TabsContent>
      </Tabs>
    </div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background pb-24">
        {/* Mobile Header - Title Only mode per Style Guide */}
        <MobileHeader 
          title="Rewards Center"
          showLogo={false}
        />

        <main className="p-4">
          {content}
        </main>

        <BottomNav />
        <TreasureDropButton />
        <RedeemDialog open={redeemDialogOpen} onOpenChange={setRedeemDialogOpen} />
      </div>
    );
  }

  // Desktop
  return (
    <div className="min-h-screen bg-background">
      <EventsDesktopHeader />
      
      <main className="max-w-2xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Gift className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Rewards Center</h1>
            <p className="text-muted-foreground text-sm">Complete tasks, earn points, redeem rewards</p>
          </div>
        </div>

        {content}
      </main>

      <TreasureDropButton />
      <RedeemDialog open={redeemDialogOpen} onOpenChange={setRedeemDialogOpen} />
    </div>
  );
}
