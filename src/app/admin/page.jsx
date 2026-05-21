"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/utils/useUser";
import {
  Users,
  Briefcase,
  Package,
  DollarSign,
  Settings as SettingsIcon,
  Shield,
} from "lucide-react";

export default function AdminPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [platformSettings, setPlatformSettings] = useState({});
  const [newFeePercentage, setNewFeePercentage] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  async function checkAdminStatus() {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        setIsAdmin(true);
        fetchAdminData();
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAdminData() {
    try {
      // Fetch users
      const usersRes = await fetch("/api/admin/users");
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      // Fetch transactions
      const txRes = await fetch("/api/admin/transactions");
      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData.transactions || []);
      }

      // Fetch platform settings
      const settingsRes = await fetch("/api/admin/settings");
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        const settingsMap = {};
        settingsData.settings.forEach((s) => {
          settingsMap[s.setting_key] = s.setting_value;
        });
        setPlatformSettings(settingsMap);
        setNewFeePercentage(settingsMap.platform_fee_percentage || "12");
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  }

  async function updatePlatformFee(e) {
    e.preventDefault();

    const fee = parseFloat(newFeePercentage);
    if (isNaN(fee) || fee < 0 || fee > 100) {
      alert("Please enter a valid percentage between 0 and 100");
      return;
    }

    try {
      setSavingSettings(true);

      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          setting_key: "platform_fee_percentage",
          setting_value: fee.toString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update settings");
      }

      alert("Platform fee updated successfully!");
      fetchAdminData();
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings");
    } finally {
      setSavingSettings(false);
    }
  }

  async function updateTransactionStatus(transactionId, newStatus) {
    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }

      alert("Transaction status updated!");
      fetchAdminData();
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Failed to update transaction");
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">
            Please sign in
          </h2>
          <p className="text-[#667085] dark:text-white/60">
            You need to be signed in to access the admin panel
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#1DA1F2] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#667085] dark:text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <Shield size={64} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-[#667085] dark:text-white/60 mb-6">
            You do not have permission to access the admin panel
          </p>
          <a href="/" className="text-[#1DA1F2] hover:underline">
            Go to homepage
          </a>
        </div>
      </div>
    );
  }

  const totalRevenue = transactions
    .filter((t) => t.status === "completed" || t.status === "released")
    .reduce((sum, t) => sum + parseFloat(t.platform_fee || 0), 0);

  const pendingTransactions = transactions.filter(
    (t) => t.status === "pending" || t.status === "held",
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A]">
      {/* Header */}
      <div className="bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-[#111418] dark:text-white">
                Admin Panel
              </h1>
              <p className="text-[#667085] dark:text-white/60 mt-1">
                Platform management and oversight
              </p>
            </div>
            <a
              href="/dashboard"
              className="px-6 py-3 border-2 border-gray-300 dark:border-white/10 text-[#667085] dark:text-white/60 hover:border-[#1DA1F2] hover:text-[#1DA1F2] font-semibold rounded-full transition-colors"
            >
              Back to Dashboard
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#F8F9FB] dark:bg-[#1E1E1E] rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users size={20} className="text-[#1DA1F2]" />
                <span className="text-sm text-[#667085] dark:text-white/60">
                  Total Users
                </span>
              </div>
              <div className="text-2xl font-bold text-[#111418] dark:text-white">
                {users.length}
              </div>
            </div>

            <div className="bg-[#F8F9FB] dark:bg-[#1E1E1E] rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign size={20} className="text-green-600" />
                <span className="text-sm text-[#667085] dark:text-white/60">
                  Total Revenue
                </span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                ${totalRevenue.toFixed(2)}
              </div>
            </div>

            <div className="bg-[#F8F9FB] dark:bg-[#1E1E1E] rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Package size={20} className="text-yellow-600" />
                <span className="text-sm text-[#667085] dark:text-white/60">
                  Pending Txns
                </span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {pendingTransactions.length}
              </div>
            </div>

            <div className="bg-[#F8F9FB] dark:bg-[#1E1E1E] rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <SettingsIcon size={20} className="text-purple-600" />
                <span className="text-sm text-[#667085] dark:text-white/60">
                  Platform Fee
                </span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {platformSettings.platform_fee_percentage || "12"}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: Shield },
            { id: "users", label: "Users", icon: Users },
            { id: "transactions", label: "Transactions", icon: DollarSign },
            { id: "settings", label: "Settings", icon: SettingsIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-full font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#1DA1F2] text-white"
                  : "bg-white dark:bg-[#121212] text-[#667085] dark:text-white/60 hover:bg-gray-50 dark:hover:bg-[#1E1E1E]"
              }`}
            >
              <tab.icon size={18} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-8">
            <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-6">
              Platform Overview
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-3">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#F8F9FB] dark:bg-[#1E1E1E] rounded-lg">
                    <span className="text-[#667085] dark:text-white/60">
                      Total Transactions
                    </span>
                    <span className="font-bold text-[#111418] dark:text-white">
                      {transactions.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#F8F9FB] dark:bg-[#1E1E1E] rounded-lg">
                    <span className="text-[#667085] dark:text-white/60">
                      Verified Users
                    </span>
                    <span className="font-bold text-[#111418] dark:text-white">
                      {
                        users.filter((u) => u.x_verified || u.x_blue_verified)
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#F8F9FB] dark:bg-[#1E1E1E] rounded-lg">
                    <span className="text-[#667085] dark:text-white/60">
                      Active Freelancers
                    </span>
                    <span className="font-bold text-[#111418] dark:text-white">
                      {
                        users.filter(
                          (u) => u.role === "freelancer" || u.role === "both",
                        ).length
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#111418] dark:text-white mb-3">
                  Revenue Breakdown
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-green-700 dark:text-green-400">
                      Completed
                    </span>
                    <span className="font-bold text-green-700 dark:text-green-400">
                      $
                      {transactions
                        .filter(
                          (t) =>
                            t.status === "completed" || t.status === "released",
                        )
                        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <span className="text-yellow-700 dark:text-yellow-400">
                      In Progress
                    </span>
                    <span className="font-bold text-yellow-700 dark:text-yellow-400">
                      $
                      {transactions
                        .filter(
                          (t) =>
                            t.status === "in_progress" || t.status === "held",
                        )
                        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#1DA1F2]/10 rounded-lg">
                    <span className="text-[#1DA1F2]">
                      Platform Fees Collected
                    </span>
                    <span className="font-bold text-[#1DA1F2]">
                      ${totalRevenue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-white/10">
              <h2 className="text-2xl font-bold text-[#111418] dark:text-white">
                Users
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8F9FB] dark:bg-[#1E1E1E]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#667085] dark:text-white/60 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#667085] dark:text-white/60 uppercase">
                      Username
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#667085] dark:text-white/60 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#667085] dark:text-white/60 uppercase">
                      Verified
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#667085] dark:text-white/60 uppercase">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-[#1E1E1E]"
                    >
                      <td className="px-6 py-4">
                        <a
                          href={`/profile/${user.id}`}
                          className="font-semibold text-[#111418] dark:text-white hover:text-[#1DA1F2]"
                        >
                          {user.name}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#667085] dark:text-white/60">
                        @{user.x_username}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-full text-xs font-semibold">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.x_blue_verified ? (
                          <span className="px-3 py-1 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-full text-xs font-semibold">
                            X Blue
                          </span>
                        ) : user.x_verified ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-semibold">
                            Verified
                          </span>
                        ) : (
                          <span className="text-[#667085] dark:text-white/60 text-xs">
                            -
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {user.rating > 0 ? (
                          <span className="font-semibold text-[#111418] dark:text-white">
                            {parseFloat(user.rating).toFixed(1)} (
                            {user.total_reviews})
                          </span>
                        ) : (
                          <span className="text-[#667085] dark:text-white/60">
                            No reviews
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-white/10">
              <h2 className="text-2xl font-bold text-[#111418] dark:text-white">
                Transactions
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8F9FB] dark:bg-[#1E1E1E]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#667085] dark:text-white/60 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#667085] dark:text-white/60 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#667085] dark:text-white/60 uppercase">
                      Platform Fee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#667085] dark:text-white/60 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#667085] dark:text-white/60 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#667085] dark:text-white/60 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-gray-50 dark:hover:bg-[#1E1E1E]"
                    >
                      <td className="px-6 py-4 text-sm text-[#111418] dark:text-white">
                        #{tx.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#111418] dark:text-white">
                        ${parseFloat(tx.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        ${parseFloat(tx.platform_fee).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            tx.status === "completed" ||
                            tx.status === "released"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : tx.status === "held" ||
                                  tx.status === "in_progress"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#667085] dark:text-white/60">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          onChange={(e) =>
                            updateTransactionStatus(tx.id, e.target.value)
                          }
                          defaultValue=""
                          className="text-sm px-3 py-1 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                        >
                          <option value="" disabled>
                            Update Status
                          </option>
                          <option value="pending">Pending</option>
                          <option value="held">Held</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="released">Released</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-8">
            <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-6">
              Platform Settings
            </h2>

            <form onSubmit={updatePlatformFee} className="max-w-md">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                  Platform Fee Percentage
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={newFeePercentage}
                    onChange={(e) => setNewFeePercentage(e.target.value)}
                    placeholder="12"
                    step="0.1"
                    min="0"
                    max="100"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                  />
                  <span className="text-[#667085] dark:text-white/60 text-lg">
                    %
                  </span>
                </div>
                <p className="text-xs text-[#667085] dark:text-white/60 mt-2">
                  This fee is charged on all transactions and represents the
                  platform's revenue
                </p>
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] disabled:bg-gray-400 text-white font-bold rounded-full transition-colors"
              >
                {savingSettings ? "Saving..." : "Save Settings"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
