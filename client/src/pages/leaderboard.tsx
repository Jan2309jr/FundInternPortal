import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Crown, User, Trophy } from "lucide-react";
import Navigation from "@/components/navigation";

interface LeaderboardEntry {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  totalRaised: number;
  donationsCount: number;
  rank: number;
}

export default function LeaderboardPage() {
  const [, setLocation] = useLocation();
  const [currentUser, setCurrentUser] = useState<any>(null);

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

  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
    enabled: !!currentUser,
  });

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
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation currentUser={currentUser} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">No leaderboard data available</h2>
            <p className="text-gray-600 mt-2">Check back later for rankings</p>
          </div>
        </div>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const getProgressPercentage = (amount: number, maxAmount: number) => {
    return Math.min((amount / maxAmount) * 100, 100);
  };

  const maxAmount = leaderboard[0]?.totalRaised || 25000;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentUser={currentUser} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-gray-600">See how you rank against other interns in the fundraising challenge.</p>
        </div>

        {/* Top 3 Podium */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performers</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Second Place */}
              {topThree[1] && (
                <div className="text-center order-2 md:order-1">
                  <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="text-white text-2xl" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="text-2xl font-bold text-gray-600 mb-2">#2</div>
                    <h3 className="font-semibold text-gray-900">{topThree[1].name}</h3>
                    <p className="text-gray-600 font-medium">${topThree[1].totalRaised.toLocaleString()}</p>
                  </div>
                </div>
              )}

              {/* First Place */}
              {topThree[0] && (
                <div className="text-center order-1 md:order-2">
                  <div className="w-24 h-24 bg-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-yellow-300">
                    <Crown className="text-white text-3xl" />
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-6 border-2 border-yellow-200">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">#1</div>
                    <h3 className="font-semibold text-gray-900">{topThree[0].name}</h3>
                    <p className="text-gray-600 font-medium">${topThree[0].totalRaised.toLocaleString()}</p>
                  </div>
                </div>
              )}

              {/* Third Place */}
              {topThree[2] && (
                <div className="text-center order-3">
                  <div className="w-20 h-20 bg-amber-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="text-white text-2xl" />
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <div className="text-2xl font-bold text-amber-600 mb-2">#3</div>
                    <h3 className="font-semibold text-gray-900">{topThree[2].name}</h3>
                    <p className="text-gray-600 font-medium">${topThree[2].totalRaised.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Full Leaderboard Table */}
        <Card>
          <CardContent className="p-0">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Complete Rankings</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Intern
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Raised
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Donations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaderboard.map((entry) => {
                    const isCurrentUser = entry.email === currentUser?.email;
                    const progressPercentage = getProgressPercentage(entry.totalRaised, maxAmount);
                    
                    return (
                      <tr
                        key={entry.id}
                        className={`hover:bg-gray-50 transition-colors duration-150 ${
                          isCurrentUser ? "bg-blue-50" : ""
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">#{entry.rank}</span>
                            {entry.rank === 1 && <Crown className="text-yellow-500 ml-2 w-4 h-4" />}
                            {isCurrentUser && (
                              <Badge className="ml-2 bg-primary text-white">You</Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                              entry.rank === 1 ? "bg-yellow-500" :
                              entry.rank === 2 ? "bg-gray-400" :
                              entry.rank === 3 ? "bg-amber-600" :
                              "bg-primary"
                            }`}>
                              <User className="text-white text-sm" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{entry.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-green-600">
                            ${entry.totalRaised.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{entry.donationsCount}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                entry.rank === 1 ? "bg-green-500" :
                                entry.rank === 2 ? "bg-blue-500" :
                                entry.rank === 3 ? "bg-orange-500" :
                                "bg-purple-500"
                              }`}
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">{Math.round(progressPercentage)}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
