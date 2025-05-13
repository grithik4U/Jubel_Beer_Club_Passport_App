import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useCheckIn } from "@/hooks/use-check-in";

interface CheckInButtonProps {
  venueId?: number;
  onCheckInSuccess?: (data: any) => void;
}

export function CheckInButton({ venueId, onCheckInSuccess }: CheckInButtonProps) {
  const { checkIn, isPending } = useCheckIn();
  
  const handleCheckIn = async () => {
    if (!venueId) return;
    
    try {
      const result = await checkIn(venueId);
      if (onCheckInSuccess) {
        onCheckInSuccess(result);
      }
    } catch (error) {
      console.error("Check-in failed", error);
    }
  };
  
  return (
    <Button
      onClick={handleCheckIn}
      disabled={isPending || !venueId}
      className="w-full bg-primary hover:bg-accent text-white font-bold py-4 px-6 rounded-lg shadow-lg flex items-center justify-center mb-4 transition-all duration-300"
    >
      <MapPin className="h-6 w-6 mr-2" />
      <span className="text-lg">{isPending ? "Checking in..." : "Check In Now"}</span>
    </Button>
  );
}

export default CheckInButton;
