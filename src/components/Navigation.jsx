"use client";

import {
  Film,
  Sparkles,
  User,
  LogOut,
  Menu,
  X,
  Users,
  Briefcase,
  TrendingUp,
  Zap,
  Target,
  Bell,
  Play,
  LayoutDashboard,
  Settings,
  Video,
  ChevronDown,
  FolderOpen,
} from "lucide-react";
import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import { useNotifications } from "@/hooks/useNotifications";

export default function Navigation() {
  const { data: user, loading } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isHomepage, setIsHomepage] = useState(false);

  useEffect(() => {
    setIsHomepage(window.location.pathname === "/");
  }, []);

  const { unreadCount } = useNotifications();

  // Homepage provides its own standalone nav
  if (isHomepage) return null;

  return (
    <nav className="bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href={user ? "/dashboard" : "/"}
            className="flex items-center gap-2.5 flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Play className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-lg font-bold text-[#111418] dark:text-white">
              One Reel
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center px-4">
            {user ? (
              <>
                <a
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#667085] dark:text-white/60 hover:text-[#111418] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </a>
                <a
                  href="/opportunity-hub"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all shadow-sm"
                >
                  <Target size={16} />
                  Opportunities
                </a>
                <a
                  href="/active-projects"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#667085] dark:text-white/60 hover:text-[#111418] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all"
                >
                  <Briefcase size={16} />
                  Projects
                </a>
                <a
                  href="/collaborations"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#667085] dark:text-white/60 hover:text-[#111418] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all"
                >
                  <Users size={16} />
                  Collabs
                </a>
                <a
                  href="/ai-studio"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#667085] dark:text-white/60 hover:text-[#111418] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all"
                >
                  <Sparkles size={16} />
                  AI Studio
                </a>
              </>
            ) : (
              <>
                <a
                  href="/showcase"
                  className="px-3 py-2 text-sm font-medium text-[#667085] dark:text-white/60 hover:text-[#111418] dark:hover:text-white transition-colors"
                >
                  Showcase
                </a>
                <a
                  href="/pricing"
                  className="px-3 py-2 text-sm font-medium text-[#667085] dark:text-white/60 hover:text-[#111418] dark:hover:text-white transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="/ai-studio"
                  className="px-3 py-2 text-sm font-medium text-[#667085] dark:text-white/60 hover:text-[#111418] dark:hover:text-white transition-colors"
                >
                  AI Studio
                </a>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse" />
            ) : user ? (
              <>
                {/* Notification Bell */}
                <a
                  href="/notifications"
                  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <Bell
                    size={20}
                    className="text-[#667085] dark:text-white/60"
                  />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </a>

                {/* Create Button */}
                <a
                  href="/create-reel"
                  className="flex items-center gap-1.5 px-3 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold text-sm rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-all"
                >
                  <Film className="w-4 h-4" />
                  Create
                </a>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      {(user.name || user.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-[#111418] dark:text-white max-w-[100px] truncate">
                      {user.name || user.email || "Account"}
                    </span>
                    <ChevronDown
                      size={14}
                      className="text-[#667085] dark:text-white/40"
                    />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10">
                          <p className="text-xs text-[#667085] dark:text-white/40">
                            Signed in as
                          </p>
                          <p className="text-sm font-semibold text-[#111418] dark:text-white truncate">
                            {user.email}
                          </p>
                        </div>
                        <a
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#111418] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <LayoutDashboard
                            size={15}
                            className="text-[#667085] dark:text-white/40"
                          />
                          Dashboard
                        </a>
                        <a
                          href="/my-reels"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#111418] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <Video
                            size={15}
                            className="text-[#667085] dark:text-white/40"
                          />
                          My Reels
                        </a>
                        <a
                          href="/active-projects"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#111418] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <FolderOpen
                            size={15}
                            className="text-[#667085] dark:text-white/40"
                          />
                          Workspaces
                        </a>
                        <a
                          href="/ai-studio"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#111418] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <Sparkles
                            size={15}
                            className="text-[#667085] dark:text-white/40"
                          />
                          AI Studio
                        </a>
                        <a
                          href="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#111418] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <User
                            size={15}
                            className="text-[#667085] dark:text-white/40"
                          />
                          Profile
                        </a>
                        <a
                          href="/profile/setup"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#111418] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <Settings
                            size={15}
                            className="text-[#667085] dark:text-white/40"
                          />
                          Settings
                        </a>
                        <div className="border-t border-gray-100 dark:border-white/10 mt-1" />
                        <a
                          href="/account/logout"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <a
                  href="/account/signin"
                  className="px-4 py-2 text-sm font-medium text-[#667085] dark:text-white/60 hover:text-[#111418] dark:hover:text-white transition-colors"
                >
                  Sign In
                </a>
                <a
                  href="/account/signup"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-sm rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  Get Started Free
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#667085] dark:text-white/60"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-white/10">
            <div className="flex flex-col gap-1">
              {user ? (
                <>
                  <a
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-[#111418] dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <LayoutDashboard size={18} className="text-purple-600" />{" "}
                    Dashboard
                  </a>
                  <a
                    href="/opportunity-hub"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-purple-600 dark:text-purple-400 font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                  >
                    <Target size={18} /> Opportunities
                  </a>
                  <a
                    href="/active-projects"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-[#111418] dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Briefcase
                      size={18}
                      className="text-[#667085] dark:text-white/40"
                    />{" "}
                    Active Projects
                  </a>
                  <a
                    href="/collaborations"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-[#111418] dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Users
                      size={18}
                      className="text-[#667085] dark:text-white/40"
                    />{" "}
                    Collaborations
                  </a>
                  <a
                    href="/ai-studio"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-[#111418] dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Sparkles
                      size={18}
                      className="text-[#667085] dark:text-white/40"
                    />{" "}
                    AI Studio
                  </a>
                  <a
                    href="/my-reels"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-[#111418] dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Video
                      size={18}
                      className="text-[#667085] dark:text-white/40"
                    />{" "}
                    My Reels
                  </a>
                  <a
                    href="/active-projects"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-[#111418] dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <FolderOpen
                      size={18}
                      className="text-[#667085] dark:text-white/40"
                    />{" "}
                    Workspaces
                  </a>
                  <a
                    href="/notifications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-[#111418] dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Bell
                      size={18}
                      className="text-[#667085] dark:text-white/40"
                    />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                        {unreadCount}
                      </span>
                    )}
                  </a>
                  <a
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-[#111418] dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <User
                      size={18}
                      className="text-[#667085] dark:text-white/40"
                    />{" "}
                    Profile
                  </a>
                  <a
                    href="/profile/setup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-[#111418] dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Settings
                      size={18}
                      className="text-[#667085] dark:text-white/40"
                    />{" "}
                    Settings
                  </a>
                  <div className="border-t border-gray-200 dark:border-white/10 my-2" />
                  <a
                    href="/create-reel"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-bold rounded-xl transition-all"
                  >
                    <Film className="w-5 h-5" /> Create Reel
                  </a>
                  <a
                    href="/account/logout"
                    className="flex items-center gap-3 px-3 py-2.5 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                  >
                    <LogOut size={18} /> Sign Out
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/showcase"
                    className="px-3 py-2.5 text-[#111418] dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg"
                  >
                    Showcase
                  </a>
                  <a
                    href="/pricing"
                    className="px-3 py-2.5 text-[#111418] dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg"
                  >
                    Pricing
                  </a>
                  <a
                    href="/ai-studio"
                    className="px-3 py-2.5 text-[#111418] dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg"
                  >
                    AI Studio
                  </a>
                  <div className="border-t border-gray-200 dark:border-white/10 my-2" />
                  <a
                    href="/account/signin"
                    className="px-3 py-2.5 text-[#667085] dark:text-white/60 font-medium"
                  >
                    Sign In
                  </a>
                  <a
                    href="/account/signup"
                    className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl text-center"
                  >
                    Get Started Free
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </nav>
  );
}
