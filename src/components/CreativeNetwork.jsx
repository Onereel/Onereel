"use client";

import { useState, useEffect } from "react";
import { Users, Zap, TrendingUp, Award, Clock } from "lucide-react";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * CREATIVE NETWORK
 * Displays a user's working relationships from the Creative Graph
 * Shows proof of real collaborations - not just connections
 * ═══════════════════════════════════════════════════════════════════════
 */

export default function CreativeNetwork({ userId, profileId }) {
  const [connections, setConnections] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchConnections();
    }
  }, [userId]);

  const fetchConnections = async () => {
    try {
      const response = await fetch(
        `/api/creative-graph/connections?user_id=${userId}`,
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      if (data.success) {
        setConnections(data.connections);
      }
    } catch (error) {
      console.error("Error fetching creative network:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <Users size={24} className="text-purple-600" />
          <h2 className="text-2xl font-extrabold text-[#111418]">
            🤝 Creative Network
          </h2>
        </div>
        <div className="text-center py-8 text-[#667085]">
          Loading network...
        </div>
      </div>
    );
  }

  if (!connections || connections.total === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <Users size={24} className="text-purple-600" />
          <h2 className="text-2xl font-extrabold text-[#111418]">
            🤝 Creative Network
          </h2>
        </div>
        <div className="text-center py-8">
          <Users size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-[#667085] mb-4">
            Your network starts with your first collaboration.
          </p>
          <a
            href="/collaborations"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Find Opportunities
          </a>
        </div>
      </div>
    );
  }

  const { frequent_collaborators, recent_work, trusted_partners } = connections;

  return (
    <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users size={24} className="text-purple-600" />
          <h2 className="text-2xl font-extrabold text-[#111418]">
            🤝 Creative Network
          </h2>
        </div>
        <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
          {connections.total}{" "}
          {connections.total === 1 ? "connection" : "connections"}
        </span>
      </div>

      {/* Frequent Collaborators */}
      {frequent_collaborators.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={18} className="text-orange-600" />
            <h3 className="text-lg font-bold text-[#111418]">
              Frequent Collaborators
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {frequent_collaborators.slice(0, 4).map((conn) => (
              <a
                key={conn.id}
                href={`/profile/${conn.connected_user_id}`}
                className="group"
              >
                <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-3 border border-orange-200 hover:shadow-md transition-all">
                  <img
                    src={conn.connected_image || "/placeholder-avatar.png"}
                    alt={conn.connected_name}
                    className="w-16 h-16 rounded-full mx-auto mb-2"
                  />
                  <div className="text-center">
                    <div className="font-bold text-sm text-[#111418] group-hover:text-purple-600 transition-colors line-clamp-1">
                      {conn.connected_name}
                    </div>
                    <div className="text-xs text-[#667085]">
                      {conn.project_count}{" "}
                      {conn.project_count === 1 ? "project" : "projects"}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Trusted Partners */}
      {trusted_partners.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Award size={18} className="text-green-600" />
            <h3 className="text-lg font-bold text-[#111418]">
              Trusted Partners
            </h3>
          </div>
          <div className="space-y-2">
            {trusted_partners.slice(0, 3).map((conn) => (
              <a
                key={conn.id}
                href={`/profile/${conn.connected_user_id}`}
                className="group block"
              >
                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-3 border border-green-200 hover:shadow-md transition-all flex items-center gap-3">
                  <img
                    src={conn.connected_image || "/placeholder-avatar.png"}
                    alt={conn.connected_name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-sm text-[#111418] group-hover:text-purple-600 transition-colors">
                      {conn.connected_name}
                    </div>
                    <div className="text-xs text-[#667085]">
                      {conn.project_count} completed projects together
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-lg">
                    <Award size={12} />
                    Partner
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Recent Work */}
      {recent_work.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-blue-600" />
            <h3 className="text-lg font-bold text-[#111418]">
              Recently Worked With
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {recent_work.slice(0, 8).map((conn) => (
              <a
                key={conn.id}
                href={`/profile/${conn.connected_user_id}`}
                className="group"
              >
                <div className="bg-blue-50 hover:bg-blue-100 rounded-xl px-3 py-2 border border-blue-200 hover:shadow-sm transition-all flex items-center gap-2">
                  <img
                    src={conn.connected_image || "/placeholder-avatar.png"}
                    alt={conn.connected_name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium text-[#111418] group-hover:text-purple-600 transition-colors">
                    {conn.connected_name.split(" ")[0]}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Social Proof Badges */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {connections.total >= 5 && (
            <div className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-purple-200 flex items-center gap-1">
              <Users size={14} />
              Strong Network
            </div>
          )}
          {frequent_collaborators.length >= 3 && (
            <div className="bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-orange-200 flex items-center gap-1">
              <Zap size={14} />
              Active Collaborator
            </div>
          )}
          {trusted_partners.length >= 2 && (
            <div className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-green-200 flex items-center gap-1">
              <Award size={14} />
              Trusted Professional
            </div>
          )}
          {recent_work.length >= 5 && (
            <div className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-200 flex items-center gap-1">
              <TrendingUp size={14} />
              High Activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
