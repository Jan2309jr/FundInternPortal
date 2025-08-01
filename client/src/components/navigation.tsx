import { Link, useLocation } from "wouter";
import { TrendingUp, Trophy, User } from "lucide-react";

interface NavigationProps {
  currentUser?: {
    name: string;
    email: string;
  };
}

export default function Navigation({ currentUser }: NavigationProps) {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">FundRaise Pro</h1>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link href="/dashboard">
                  <a className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                    <TrendingUp className="w-4 h-4 mr-2 inline" />
                    Dashboard
                  </a>
                </Link>
                <Link href="/leaderboard">
                  <a className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}>
                    <Trophy className="w-4 h-4 mr-2 inline" />
                    Leaderboard
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser && (
              <div className="hidden md:flex items-center text-gray-700">
                <User className="w-5 h-5 mr-2" />
                <span>{currentUser.name}</span>
              </div>
            )}
            <button className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
