"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";

export default function BetaAccessPage() {
  const { data: user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [whitelist, setWhitelist] = useState([]);
  const [betaModeEnabled, setBetaModeEnabled] = useState(false);
  const [stats, setStats] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [bulkEmails, setBulkEmails] = useState("");
  const [message, setMessage] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWhitelist();
    }
  }, [user]);

  const fetchWhitelist = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/beta/whitelist");
      const data = await response.json();

      if (data.success) {
        setWhitelist(data.whitelist);
        setBetaModeEnabled(data.betaModeEnabled);
        setStats(data.stats);
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const toggleBetaMode = async () => {
    try {
      setUpdating(true);
      const response = await fetch("/api/beta/whitelist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !betaModeEnabled }),
      });

      const data = await response.json();

      if (data.success) {
        setBetaModeEnabled(data.betaModeEnabled);
        setMessage({
          type: "success",
          text: `Beta mode ${data.betaModeEnabled ? "enabled" : "disabled"}`,
        });
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setUpdating(false);
    }
  };

  const addEmail = async (emails) => {
    try {
      setUpdating(true);
      const response = await fetch("/api/beta/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        setNewEmail("");
        setBulkEmails("");
        fetchWhitelist();
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setUpdating(false);
    }
  };

  const removeEmail = async (email) => {
    if (!confirm(`Remove ${email} from whitelist?`)) return;

    try {
      setUpdating(true);
      const response = await fetch(
        `/api/beta/whitelist?email=${encodeURIComponent(email)}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        fetchWhitelist();
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setUpdating(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/admin"
            className="text-gray-400 hover:text-white mb-4 inline-block"
          >
            ← Back to Admin
          </a>
          <h1 className="text-3xl font-bold">Beta Access Control</h1>
          <p className="text-gray-400 mt-2">Manage invite-only beta access</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Beta Mode Toggle */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Beta Mode</h2>
              <p className="text-gray-400 text-sm">
                {betaModeEnabled
                  ? "Only whitelisted emails can sign up"
                  : "Anyone can sign up (public access)"}
              </p>
            </div>
            <button
              onClick={toggleBetaMode}
              disabled={updating}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                betaModeEnabled
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-600 hover:bg-gray-700"
              } disabled:opacity-50`}
            >
              {betaModeEnabled ? "Enabled" : "Disabled"}
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-400">Total Invites</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-400">
                {stats.used}
              </div>
              <div className="text-sm text-gray-400">Used</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">
                {stats.pending}
              </div>
              <div className="text-sm text-gray-400">Pending</div>
            </div>
          </div>
        )}

        {/* Add Emails */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add to Whitelist</h2>

          {/* Single Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">
              Single Email
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="user@example.com"
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
                disabled={updating}
              />
              <button
                onClick={() => addEmail([newEmail])}
                disabled={!newEmail || updating}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>

          {/* Bulk Emails */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Bulk Add (one email per line)
            </label>
            <textarea
              value={bulkEmails}
              onChange={(e) => setBulkEmails(e.target.value)}
              placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
              rows={4}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg mb-2"
              disabled={updating}
            />
            <button
              onClick={() => {
                const emails = bulkEmails.split("\n").filter((e) => e.trim());
                addEmail(emails);
              }}
              disabled={!bulkEmails || updating}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50"
            >
              Add All
            </button>
          </div>
        </div>

        {/* Whitelist */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Whitelisted Emails</h2>

          {whitelist.length === 0 ? (
            <p className="text-gray-500 text-sm">No emails whitelisted yet</p>
          ) : (
            <div className="space-y-2">
              {whitelist.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white/5 p-4 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{entry.email}</div>
                    <div className="text-xs text-gray-400">
                      Invited by {entry.invitedBy} •{" "}
                      {new Date(entry.invitedAt).toLocaleDateString()}
                      {entry.used &&
                        ` • Used ${new Date(entry.usedAt).toLocaleDateString()}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {entry.used && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                        Used
                      </span>
                    )}
                    <button
                      onClick={() => removeEmail(entry.email)}
                      disabled={updating}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
