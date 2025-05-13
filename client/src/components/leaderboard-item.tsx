import { User } from "@shared/schema";

interface LeaderboardItemProps {
  user: User & { 
    rank: number;
    badge_count: number;
  };
  isCurrentUser?: boolean;
}

export function LeaderboardItem({ user, isCurrentUser = false }: LeaderboardItemProps) {
  const { name, city, total_checkins, rank, badge_count } = user;
  
  // Determine what badge level the user has based on badge count
  const getBadgeLevel = (count: number) => {
    if (count >= 12) return { title: "Brew Master", color: "text-yellow-500" };
    if (count >= 10) return { title: "Enthusiast", color: "text-gray-500" };
    if (count >= 8) return { title: "Explorer", color: "text-amber-700" };
    return { title: "Rookie", color: "text-gray-500" };
  };
  
  const badgeLevel = getBadgeLevel(badge_count);
  
  // Get medal icon based on rank
  const getMedalIcon = (rank: number) => {
    if (rank === 1) return "ri-medal-fill text-yellow-500";
    if (rank === 2) return "ri-medal-fill text-gray-500";
    if (rank === 3) return "ri-medal-fill text-amber-700";
    return "ri-medal-line text-gray-500";
  };
  
  const medalClass = getMedalIcon(rank);
  
  return (
    <div className={`flex items-center p-4 border-b border-gray-100 ${isCurrentUser ? "bg-gray-50" : ""}`}>
      <span className="font-bold text-lg w-8">#{rank}</span>
      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3 text-primary font-bold">
        {name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1">
        <p className="font-semibold">{name}</p>
        <div className="flex items-center">
          <i className={`${medalClass} mr-1`}></i>
          <p className="text-xs text-gray-600">{badgeLevel.title} ({badge_count} badges)</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-primary">{total_checkins}</p>
        <p className="text-xs text-gray-600">check-ins</p>
      </div>
    </div>
  );
}

export default LeaderboardItem;
