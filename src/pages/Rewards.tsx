import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Gift, Star, Trophy, Lock } from "lucide-react";
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
        className={`trading-card p-4 transition-all duration-200 ${
          isClaimed ? 'opacity-60' : isClaimable ? 'border-primary/30' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isClaimed ? 'bg-muted' : isClaimable ? 'bg-primary/10' : 'bg-muted'
          }`}>
            <TaskIcon 
              icon={task.icon} 
              size={20} 
              className={isClaimed ? 'text-trading-green' : isClaimable ? 'text-primary' : 'text-muted-foreground'} 
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{task.name}</h4>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{task.description}</p>
          </div>

          {/* Points + Action */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <span className={`font-bold text-sm ${isClaimable ? 'text-primary' : 'text-muted-foreground'}`}>
                +{task.reward_points}
              </span>
              <p className="text-xs text-muted-foreground">points</p>
            </div>

            {isClaimed ? (
              <Badge variant="success" className="min-w-[70px] justify-center">
                Claimed
              </Badge>
            ) : isClaimable ? (
              <Button 
                size="sm" 
                className="btn-primary min-w-[70px]"
                onClick={() => claimReward(task.id)}
                disabled={isClaiming}
              >
                Claim
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled className="min-w-[70px]">
                Pending
              </Button>
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
