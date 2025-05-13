import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Checkin } from "@shared/schema";

interface UseCheckInOptions {
  onCheckInSuccess?: (data: any) => void;
}

export function useCheckIn(options?: UseCheckInOptions) {
  const { toast } = useToast();
  const [latestBadge, setLatestBadge] = useState<any>(null);
  
  // Fetch recent check-ins
  const { data: recentCheckins, isLoading } = useQuery<any[]>({
    queryKey: ["/api/checkins/history"],
  });
  
  // Check-in mutation
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (venueId: number) => {
      const res = await apiRequest("POST", "/api/checkins", { venue_id: venueId });
      return await res.json();
    },
    onSuccess: (data) => {
      // Update user data and check-in history
      queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/checkins/history"] });
      
      // If new badges were earned, track the latest one
      if (data.newBadges && data.newBadges.length > 0) {
        setLatestBadge(data.newBadges[0]);
        
        // Invalidate badges query
        queryClient.invalidateQueries({ queryKey: ["/api/badges"] });
        
        // If new rewards were earned, invalidate rewards query
        if (data.newRewards && data.newRewards.length > 0) {
          queryClient.invalidateQueries({ queryKey: ["/api/rewards"] });
        }
        
        // Show success message with badge
        toast({
          title: "Badge Unlocked!",
          description: `You've earned the "${data.newBadges[0].name}" badge!`,
        });
      } else {
        // Show success message
        toast({
          title: "Check-in Successful!",
          description: "Your visit has been recorded.",
        });
      }
      
      // Call the success callback if provided
      if (options?.onCheckInSuccess) {
        options.onCheckInSuccess(data);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Check-in Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  return {
    checkIn: mutateAsync,
    isPending,
    recentCheckins,
    isLoading,
    latestBadge,
  };
}
