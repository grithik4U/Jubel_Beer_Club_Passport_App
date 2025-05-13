import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell } from "lucide-react";
import PassportTab from "@/components/tabs/passport-tab";
import BadgesTab from "@/components/tabs/badges-tab";
import LeaderboardTab from "@/components/tabs/leaderboard-tab";
import RewardsTab from "@/components/tabs/rewards-tab";
import BadgeUnlockModal from "@/components/badge-unlock-modal";
import { useLocation } from "wouter";

type TabValues = "passport" | "badges" | "leaderboard" | "rewards";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabValues>("passport");
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<any>(null);
  
  const handleLogout = () => {
    logoutMutation.mutate();
    setLocation("/auth");
  };

  const closeBadgeModal = () => {
    setShowBadgeModal(false);
  };
  
  // This function would be called when a new badge is unlocked
  const showBadgeUnlockModal = (badge: any) => {
    setUnlockedBadge(badge);
    setShowBadgeModal(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-light">
      {/* App Header */}
      <header className="bg-secondary text-white px-4 py-3 shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h1 className="text-lg font-bold font-header">Jubel Beer Club</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="text-white">
              <Bell className="h-5 w-5" />
            </button>
            <button onClick={handleLogout}>
              <div className="h-8 w-8 rounded-full border-2 border-primary bg-secondary flex items-center justify-center text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-16">
        {/* Tab Content */}
        <div className="h-full">
          <div className="hidden">
            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as TabValues)}>
              <TabsContent value="passport">
                <PassportTab onBadgeUnlock={showBadgeUnlockModal} />
              </TabsContent>
              <TabsContent value="badges">
                <BadgesTab />
              </TabsContent>
              <TabsContent value="leaderboard">
                <LeaderboardTab />
              </TabsContent>
              <TabsContent value="rewards">
                <RewardsTab />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Only render the active tab */}
          {activeTab === "passport" && <PassportTab onBadgeUnlock={showBadgeUnlockModal} />}
          {activeTab === "badges" && <BadgesTab />}
          {activeTab === "leaderboard" && <LeaderboardTab />}
          {activeTab === "rewards" && <RewardsTab />}
        </div>
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-10">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("passport")}
            className={`flex flex-col items-center rounded-none ${activeTab === "passport" ? "text-primary" : "text-gray-500"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M7 8h10" />
              <path d="M7 12h10" />
              <path d="M7 16h6" />
            </svg>
            <span className="text-xs mt-1">Passport</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => setActiveTab("badges")}
            className={`flex flex-col items-center rounded-none ${activeTab === "badges" ? "text-primary" : "text-gray-500"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="6" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12" y2="17.01" />
              <path d="M8.5 18h7l2.5 3H6l2.5-3Z" />
            </svg>
            <span className="text-xs mt-1">Badges</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => setActiveTab("leaderboard")}
            className={`flex flex-col items-center rounded-none ${activeTab === "leaderboard" ? "text-primary" : "text-gray-500"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 5h-9l-4 4H1v6h6l4 4h9V5Z" />
              <path d="M7 15 3 8l4-3" />
            </svg>
            <span className="text-xs mt-1">Leaderboard</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => setActiveTab("rewards")}
            className={`flex flex-col items-center rounded-none ${activeTab === "rewards" ? "text-primary" : "text-gray-500"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
              <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
              <path d="M18 12c-1.1 0-2 .9-2 2s.9 2 2 2h4v-4h-4Z" />
            </svg>
            <span className="text-xs mt-1">Rewards</span>
          </Button>
        </div>
      </nav>
      
      {/* Badge unlock modal */}
      {showBadgeModal && unlockedBadge && (
        <BadgeUnlockModal 
          badge={unlockedBadge} 
          isOpen={showBadgeModal} 
          onClose={closeBadgeModal} 
        />
      )}
    </div>
  );
}
