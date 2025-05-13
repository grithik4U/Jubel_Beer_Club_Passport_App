import { useQuery } from "@tanstack/react-query";
import { Badge } from "@shared/schema";
import { BADGE_COLORS, DEFAULT_BADGE_IMAGES } from "@/lib/constants";
import { useAuth } from "./use-auth";

interface UseBadgesOptions {
  onBadgeUnlock?: (badge: Badge) => void;
}

export function useBadges(options?: UseBadgesOptions) {
  const { user } = useAuth();
  
  // Mock data for when badges aren't loaded yet
  const mockBadges = [
    {
      id: 1,
      name: "First Sip",
      description: "Your first check-in",
      icon_url: DEFAULT_BADGE_IMAGES.FIRST_SIP,
      threshold: 1,
      badge_type: "checkins",
      color: BADGE_COLORS.BRONZE,
      unlocked: true,
      current: 1
    },
    {
      id: 2,
      name: "Brew Explorer",
      description: "10 different venues",
      icon_url: DEFAULT_BADGE_IMAGES.BREW_EXPLORER,
      threshold: 10,
      badge_type: "venues",
      color: BADGE_COLORS.SILVER,
      unlocked: user?.total_checkins && user.total_checkins >= 10,
      current: user?.total_checkins || 0
    },
    {
      id: 3,
      name: "Enthusiast",
      description: "25 total check-ins",
      icon_url: DEFAULT_BADGE_IMAGES.ENTHUSIAST,
      threshold: 25,
      badge_type: "checkins",
      color: BADGE_COLORS.GOLD,
      unlocked: user?.total_checkins && user.total_checkins >= 25,
      current: user?.total_checkins || 0
    },
    {
      id: 4,
      name: "Connoisseur",
      description: "50 total check-ins",
      icon_url: DEFAULT_BADGE_IMAGES.CONNOISSEUR,
      threshold: 50,
      badge_type: "checkins",
      color: BADGE_COLORS.GOLD,
      unlocked: user?.total_checkins && user.total_checkins >= 50,
      current: user?.total_checkins || 0
    },
    {
      id: 5,
      name: "Brewery Master",
      description: "25 different venues",
      icon_url: DEFAULT_BADGE_IMAGES.BREW_EXPLORER,
      threshold: 25,
      badge_type: "venues",
      color: BADGE_COLORS.GOLD,
      unlocked: false,
      current: 10
    },
    {
      id: 6,
      name: "Weekend Warrior",
      description: "10 weekend check-ins",
      icon_url: DEFAULT_BADGE_IMAGES.ENTHUSIAST,
      threshold: 10,
      badge_type: "special",
      color: BADGE_COLORS.SILVER,
      unlocked: false,
      current: 8
    }
  ];
  
  // Fetch badges from API
  const { data: badges, isLoading, error } = useQuery<(Badge & { unlocked?: boolean, current?: number })[]>({
    queryKey: ["/api/badges"],
    placeholderData: mockBadges,
  });
  
  return {
    badges,
    isLoading,
    error
  };
}
