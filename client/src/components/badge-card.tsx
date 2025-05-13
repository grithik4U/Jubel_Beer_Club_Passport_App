import { cn } from "@/lib/utils";
import { Badge } from "@shared/schema";
import { Progress } from "@/components/ui/progress";

interface BadgeCardProps {
  badge: Badge & {
    unlocked?: boolean;
    unlocked_at?: Date;
    progress?: number;
    current?: number;
  };
}

export function BadgeCard({ badge }: BadgeCardProps) {
  const {
    name,
    description,
    icon_url,
    threshold,
    color = "bronze",
    unlocked = false,
    current = 0,
  } = badge;
  
  const progress = current > 0 ? Math.floor((current / threshold) * 100) : 0;
  
  // Badge colors based on the color field
  const textColor = unlocked
    ? color === "bronze"
      ? "text-amber-700"
      : color === "silver"
      ? "text-gray-500"
      : "text-yellow-500"
    : "text-gray-500";
  
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-md p-3",
      unlocked ? "badge-unlocked" : "opacity-70"
    )}>
      <div className="relative w-16 h-16 mx-auto mb-2">
        <img 
          src={icon_url || `https://placehold.co/64x64/F9A825/FFFFFF/svg?text=${name?.charAt(0)}`} 
          alt={`${name} Badge`} 
          className={cn(
            "w-full h-full object-contain",
            !unlocked && "grayscale"
          )}
        />
      </div>
      <div className="text-center">
        <h3 className={cn("font-bold", textColor)}>
          {name}
        </h3>
        <p className="text-xs text-gray-600 mt-1">{description}</p>
        
        {unlocked ? (
          <p className="text-xs text-green-600 mt-1">Unlocked</p>
        ) : (
          <>
            <Progress 
              value={progress} 
              className="h-1.5 mt-2" 
            />
            <p className="text-xs text-gray-600 mt-1">
              {current}/{threshold}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default BadgeCard;
