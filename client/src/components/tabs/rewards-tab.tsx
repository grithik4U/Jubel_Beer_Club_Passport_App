import { useRewards } from "@/hooks/use-rewards";
import RewardItem from "@/components/reward-item";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function RewardsTab() {
  const { 
    availableRewards, 
    redeemedRewards, 
    isLoading 
  } = useRewards();
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold font-header text-secondary mb-4">My Rewards</h2>
      
      {/* Rewards Summary */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">Rewards Available</p>
            <p className="text-sm text-gray-600">Unlock rewards with badges</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {isLoading ? '...' : availableRewards?.length || 0}
            </p>
            <p className="text-xs text-gray-600">Available</p>
          </div>
        </div>
      </div>
      
      {/* Available Rewards */}
      <h3 className="text-lg font-bold font-header text-secondary mb-3">Available Rewards</h3>
      
      {isLoading ? (
        // Loading skeleton for available rewards
        <div className="space-y-4 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex items-start p-4">
                <Skeleton className="w-12 h-12 rounded-lg mr-3" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-40 mb-1" />
                  <Skeleton className="h-3 w-60 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="w-16 h-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : availableRewards && availableRewards.length > 0 ? (
        <div className="space-y-4 mb-6">
          {availableRewards.map(reward => (
            <RewardItem key={reward.id} reward={reward} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center mb-6">
          <p className="text-gray-500">
            No rewards available yet. Unlock badges to earn rewards!
          </p>
        </div>
      )}
      
      {/* Redeemed Rewards */}
      <h3 className="text-lg font-bold font-header text-secondary mb-3">Redeemed Rewards</h3>
      
      {isLoading ? (
        // Loading skeleton for redeemed rewards
        <div className="space-y-4 mb-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden opacity-70">
              <div className="flex items-start p-4">
                <Skeleton className="w-12 h-12 rounded-lg mr-3" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-40 mb-1" />
                  <Skeleton className="h-3 w-60 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : redeemedRewards && redeemedRewards.length > 0 ? (
        <div className="space-y-4">
          {redeemedRewards.map(reward => (
            <RewardItem key={reward.id} reward={reward} redeemed={true} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">
            You haven't redeemed any rewards yet.
          </p>
        </div>
      )}
      
      {/* Upcoming Rewards */}
      <h3 className="text-lg font-bold font-header text-secondary mt-6 mb-3">Upcoming Rewards</h3>
      <div className="bg-white rounded-lg shadow-md p-4">
        <h4 className="font-bold mb-3">Next Reward: Connoisseur Badge</h4>
        
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm">Badge Progress</p>
          <p className="text-sm">32/50 check-ins</p>
        </div>
        <Progress value={64} className="h-2.5 mb-4" />
        
        <div className="p-3 bg-gray-100 rounded-lg">
          <p className="font-semibold mb-1">Reward Preview:</p>
          <p className="text-sm">
            Free Jubel Beer Club T-shirt + 25% off your next purchase at any partner brewery
          </p>
        </div>
      </div>
    </div>
  );
}
