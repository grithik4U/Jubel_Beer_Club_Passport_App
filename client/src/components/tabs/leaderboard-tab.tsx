import { useState } from "react";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { useAuth } from "@/hooks/use-auth";
import LeaderboardItem from "@/components/leaderboard-item";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

type LeaderboardLocation = "local" | "national";

export default function LeaderboardTab() {
  const { user } = useAuth();
  const [location, setLocation] = useState<LeaderboardLocation>("local");
  const { leaderboard, isLoading } = useLeaderboard({ city: location === "local" ? user?.city : undefined });
  
  // Find the current user in the leaderboard
  const currentUserRanking = leaderboard?.find(u => u.id === user?.id);
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold font-header text-secondary mb-4">Leaderboard</h2>
      
      {/* Leaderboard Tabs */}
      <div className="flex space-x-1 bg-white rounded-lg shadow-md p-1 mb-6">
        <Button
          onClick={() => setLocation("local")}
          className={`flex-1 py-2 rounded-md font-medium ${
            location === "local" 
              ? "bg-primary text-white" 
              : "bg-white text-neutral-dark"
          }`}
          variant="ghost"
        >
          Local
        </Button>
        <Button
          onClick={() => setLocation("national")}
          className={`flex-1 py-2 rounded-md font-medium ${
            location === "national" 
              ? "bg-primary text-white" 
              : "bg-white text-neutral-dark"
          }`}
          variant="ghost"
        >
          National
        </Button>
      </div>
      
      {/* Your Ranking */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <Skeleton className="h-4 w-24 mb-2" />
          <div className="flex items-center">
            <Skeleton className="w-10 h-10 rounded-full mr-3" />
            <div className="flex-1">
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="text-right">
              <Skeleton className="h-6 w-10 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ) : currentUserRanking ? (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Your Ranking</p>
          <div className="flex items-center">
            <span className="bg-primary/10 text-primary text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center mr-3">
              #{currentUserRanking.rank}
            </span>
            <div className="flex-1">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-gray-600">{user?.city}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">{user?.total_checkins || 0}</p>
              <p className="text-xs text-gray-600">check-ins</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center mb-6">
          <p className="text-gray-500">
            You're not on the leaderboard yet. Start checking in to venues!
          </p>
        </div>
      )}
      
      {/* Top Rankings */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-3 bg-secondary text-white font-semibold">
          Top Beer Enthusiasts {location === "local" ? `in ${user?.city || "Your City"}` : "Nationwide"}
        </div>
        
        {isLoading ? (
          // Loading skeleton
          <>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center p-4 border-b border-gray-100">
                <Skeleton className="w-8 h-6 mr-2" />
                <Skeleton className="w-10 h-10 rounded-full mr-3" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-6 w-10 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </>
        ) : leaderboard && leaderboard.length > 0 ? (
          // Actual leaderboard data
          <>
            {leaderboard.map(user => (
              <LeaderboardItem 
                key={user.id} 
                user={user} 
                isCurrentUser={user.id === currentUserRanking?.id}
              />
            ))}
          </>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">No leaderboard data available yet.</p>
          </div>
        )}
        
        <div className="p-3 text-center">
          <Button variant="link" className="text-primary font-semibold">
            View full leaderboard
          </Button>
        </div>
      </div>
      
      {/* Monthly Challenge */}
      <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-3 bg-accent text-white font-semibold">
          {new Date().toLocaleString('default', { month: 'long' })} Challenge
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2">Brewery Hopper</h3>
          <p className="text-sm text-gray-600 mb-3">
            Visit 5 new breweries this month and earn a special badge!
          </p>
          
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Challenge Progress</p>
            <p className="text-sm font-medium">2/5</p>
          </div>
          <Progress value={40} className="h-2.5" />
          
          <div className="mt-4 text-center">
            <Button className="bg-accent text-white px-4 py-2 rounded-lg font-medium">
              Join Challenge
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
