import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Gift, Star, Trophy, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Logo } from "@/components/Logo";
import { MobileDrawer } from "@/components/ui/mobile-drawer";
import { REWARDS_PAUSED_TITLE, REWARDS_PAUSED_DESCRIPTION } from "@/lib/rewardsPause";
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
import { XShareConfirmDialog } from "@/components/rewards/XShareConfirmDialog";
import { AuthGateOverlay } from "@/components/AuthGateOverlay";
import { useConnectedAccounts } from "@/hooks/useConnectedAccounts";
import { toast } from "sonner";

export default function Rewards() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const { user } = useUserProfile();
  const { pointsBalance, frozenPoints, lifetimeEarned, config, isLoading: isLoadingPoints } = usePoints();
  const { tasks, completedCount, totalCount, claimReward, isClaiming, refreshTaskStatus } = useTasks();
  const { referralCode, referralLink, stats: referralStats } = useReferral();
  const { activeAccounts } = useConnectedAccounts();
  const hasConnectedAccount = activeAccounts.length > 0;
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);
  const [xShareDialogOpen, setXShareDialogOpen] = useState(false);
  
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


  // Handle "Go Complete" action for tasks
  const handleGoComplete = (task: TaskWithProgress) => {
    const action = task.trigger_condition?.action as string;
    
    if (action === 'share_x') {
      setXShareDialogOpen(true);
    } else if (action === 'first_trade') {
      navigate('/');
    } else if (action === 'referral_qualified') {
      setActiveTab('referral');
    } else if (action === 'join_discord') {
      window.open("https://discord.gg/qXssm2crf9", "_blank", "noopener,noreferrer");
    } else if (action === 'connect_external') {
      navigate('/settings');
    } else if (action === 'activate_airdrop') {
      navigate('/portfolio/airdrops');
    }
  };

  const isGuest = !user;

  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  // Redemption is paused for mainnet launch — config-derived threshold kept for future use.
  void config;

  // Tweet content for X share task
  const tweetContent = `🎯 What if you could trade predictions with leverage? Now you can. OmenX Beta is LIVE - claim test funds & earn points. Join now 👇\n${referralLink}`;

  const handleXShareConfirm = () => {
    // TODO: Call edge function to authorize & post via X API
    console.log("X share confirmed — will call API");
    setXShareDialogOpen(false);
  };

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
            className="btn-primary opacity-60 hover:opacity-70"
            onClick={() =>
              toast("Redemption reopening soon", {
                description: "Points redemption is paused for mainnet launch. Stay tuned.",
              })
            }
          >
            {!isMobile && <Gift className="w-4 h-4 mr-2" />}
            Coming Soon
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
                prerequisiteBlocked={
                  (task.trigger_condition?.action as string) === 'activate_airdrop' && !hasConnectedAccount
                }
                prerequisiteHint="Connect an external account first"
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="referral" className="mt-4">
          <ReferralCard />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <PointsHistoryList />
        </TabsContent>
      </Tabs>
    </div>
  );

  const pausedContent = (
    <div className="flex flex-col items-center text-center py-2">
      <Logo size="xl" className="mb-4" />
      <h2 className="text-xl font-bold text-foreground mb-2">{REWARDS_PAUSED_TITLE}</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {REWARDS_PAUSED_DESCRIPTION}
      </p>
    </div>
  );

  const pausedDialogDesktop = (
    <Dialog open={true}>
      <DialogContent
        className="sm:max-w-md border-primary/30 bg-gradient-to-b from-background to-background/95 [&>button]:hidden"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">{REWARDS_PAUSED_TITLE}</DialogTitle>
        <DialogDescription className="sr-only">{REWARDS_PAUSED_DESCRIPTION}</DialogDescription>
        {pausedContent}
      </DialogContent>
    </Dialog>
  );

  const pausedDrawerMobile = (
    <MobileDrawer
      open={true}
      onOpenChange={() => {}}
      showHandle={false}
      hideCloseButton={true}
      className="bg-gradient-to-b from-background to-background/95"
    >
      {pausedContent}
    </MobileDrawer>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background pb-24">
        {/* Mobile Header - Title Only mode per Style Guide */}
        <MobileHeader 
          title="Rewards Center"
          showLogo={false}
        />

        <AuthGateOverlay title="Rewards Center" description="Sign in to access your rewards and earn points!" maxPreviewHeight="400px">
        <main className="p-4">
          {content}
        </main>
        </AuthGateOverlay>

        <BottomNav />
        <RedeemDialog open={redeemDialogOpen} onOpenChange={setRedeemDialogOpen} />
        <XShareConfirmDialog
          open={xShareDialogOpen}
          onOpenChange={setXShareDialogOpen}
          tweetContent={tweetContent}
          referralLink={referralLink}
          onConfirm={handleXShareConfirm}
        />
        {pausedDrawerMobile}
      </div>
    );
  }

  // Desktop
  return (
    <div className="min-h-screen bg-background">
      <EventsDesktopHeader />
      
      <AuthGateOverlay title="Rewards Center" description="Sign in to access your rewards and earn points!">
      <main className="max-w-2xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Gift className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Rewards Center</h1>
            <p className="text-muted-foreground text-sm">Complete tasks, earn points — redemption opening soon</p>
          </div>
        </div>

        {content}
      </main>
      </AuthGateOverlay>

      <RedeemDialog open={redeemDialogOpen} onOpenChange={setRedeemDialogOpen} />
      <XShareConfirmDialog
        open={xShareDialogOpen}
        onOpenChange={setXShareDialogOpen}
        tweetContent={tweetContent}
        referralLink={referralLink}
        onConfirm={handleXShareConfirm}
      />
      {pausedDialogDesktop}
    </div>
  );
}
