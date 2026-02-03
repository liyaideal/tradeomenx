import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Gift, Star, Trophy, Lock, Sparkles, CheckCircle2 } from "lucide-react";
import { TaskIcon } from "@/components/rewards/TaskIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
import { LoginPrompt } from "@/components/LoginPrompt";

export default function Rewards() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useUserProfile();
  const { pointsBalance, frozenPoints, lifetimeEarned, config, isLoading: isLoadingPoints } = usePoints();
  const { tasks, completedCount, totalCount, claimReward, isClaiming, refreshTaskStatus } = useTasks();
  const { referralCode, stats: referralStats } = useReferral();
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);

  // Refresh task status when component mounts
  useEffect(() => {
    if (user) {
      refreshTaskStatus();
    }
  }, [user]);

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

  const TaskCard = ({ task }: { task: TaskWithProgress }) => {
    const isPending = !task.isCompleted && !task.isClaimed;
    const isClaimable = task.isCompleted && !task.isClaimed;
    const isClaimed = task.isClaimed;

    return (
      <Card
        className={`trading-card overflow-hidden transition-all duration-200 ${
          isClaimed ? 'opacity-60' : isClaimable ? 'border-primary/40 glow-primary' : ''
        }`}
      >
        {/* Achievement Badge Style Layout */}
        <div className="p-4">
          {/* Top: Large Icon + Status Badge */}
          <div className="flex items-start justify-between mb-3">
            {/* Achievement Icon */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isClaimed 
                ? 'bg-trading-green/10 ring-2 ring-trading-green/30' 
                : isClaimable 
                  ? 'bg-primary/15 ring-2 ring-primary/40' 
                  : 'bg-muted'
            }`}>
              {isClaimed ? (
                <CheckCircle2 className="w-5 h-5 text-trading-green" />
              ) : (
                <TaskIcon 
                  icon={task.icon} 
                  size={20} 
                  className={isClaimable ? 'text-primary' : 'text-muted-foreground'} 
                />
              )}
            </div>

            {/* Points Reward Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
              isClaimable 
                ? 'bg-primary/15 text-primary' 
                : 'bg-muted text-muted-foreground'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-bold text-sm font-mono">+{task.reward_points}</span>
            </div>
          </div>

          {/* Middle: Title + Description */}
          <div className="mb-4">
            <h4 className="font-semibold text-base mb-1">{task.name}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
          </div>

          {/* Bottom: Action Area */}
          <div className="flex items-center justify-end">
            {isClaimed ? (
              <div className="flex items-center gap-2 text-trading-green">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            ) : isClaimable ? (
              <Button 
                className="btn-primary w-full"
                onClick={() => claimReward(task.id)}
                disabled={isClaiming}
              >
                <Gift className="w-4 h-4 mr-2" />
                Claim Reward
              </Button>
            ) : (
              <div className="w-full text-center py-2 text-sm text-muted-foreground border border-dashed border-border rounded-lg">
                Complete task to unlock
              </div>
            )}
          </div>
        </div>
      </Card>
    );
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

      {/* Task Progress */}
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

      {/* Tabs */}
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="referral">Referral</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-4 space-y-3">
          {tasks.length === 0 ? (
            <Card className="trading-card p-8 text-center">
              <Gift className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No tasks available</p>
            </Card>
          ) : (
            tasks.map(task => (
              <TaskCard key={task.id} task={task} />
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

      <RedeemDialog open={redeemDialogOpen} onOpenChange={setRedeemDialogOpen} />
    </div>
  );
}
