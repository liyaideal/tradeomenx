import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Task {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  type: 'onboarding' | 'referral' | 'social' | 'retention';
  trigger_condition: Record<string, unknown>;
  reward_points: number;
  max_completions: number;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface UserTask {
  id: string;
  user_id: string;
  task_id: string;
  status: 'pending' | 'completed' | 'expired' | 'claimed';
  progress: Record<string, unknown>;
  completed_at: string | null;
  claimed_at: string | null;
  points_awarded: number | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown> | null;
}

export interface TaskWithProgress extends Task {
  userTask?: UserTask;
  canClaim: boolean;
  isCompleted: boolean;
  isClaimed: boolean;
}

export const useTasks = () => {
  const queryClient = useQueryClient();

  // Fetch all active tasks
  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as Task[];
    },
  });

  // Fetch user's task progress
  const { data: userTasks, isLoading: isLoadingUserTasks } = useQuery({
    queryKey: ['user-tasks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_tasks')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data as UserTask[];
    },
  });

  // Check task completion based on trigger conditions
  const checkTaskCompletion = async (task: Task): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const condition = task.trigger_condition;
    const action = condition.action as string;

    switch (action) {
      case 'register':
        // User is registered if they're logged in
        return true;

      case 'view_event':
        // Check if user has viewed any event (could track via analytics)
        // For now, assume true if they've been to the platform
        return true;

      case 'first_trade':
        // Check trades table
        const { data: trades } = await supabase
          .from('trades')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);
        return (trades?.length || 0) > 0;

      case 'referral_qualified':
        // Check if any referrals are qualified
        const { data: referrals } = await supabase
          .from('referrals')
          .select('id')
          .eq('referrer_id', user.id)
          .eq('status', 'qualified')
          .limit(1);
        return (referrals?.length || 0) > 0;

      case 'share_x':
        // This would be tracked separately when user shares
        return false;

      default:
        return false;
    }
  };

  // Combine tasks with user progress
  const tasksWithProgress: TaskWithProgress[] = (tasks || []).map(task => {
    const userTask = userTasks?.find(ut => ut.task_id === task.id);
    const isCompleted = userTask?.status === 'completed' || userTask?.status === 'claimed';
    const isClaimed = userTask?.status === 'claimed';
    const canClaim = userTask?.status === 'completed' && !isClaimed;

    return {
      ...task,
      userTask,
      canClaim,
      isCompleted,
      isClaimed,
    };
  });

  // Claim task reward
  const claimMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const task = tasks?.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');

      // Get or create user task
      const { data: existingUserTask } = await supabase
        .from('user_tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('task_id', taskId)
        .maybeSingle();

      // Check completion
      const isCompleted = await checkTaskCompletion(task);
      if (!isCompleted && !existingUserTask) {
        throw new Error('Task not completed yet');
      }

      if (existingUserTask?.status === 'claimed') {
        throw new Error('Reward already claimed');
      }

      // Create or update user task
      if (!existingUserTask) {
        const { error: createError } = await supabase
          .from('user_tasks')
          .insert({
            user_id: user.id,
            task_id: taskId,
            status: 'claimed',
            completed_at: new Date().toISOString(),
            claimed_at: new Date().toISOString(),
            points_awarded: task.reward_points,
          });
        
        if (createError) throw createError;
      } else {
        const { error: updateError } = await supabase
          .from('user_tasks')
          .update({
            status: 'claimed',
            claimed_at: new Date().toISOString(),
            points_awarded: task.reward_points,
          })
          .eq('id', existingUserTask.id);

        if (updateError) throw updateError;
      }

      // Get or create points account
      let { data: pointsAccount } = await supabase
        .from('points_accounts')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!pointsAccount) {
        const { data: newAccount, error: createError } = await supabase
          .from('points_accounts')
          .insert({ user_id: user.id, balance: 0 })
          .select()
          .single();
        
        if (createError) throw createError;
        pointsAccount = newAccount;
      }

      // Update points balance
      const newBalance = (pointsAccount?.balance || 0) + task.reward_points;
      const { error: pointsError } = await supabase
        .from('points_accounts')
        .update({ 
          balance: newBalance,
          lifetime_earned: (pointsAccount?.lifetime_earned || 0) + task.reward_points
        })
        .eq('user_id', user.id);

      if (pointsError) throw pointsError;

      // Add ledger entry
      await supabase
        .from('points_ledger')
        .insert({
          user_id: user.id,
          amount: task.reward_points,
          balance_after: newBalance,
          type: 'earn',
          source: 'task',
          source_id: taskId,
          description: `Completed task: ${task.name}`
        });

      return { task, pointsEarned: task.reward_points };
    },
    onSuccess: (data) => {
      toast.success(`+${data.pointsEarned} points earned!`, {
        description: data.task.name,
      });
      queryClient.invalidateQueries({ queryKey: ['user-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['points-account'] });
      queryClient.invalidateQueries({ queryKey: ['points-history'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Check and update task completion status
  const refreshTaskStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !tasks) return;

    for (const task of tasks) {
      const userTask = userTasks?.find(ut => ut.task_id === task.id);
      if (userTask?.status === 'claimed') continue;

      const isCompleted = await checkTaskCompletion(task);
      
      if (isCompleted && (!userTask || userTask.status === 'pending')) {
        if (userTask) {
          await supabase
            .from('user_tasks')
            .update({ status: 'completed', completed_at: new Date().toISOString() })
            .eq('id', userTask.id);
        } else {
          await supabase
            .from('user_tasks')
            .insert({
              user_id: user.id,
              task_id: task.id,
              status: 'completed',
              completed_at: new Date().toISOString(),
            });
        }
      }
    }

    queryClient.invalidateQueries({ queryKey: ['user-tasks'] });
  };

  return {
    tasks: tasksWithProgress,
    isLoading: isLoadingTasks || isLoadingUserTasks,
    claimReward: claimMutation.mutate,
    isClaiming: claimMutation.isPending,
    refreshTaskStatus,
    completedCount: tasksWithProgress.filter(t => t.isClaimed).length,
    totalCount: tasksWithProgress.length,
  };
};
