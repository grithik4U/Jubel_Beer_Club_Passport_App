import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { useAuth } from "./use-auth";

interface UseLeaderboardOptions {
  city?: string;
}

export function useLeaderboard(options?: UseLeaderboardOptions) {
  const { user } = useAuth();
  const { city } = options || {};
  
  // Construct query key based on city filter
  const queryKey = city 
    ? ["/api/leaderboard", { city }] 
    : ["/api/leaderboard"];
  
  // Fetch leaderboard data
  const { data, isLoading, error } = useQuery<(User & { rank: number, badge_count: number })[]>({
    queryKey,
  });
  
  // Add current user to the leaderboard if not already present
  const leaderboard = data || [];
  
  return {
    leaderboard,
    isLoading,
    error
  };
}
