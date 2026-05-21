"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  Users,
  Send,
  Target,
  Sparkles,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * ADMIN MATCH ENGINE - MANUAL MATCHMAKING TOOL
 * ═══════════════════════════════════════════════════════════════════════
 *
 * This is the FOUNDER SECRET WEAPON.
 *
 * Early marketplaces win through manual matchmaking.
 * This tool lets admins:
 * ✔ See new users
 * ✔ View their skills
 * ✔ Suggest perfect matches
 * ✔ Send direct intros
 *
 * Automation comes later. Human touch wins first.
 * ═══════════════════════════════════════════════════════════════════════
 */

export default function MatchEnginePage() {
  const { data: user, loading: userLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newUsers, setNewUsers] = useState([]);
  const [activeCollaborations, setActiveCollaborations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [suggestedMatches, setSuggestedMatches] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!userLoading && user) {
      checkAdminAccess();
    }
  }, [user, userLoading]);

  const checkAdminAccess = async () => {
    try {
      const response = await fetch("/api/admin/check-access");
      const data = await response.json();

      if (data.isAdmin) {
        setIsAdmin(true);
        fetchNewUsers();
        fetchActiveCollaborations();
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error checking admin access:", error);
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  };

  const fetchNewUsers = async () => {
    try {
      const response = await fetch("/api/admin/users?sortBy=newest&limit=50");
      const data = await response.json();

      if (data.success) {
        setNewUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching new users:", error);
    }
  };

  const fetchActiveCollaborations = async () => {
    try {
      const response = await fetch(
        "/api/collaborations?status=active&limit=100",
      );
      const data = await response.json();

      if (data.success) {
        setActiveCollaborations(data.collaborations || []);
      }
    } catch (error) {
      console.error("Error fetching collaborations:", error);
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    findMatches(user);
  };

  const findMatches = (user) => {
    const userSkills = (user.skills || []).map((s) => s.toLowerCase());

    const matches = activeCollaborations
      .map((collab) => {
        let score = 0;
        const matchingSkills = [];

        // Skill overlap
        const requiredSkills = (collab.required_skills || []).map((s) =>
          s.toLowerCase(),
        );
        userSkills.forEach((userSkill) => {
          requiredSkills.forEach((reqSkill) => {
            if (reqSkill.includes(userSkill) || userSkill.includes(reqSkill)) {
              score += 20;
              if (!matchingSkills.includes(userSkill)) {
                matchingSkills.push(userSkill);
              }
            }
          });
        });

        // Urgency boost
        if (collab.urgency_level === "urgent") score += 15;

        return {
          ...collab,
          match_score: score,
          matching_skills: matchingSkills,
        };
      })
      .filter((match) => match.match_score > 0)
      .sort((a, b) => b.match_score - a.match_score);

    setSuggestedMatches(matches.slice(0, 10));
  };

  const sendIntroduction = async (userId, collabId) => {
    setSending(true);

    try {
      const response = await fetch("/api/admin/send-intro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          collaboration_id: collabId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Introduction sent successfully!");
      } else {
        throw new Error(data.error || "Failed to send introduction");
      }
    } catch (error) {
      console.error("Error sending introduction:", error);
      alert("❌ " + error.message);
    } finally {
      setSending(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#667085]">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <a
            href="/admin"
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft size={20} />
            Back to Admin
          </a>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <Target size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold">Manual Match Engine</h1>
              <p className="text-white/90 text-lg mt-1">
                Connect new users with perfect opportunities
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: New Users */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Users size={24} className="text-purple-600" />
              <h2 className="text-2xl font-bold text-[#111418]">
                New Users ({newUsers.length})
              </h2>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {newUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => selectUser(user)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedUser?.id === user.id
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={user.profile_image_url || "/placeholder-avatar.png"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-[#111418]">
                        {user.name}
                      </div>
                      <div className="text-xs text-[#667085]">
                        @{user.x_username}
                      </div>
                    </div>
                  </div>

                  {user.skills && user.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {user.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                      {user.skills.length > 3 && (
                        <span className="text-xs text-[#667085]">
                          +{user.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-[#667085] mt-2">
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Suggested Matches */}
          <div className="lg:col-span-2">
            {!selectedUser ? (
              <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
                <Target size={64} className="mx-auto text-purple-300 mb-4" />
                <h3 className="text-2xl font-bold text-[#111418] mb-2">
                  Select a user to find matches
                </h3>
                <p className="text-[#667085]">
                  Click on a user from the left to see their perfect
                  collaboration matches
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={
                        selectedUser.profile_image_url ||
                        "/placeholder-avatar.png"
                      }
                      alt={selectedUser.name}
                      className="w-16 h-16 rounded-full border-2 border-purple-600"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-[#111418]">
                        Matches for {selectedUser.name}
                      </h2>
                      <p className="text-[#667085]">
                        @{selectedUser.x_username}
                      </p>
                    </div>
                  </div>

                  {selectedUser.skills && selectedUser.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedUser.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-lg font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {suggestedMatches.length === 0 ? (
                    <div className="text-center py-12">
                      <Sparkles
                        size={48}
                        className="mx-auto text-gray-300 mb-4"
                      />
                      <p className="text-[#667085]">
                        No matches found. Try users with more skills set.
                      </p>
                    </div>
                  ) : (
                    suggestedMatches.map((match) => (
                      <div
                        key={match.id}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-bold">
                                {match.match_score}% MATCH
                              </span>
                              {match.urgency_level === "urgent" && (
                                <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-bold">
                                  🔥 URGENT
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-bold text-[#111418] mb-1">
                              {match.title}
                            </h3>
                            <p className="text-sm text-[#667085] line-clamp-2 mb-2">
                              {match.vision}
                            </p>

                            {match.matching_skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {match.matching_skills.map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold"
                                  >
                                    ✓ {skill}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="text-xs text-[#667085]">
                              Posted by @{match.creator_username} •{" "}
                              {match.application_count || 0} applications
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              sendIntroduction(selectedUser.id, match.id)
                            }
                            disabled={sending}
                            className="ml-4 bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 flex-shrink-0"
                          >
                            <Send size={16} />
                            Send Intro
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
