import { useQuery } from "@tanstack/react-query";
import { Venue } from "@shared/schema";
import { DEFAULT_VENUE_IMAGES } from "@/lib/constants";

export function useVenues() {
  // Fetch all venues
  const { data: allVenues, isLoading: isLoadingAll } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });
  
  // Fetch nearby venues
  const { data: nearbyVenues, isLoading: isLoadingNearby } = useQuery<Venue[]>({
    queryKey: ["/api/venues/nearby"],
    // Generate placeholder data for demo purposes
    placeholderData: [
      {
        id: 1,
        name: "Hopworks Urban Brewery",
        address: "2944 SE Powell Blvd, Portland, OR",
        lat: "45.4979",
        lng: "-122.6352",
        image_url: DEFAULT_VENUE_IMAGES[0],
        description: "Eco-friendly brewpub with organic beers",
        rating: 4.5,
        distance: "0.3 miles"
      },
      {
        id: 2,
        name: "The Beer Mongers",
        address: "1125 SE Division St, Portland, OR",
        lat: "45.5048",
        lng: "-122.6541",
        image_url: DEFAULT_VENUE_IMAGES[1],
        description: "Laid-back beer bar with huge selection",
        rating: 4.0,
        distance: "0.7 miles"
      },
      {
        id: 3,
        name: "Great Notion Brewing",
        address: "2204 NE Alberta St, Portland, OR",
        lat: "45.5589",
        lng: "-122.6426",
        image_url: DEFAULT_VENUE_IMAGES[2],
        description: "Inventive brewing with hazy IPAs and culinary-inspired flavors",
        rating: 5.0,
        distance: "1.2 miles"
      }
    ]
  });
  
  return {
    venues: nearbyVenues,
    allVenues,
    isLoading: isLoadingNearby || isLoadingAll
  };
}
