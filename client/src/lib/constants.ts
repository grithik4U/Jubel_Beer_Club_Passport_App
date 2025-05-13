// Badge Types
export const BADGE_TYPES = {
  VENUES: "venues",
  CHECKINS: "checkins",
  ACHIEVEMENTS: "achievements",
  SPECIAL: "special"
};

// Badge Colors
export const BADGE_COLORS = {
  BRONZE: "bronze",
  SILVER: "silver",
  GOLD: "gold"
};

// Badge Level Thresholds
export const BADGE_LEVELS = {
  ROOKIE: { 
    title: "Rookie", 
    minBadges: 0,
    maxBadges: 7,
    color: "text-gray-500"
  },
  EXPLORER: { 
    title: "Explorer", 
    minBadges: 8, 
    maxBadges: 9,
    color: "text-amber-700" // bronze
  },
  ENTHUSIAST: { 
    title: "Enthusiast", 
    minBadges: 10, 
    maxBadges: 11,
    color: "text-gray-500" // silver
  },
  BREW_MASTER: { 
    title: "Brew Master", 
    minBadges: 12, 
    maxBadges: 100,
    color: "text-yellow-500" // gold
  }
};

// Default Badge Image URLs (as placeholders)
export const DEFAULT_BADGE_IMAGES = {
  FIRST_SIP: "https://pixabay.com/get/gafef40fabb7de509c042774715f334a27c4d2ccb7799c295b0f98750c6e56be791c5dfc1619297c2704ea91d1bf737371ae21796878819e5ee1a9699537d4612_1280.jpg",
  BREW_EXPLORER: "https://pixabay.com/get/g043df70e2e78845b45835b2916318db1e0c2c439202fe13dd10a68d44ed6a403f6f964a1872d564c01e9f5761f7781d6145d7de8924552a35b1cd5ce4b23c1d0_1280.jpg",
  ENTHUSIAST: "https://pixabay.com/get/g197614cc66e4fac6ab24c7dad92dd69145e414a0cb2806969bdb8cd7e5a278a81992bd633e470906d75500b2c920c6a913ef6e413741279ef50ec693bbd7992f_1280.jpg",
  CONNOISSEUR: "https://pixabay.com/get/g197614cc66e4fac6ab24c7dad92dd69145e414a0cb2806969bdb8cd7e5a278a81992bd633e470906d75500b2c920c6a913ef6e413741279ef50ec693bbd7992f_1280.jpg"
};

// Default Venue Image URLs (as placeholders)
export const DEFAULT_VENUE_IMAGES = [
  "https://images.unsplash.com/photo-1559526642-c3f001ea68ee",
  "https://images.unsplash.com/photo-1555658636-6e4a36218be7",
  "https://images.unsplash.com/photo-1600788886242-5c96aabe3757",
  "https://images.unsplash.com/photo-1566633806327-68e152aaf26d",
  "https://images.unsplash.com/photo-1584225064536-d0fbc0a10f18"
];
