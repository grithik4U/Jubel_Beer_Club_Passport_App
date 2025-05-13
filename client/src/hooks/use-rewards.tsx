import { useMutation, useQuery } from "@tanstack/react-query";
import { Reward } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useRewards() {
  const { toast } = useToast();
  
  // Fetch rewards from API
  const { data: rewards, isLoading } = useQuery<Reward[]>({
    queryKey: ["/api/rewards"],
  });
  
  // Split rewards into available and redeemed
  const availableRewards = rewards?.filter(reward => !reward.redeemed) || [];
  const redeemedRewards = rewards?.filter(reward => reward.redeemed) || [];
  
  // Redeem reward mutation
  const { mutate, isPending: isRedeeming } = useMutation({
    mutationFn: async (rewardId: number) => {
      const res = await apiRequest("POST", "/api/rewards/redeem", { reward_id: rewardId });
      return await res.json();
    },
    onSuccess: (data) => {
      // Invalidate rewards query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/rewards"] });
      
      // Show success message
      toast({
        title: "Reward Redeemed!",
        description: "Check your email for redemption details.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Redemption Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  return {
    rewards,
    availableRewards,
    redeemedRewards,
    redeemReward: mutate,
    isRedeeming,
    isLoading
  };
}
