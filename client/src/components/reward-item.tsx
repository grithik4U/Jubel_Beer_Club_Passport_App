import { Button } from "@/components/ui/button";
import { Reward } from "@shared/schema";
import { useRewards } from "@/hooks/use-rewards";
import { Ticket } from "lucide-react";

interface RewardItemProps {
  reward: Reward & {
    badge_name?: string;
  };
  redeemed?: boolean;
}

export function RewardItem({ reward, redeemed = false }: RewardItemProps) {
  const { redeemReward, isRedeeming } = useRewards();
  
  const handleRedeem = () => {
    redeemReward(reward.id);
  };
  
  // Function to calculate expiry date from the reward
  const getExpiryText = (reward: Reward) => {
    if (!reward.expiry_days) return "Never expires";
    
    const expiryDate = new Date();
    if (reward.redeemed) {
      // Show redeemed date instead
      return `Redeemed on ${new Date().toLocaleDateString()}`;
    }
    
    expiryDate.setDate(expiryDate.getDate() + reward.expiry_days);
    return `Expires in ${reward.expiry_days} days`;
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${redeemed ? "opacity-70" : ""}`}>
      <div className="flex items-start p-4">
        <div className={`rounded-lg ${redeemed ? "bg-gray-200" : "bg-primary/10"} p-3 mr-3`}>
          <Ticket className={`h-6 w-6 ${redeemed ? "text-gray-500" : "text-primary"}`} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold">{reward.details}</h4>
          <p className="text-sm text-gray-600 mb-2">
            From unlocking "{reward.badge_name}" badge
          </p>
          <p className={`text-xs ${redeemed ? "text-green-600" : "text-gray-600"}`}>
            {getExpiryText(reward)}
          </p>
        </div>
        {!redeemed && (
          <Button
            onClick={handleRedeem}
            disabled={isRedeeming}
            className="bg-primary hover:bg-accent text-white px-4 py-1.5 rounded-md text-sm"
          >
            {reward.redeemed ? "Claimed" : "Redeem"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default RewardItem;
