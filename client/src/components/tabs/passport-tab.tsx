import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useVenues } from "@/hooks/use-venues";
import { useCheckIn } from "@/hooks/use-check-in";
import CheckInButton from "@/components/check-in-button";
import VenueCard from "@/components/venue-card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@shared/schema";

interface PassportTabProps {
  onBadgeUnlock?: (badge: Badge) => void;
}

export default function PassportTab({ onBadgeUnlock }: PassportTabProps) {
  const { user } = useAuth();
  const { venues, isLoading: venuesLoading } = useVenues();
  const { recentCheckins, isLoading: checkinsLoading } = useCheckIn();
  const [selectedVenueId, setSelectedVenueId] = useState<number | undefined>(
    venues && venues.length > 0 ? venues[0].id : undefined
  );
  
  // Find next badge progress
  const nextBadgeThreshold = 40; // This would come from API in real app
  const currentProgress = user?.total_checkins || 0;
  const progressPercentage = Math.min(100, (currentProgress / nextBadgeThreshold) * 100);
  
  // Handle check-in success
  const handleCheckInSuccess = (result: any) => {
    // Show badge unlock modal if new badges were earned
    if (result.newBadges && result.newBadges.length > 0 && onBadgeUnlock) {
      onBadgeUnlock(result.newBadges[0]);
    }
  };
  
  // Update selected venue when venues are loaded
  useEffect(() => {
    if (venues && venues.length > 0 && !selectedVenueId) {
      setSelectedVenueId(venues[0].id);
    }
  }, [venues, selectedVenueId]);
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold font-header text-secondary mb-4">My Beer Passport</h2>
      
      {/* User Stats Card */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Welcome back,</p>
            <p className="text-lg font-semibold">{user?.name}</p>
            <p className="text-sm text-gray-600">{user?.city}</p>
          </div>
          
          {/* Progress Circle */}
          <div className="relative w-20 h-20">
            <svg className="w-full h-full progress-circle">
              <circle cx="40" cy="40" r="36" fill="none" stroke="#E5E7EB" strokeWidth="8" />
              <circle 
                cx="40" cy="40" r="36" fill="none" 
                stroke="#D4A017" strokeWidth="8" 
                strokeDasharray="226" 
                strokeDashoffset={226 - (226 * (user?.total_checkins || 0) / 100)}
              />
            </svg>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-xl font-bold text-primary">{user?.total_checkins || 0}</p>
                <p className="text-xs">check-ins</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Next Badge Progress */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm font-semibold mb-2">
            Next Badge: <span className="text-primary">Beer Explorer</span>
          </p>
          <Progress value={progressPercentage} className="h-2.5" />
          <p className="text-xs text-gray-600 mt-1">
            {currentProgress} of {nextBadgeThreshold} check-ins
          </p>
        </div>
      </div>
      
      {/* Check-In Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold font-header text-secondary mb-3">Ready to check in?</h3>
        
        {/* Check-In Button */}
        <CheckInButton 
          venueId={selectedVenueId} 
          onCheckInSuccess={handleCheckInSuccess} 
        />
        
        {/* Nearby Venues */}
        <h3 className="text-lg font-bold font-header text-secondary mb-3">Nearby Venues</h3>
        
        {venuesLoading ? (
          // Loading skeleton
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
                <Skeleton className="w-full h-36" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {venues?.slice(0, 3).map(venue => (
              <VenueCard 
                key={venue.id} 
                venue={venue} 
                onCheckInSuccess={handleCheckInSuccess}
              />
            ))}
          </div>
        )}
        
        <Button 
          variant="ghost" 
          className="w-full text-primary font-semibold py-2 mt-3 flex items-center justify-center"
        >
          <span>View all nearby venues</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </Button>
      </div>
      
      {/* Recent Check-ins */}
      <div>
        <h3 className="text-lg font-bold font-header text-secondary mb-3">Your Recent Check-ins</h3>
        
        {checkinsLoading ? (
          // Loading skeleton
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 border-b border-gray-100">
                <div className="flex items-center">
                  <Skeleton className="w-14 h-14 rounded-md mr-3" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recentCheckins && recentCheckins.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {recentCheckins.map(checkin => (
              <div key={checkin.id} className="p-4 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-md bg-primary/20 flex items-center justify-center mr-3">
                    <span className="text-primary text-xl font-bold">
                      {checkin.venue?.name?.charAt(0) || 'V'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{checkin.venue?.name || 'Unknown Venue'}</h4>
                    <p className="text-xs text-gray-600">
                      Checked in {new Date(checkin.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  {/* Show badge if one was earned with this check-in */}
                  {checkin.badge && (
                    <div className="bg-success/10 text-success px-2 py-1 rounded-full text-xs">
                      +1 Badge
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500">No check-ins yet. Start visiting venues!</p>
          </div>
        )}
        
        {recentCheckins && recentCheckins.length > 0 && (
          <Button 
            variant="ghost" 
            className="w-full text-primary font-semibold py-2 mt-3 flex items-center justify-center"
          >
            <span>View your check-in history</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
}
