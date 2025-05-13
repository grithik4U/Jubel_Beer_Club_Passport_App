import { Badge } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface BadgeUnlockModalProps {
  badge: Badge;
  isOpen: boolean;
  onClose: () => void;
}

export function BadgeUnlockModal({ badge, isOpen, onClose }: BadgeUnlockModalProps) {
  // Get badge color for styling
  const getBadgeColorClass = (color: string) => {
    switch (color) {
      case "bronze": return "text-amber-700";
      case "silver": return "text-gray-500";
      case "gold": return "text-yellow-500";
      default: return "text-primary";
    }
  };
  
  const badgeColorClass = getBadgeColorClass(badge.color);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader className="bg-primary p-6 text-center text-white -mt-6 -mx-6 rounded-t-lg">
          <DialogTitle className="text-2xl font-bold font-header">Congratulations!</DialogTitle>
          <DialogDescription className="text-white opacity-90">
            You've unlocked a new badge
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 text-center">
          <img 
            src={badge.icon_url || `https://placehold.co/200x200/F9A825/FFFFFF/svg?text=${badge.name?.charAt(0)}`} 
            alt={`${badge.name} Badge`} 
            className="w-32 h-32 mx-auto mb-4 badge-unlocked" 
          />
          
          <h4 className={`text-xl font-bold ${badgeColorClass} font-header mb-2`}>
            {badge.name}
          </h4>
          <p className="text-gray-600 mb-4">
            {badge.description}
          </p>
          
          <p className="text-sm text-primary font-semibold mb-6">
            New reward unlocked! Check your rewards tab.
          </p>
          
          <Button onClick={onClose} className="bg-primary hover:bg-accent text-white">
            Awesome!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BadgeUnlockModal;
