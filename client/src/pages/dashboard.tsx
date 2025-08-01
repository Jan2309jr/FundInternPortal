import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Link2, Heart, Trophy, Medal, Star, Crown, Copy, Share, TrendingUp } from "lucide-react";
import Navigation from "@/components/navigation";

interface DashboardData {
  intern: {
    id: string;
    name: string;
    email: string;
    referralCode: string;
    totalRaised: number;
    donationsCount: number;
  };
  recentDonations: Array<{
    id: string;
    amount: number;
    donorName: string | null;
    createdAt: string;
  }>;
  rewards: Array<{
    id: string;
    title: string;
    description: string;
    rewardType: string;
    threshold: number;
    unlocked: number;
  }>;
  rank: number;
}

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      setLocation("/login");
      return;
    }
    
    try {
      setCurrentUser(JSON.parse(user));
    } catch {
      setLocation("/login");
    }
  }, [setLocation]);

  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard", currentUser?.id],
    enabled: !!currentUser?.id,
  });

  const copyReferralLink = () => {
    if (!currentUser?.referralCode) return;
    
    const referralLink = `https://fundraisepro.com/donate?ref=${currentUser.referralCode}`;
    navigator.clipboard.writeText(referralLink).then(() => {
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
    });
  };

  if (!currentUser) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation currentUser={currentUser} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation currentUser={currentUser} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Error loading dashboard</h2>
            <p className="text-gray-600 mt-2">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  const { intern, recentDonations, rewards, rank } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentUser={currentUser} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {intern.name}!
          </h1>
          <p className="text-gray-600">Track your fundraising progress and see how you're making a difference.</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Raised</h3>
                  <p className="text-2xl font-bold text-gray-900">${intern.totalRaised.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Link2 className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Referral Code</h3>
                  <p className="text-2xl font-bold text-gray-900">{intern.referralCode}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Donations</h3>
                  <p className="text-2xl font-bold text-gray-900">{intern.donationsCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Current Rank</h3>
                  <p className="text-2xl font-bold text-gray-900">#{rank}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Share Your Referral Link</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  readOnly
                  value={`https://fundraisepro.com/donate?ref=${intern.referralCode}`}
                  className="bg-gray-50"
                />
              </div>
              <Button onClick={copyReferralLink} className="bg-primary hover:bg-blue-700">
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Rewards & Achievements</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className={`border rounded-lg p-4 ${
                    reward.unlocked 
                      ? "bg-gradient-to-r from-green-50 to-green-100 border-green-200" 
                      : "bg-gray-50 border-gray-300 opacity-75"
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      reward.unlocked ? "bg-green-500" : "bg-gray-400"
                    }`}>
                      {reward.rewardType === "milestone" && <Medal className="w-5 h-5 text-white" />}
                      {reward.rewardType === "performance" && <Star className="w-5 h-5 text-white" />}
                      {reward.rewardType === "achievement" && <Crown className="w-5 h-5 text-white" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{reward.title}</h3>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                    </div>
                  </div>
                  <Badge
                    variant={reward.unlocked ? "default" : "secondary"}
                    className={
                      reward.unlocked 
                        ? "bg-green-100 text-green-800 hover:bg-green-100" 
                        : "bg-gray-300 text-gray-600"
                    }
                  >
                    {reward.unlocked ? "✓ UNLOCKED" : "🔒 LOCKED"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
            
            <div className="space-y-4">
              {recentDonations.length > 0 ? (
                recentDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">New donation received</p>
                      <p className="text-sm text-gray-600">
                        ${donation.amount} from {donation.donorName || "Anonymous Donor"} • {new Date(donation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Share className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">Get started</p>
                    <p className="text-sm text-gray-600">Share your referral link to start receiving donations</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">Current ranking</p>
                  <p className="text-sm text-gray-600">You're currently ranked #{rank} in the leaderboard</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
