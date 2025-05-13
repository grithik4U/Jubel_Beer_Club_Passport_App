import { useState } from "react";
import { useBadges } from "@/hooks/use-badges";
import BadgeCard from "@/components/badge-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

type BadgeCategory = "all" | "venues" | "checkins" | "achievements" | "special";

export default function BadgesTab() {
  const { badges, isLoading } = useBadges();
  const [activeCategory, setActiveCategory] = useState<BadgeCategory>("all");
  
  // Filter badges by category
  const filteredBadges = badges?.filter(badge => {
    if (activeCategory === "all") return true;
    return badge.badge_type === activeCategory;
  });
  
  // Count unlocked badges
  const unlockedCount = badges?.filter(badge => badge.unlocked).length || 0;
  const totalBadges = badges?.length || 0;
  const collectionProgress = totalBadges > 0 ? (unlockedCount / totalBadges) * 100 : 0;
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold font-header text-secondary mb-4">My Badges</h2>
      
      {/* Badge Collection Summary */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">Badge Collection</p>
            <p className="text-sm text-gray-600">Unlock badges by visiting venues</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{unlockedCount}</p>
            <p className="text-xs text-gray-600">Unlocked</p>
          </div>
        </div>
        
        {/* Badge Progress */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium">Collection Progress</p>
            <p className="text-sm font-medium">{unlockedCount}/{totalBadges}</p>
          </div>
          <Progress value={collectionProgress} className="h-2.5" />
        </div>
      </div>
      
      {/* Badge Categories */}
      <div className="flex overflow-x-auto space-x-2 py-2 mb-4 no-scrollbar">
        <Button
          onClick={() => setActiveCategory("all")}
          className={`rounded-full text-sm whitespace-nowrap px-4 py-1.5 ${
            activeCategory === "all" 
              ? "bg-primary text-white" 
              : "bg-white text-neutral-dark"
          }`}
          variant="ghost"
        >
          All Badges
        </Button>
        <Button
          onClick={() => setActiveCategory("venues")}
          className={`rounded-full text-sm whitespace-nowrap px-4 py-1.5 ${
            activeCategory === "venues" 
              ? "bg-primary text-white" 
              : "bg-white text-neutral-dark"
          }`}
          variant="ghost"
        >
          Venues
        </Button>
        <Button
          onClick={() => setActiveCategory("checkins")}
          className={`rounded-full text-sm whitespace-nowrap px-4 py-1.5 ${
            activeCategory === "checkins" 
              ? "bg-primary text-white" 
              : "bg-white text-neutral-dark"
          }`}
          variant="ghost"
        >
          Check-ins
        </Button>
        <Button
          onClick={() => setActiveCategory("achievements")}
          className={`rounded-full text-sm whitespace-nowrap px-4 py-1.5 ${
            activeCategory === "achievements" 
              ? "bg-primary text-white" 
              : "bg-white text-neutral-dark"
          }`}
          variant="ghost"
        >
          Achievements
        </Button>
        <Button
          onClick={() => setActiveCategory("special")}
          className={`rounded-full text-sm whitespace-nowrap px-4 py-1.5 ${
            activeCategory === "special" 
              ? "bg-primary text-white" 
              : "bg-white text-neutral-dark"
          }`}
          variant="ghost"
        >
          Special
        </Button>
      </div>
      
      {/* Badge Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-md p-3">
              <Skeleton className="w-16 h-16 mx-auto mb-2 rounded-full" />
              <div className="text-center">
                <Skeleton className="h-5 w-20 mx-auto mb-1" />
                <Skeleton className="h-3 w-24 mx-auto mb-1" />
                <Skeleton className="h-2 w-16 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredBadges?.map(badge => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
          
          {/* Show message if no badges in category */}
          {(!filteredBadges || filteredBadges.length === 0) && (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No badges found in this category.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
