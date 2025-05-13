import { Venue } from "@shared/schema";
import { useCheckIn } from "@/hooks/use-check-in";
import { Button } from "@/components/ui/button";
import { MapPin, Star, StarHalf } from "lucide-react";

interface VenueCardProps {
  venue: Venue;
  onCheckInSuccess?: (data: any) => void;
}

export function VenueCard({ venue, onCheckInSuccess }: VenueCardProps) {
  const { checkIn, isPending } = useCheckIn();
  
  const handleCheckIn = async () => {
    try {
      const result = await checkIn(venue.id);
      if (onCheckInSuccess) {
        onCheckInSuccess(result);
      }
    } catch (error) {
      console.error("Check-in failed", error);
    }
  };
  
  // Function to render star ratings
  const renderRating = (rating: number = 0) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 text-accent fill-current" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 text-accent fill-current" />);
    }
    
    // Add empty stars to make 5 total
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-accent" />);
    }
    
    return stars;
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <img 
        src={venue.image_url || 'https://placehold.co/800x300/EFCA99/ffffff?text=Brewery'} 
        alt={venue.name} 
        className="w-full h-36 object-cover" 
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-lg">{venue.name}</h4>
            <p className="text-sm text-gray-600">{venue.distance} away • Open now</p>
            <div className="flex items-center mt-1">
              <div className="flex">
                {renderRating(venue.rating)}
              </div>
              <span className="text-xs text-gray-600 ml-1">
                ({venue.rating ? (venue.rating * 25).toFixed(0) : '0'} ratings)
              </span>
            </div>
          </div>
          <Button
            onClick={handleCheckIn}
            disabled={isPending}
            size="icon"
            className="bg-primary hover:bg-accent text-white p-2 rounded-full"
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default VenueCard;
