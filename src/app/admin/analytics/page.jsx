"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/utils/useUser";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  Users,
  Briefcase,
  Package,
  Activity,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState("30");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      checkAdminAndFetchAnalytics();
    }
  }, [user, period]);

  async function checkAdminAndFetchAnalytics() {
    try {
      setLoading(true);

      // Check admin status
      const adminRes = await fetch("/api/admin/users");
      if (adminRes.ok) {
        setIsAdmin(true);

        // Fetch analytics
        const analyticsRes = await fetch(
          `/api/admin/analytics?period=${period}`,
        );
        if (analyticsRes.ok) {
          const data = await analyticsRes.json();
          setAnalytics(data);
        }
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">
            Please sign in
          </h2>
          <a href="/account/signin" className="text-[#1DA1F2] hover:underline">
            Sign in to continue
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#1DA1F2] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#667085] dark:text-white/60">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">
            Access Denied
          </h2>
          <p className="text-[#667085] dark:text-white/60 mb-6">
            You need admin access to view analytics
          </p>
          <a href="/" className="text-[#1DA1F2] hover:underline">
            Return home
          </a>
        </div>
      </div>
    );
  }

  const COLORS = ["#1DA1F2", "#0A66C2", "#FFD400", "#FFA000", "#10B981"];

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A]">
      {/* Header */}
      <div className="bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-[#111418] dark:text-white">
                Platform Analytics
              </h1>
              <p className="text-[#667085] dark:text-white/60 mt-1">
                Revenue, growth, and performance metrics
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <a
                href="/admin"
                className="px-4 py-2 border-2 border-gray-300 dark:border-white/10 text-[#667085] dark:text-white/60 hover:border-[#1DA1F2] hover:text-[#1DA1F2] font-semibold rounded-full transition-colors"
              >
                Back to Admin
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign size={32} className="text-[#1DA1F2]" />
              <TrendingUp size={20} className="text-green-500" />
            </div>
            <div className="text-3xl font-bold text-[#111418] dark:text-white mb-1">
              $
              {parseFloat(
                analytics?.revenue?.total_revenue || 0,
              ).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="text-sm text-[#667085] dark:text-white/60">
              Total Platform Revenue
            </div>
          </div>

          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity size={32} className="text-[#0A66C2]" />
            </div>
            <div className="text-3xl font-bold text-[#111418] dark:text-white mb-1">
              $
              {parseFloat(analytics?.revenue?.total_volume || 0).toLocaleString(
                "en-US",
                { minimumFractionDigits: 2, maximumFractionDigits: 2 },
              )}
            </div>
            <div className="text-sm text-[#667085] dark:text-white/60">
              Total Transaction Volume
            </div>
          </div>

          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <Briefcase size={32} className="text-[#FFD400]" />
            </div>
            <div className="text-3xl font-bold text-[#111418] dark:text-white mb-1">
              {analytics?.revenue?.total_transactions || 0}
            </div>
            <div className="text-sm text-[#667085] dark:text-white/60">
              Total Transactions
            </div>
          </div>

          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <Users size={32} className="text-[#10B981]" />
            </div>
            <div className="text-3xl font-bold text-[#111418] dark:text-white mb-1">
              {analytics?.growth?.new_users || 0}
            </div>
            <div className="text-sm text-[#667085] dark:text-white/60">
              New Users
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Daily Revenue Chart */}
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6">
            <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-4">
              Daily Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.dailyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  stroke="#667085"
                  tick={{ fill: "#667085" }}
                />
                <YAxis stroke="#667085" tick={{ fill: "#667085" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1DA1F2"
                  strokeWidth={2}
                  name="Platform Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Transaction Volume"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Transaction Status Breakdown */}
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6">
            <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-4">
              Transaction Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics?.statusBreakdown || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                >
                  {(analytics?.statusBreakdown || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Gig vs Job Revenue */}
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6">
            <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-4">
              Gig vs Job Revenue
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.typeBreakdown || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="type"
                  stroke="#667085"
                  tick={{ fill: "#667085" }}
                />
                <YAxis stroke="#667085" tick={{ fill: "#667085" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="total_revenue"
                  fill="#1DA1F2"
                  name="Platform Revenue"
                />
                <Bar
                  dataKey="total_volume"
                  fill="#10B981"
                  name="Transaction Volume"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Growth Metrics */}
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6">
            <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-4">
              Platform Growth
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F8F9FB] dark:bg-[#1E1E1E] rounded-lg">
                <div className="flex items-center">
                  <Users size={24} className="text-[#1DA1F2] mr-3" />
                  <span className="font-semibold text-[#111418] dark:text-white">
                    New Users
                  </span>
                </div>
                <span className="text-2xl font-bold text-[#1DA1F2]">
                  {analytics?.growth?.new_users || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#F8F9FB] dark:bg-[#1E1E1E] rounded-lg">
                <div className="flex items-center">
                  <Package size={24} className="text-[#0A66C2] mr-3" />
                  <span className="font-semibold text-[#111418] dark:text-white">
                    New Gigs
                  </span>
                </div>
                <span className="text-2xl font-bold text-[#0A66C2]">
                  {analytics?.growth?.new_gigs || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#F8F9FB] dark:bg-[#1E1E1E] rounded-lg">
                <div className="flex items-center">
                  <Briefcase size={24} className="text-[#FFD400] mr-3" />
                  <span className="font-semibold text-[#111418] dark:text-white">
                    New Jobs
                  </span>
                </div>
                <span className="text-2xl font-bold text-[#FFD400]">
                  {analytics?.growth?.new_jobs || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#F8F9FB] dark:bg-[#1E1E1E] rounded-lg">
                <div className="flex items-center">
                  <Activity size={24} className="text-[#10B981] mr-3" />
                  <span className="font-semibold text-[#111418] dark:text-white">
                    New Applications
                  </span>
                </div>
                <span className="text-2xl font-bold text-[#10B981]">
                  {analytics?.growth?.new_applications || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6">
          <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-4">
            Top Earning Freelancers
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F9FB] dark:bg-[#1E1E1E]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#667085] dark:text-white/60 uppercase">
                    Freelancer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#667085] dark:text-white/60 uppercase">
                    Transactions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#667085] dark:text-white/60 uppercase">
                    Total Earned
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#667085] dark:text-white/60 uppercase">
                    Avg Transaction
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                {(analytics?.topFreelancers || []).map((freelancer, index) => (
                  <tr
                    key={freelancer.id}
                    className="hover:bg-gray-50 dark:hover:bg-[#1E1E1E]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1DA1F2] to-[#0A66C2] flex items-center justify-center text-white font-bold text-sm mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-[#111418] dark:text-white">
                            {freelancer.name}
                          </div>
                          <div className="text-sm text-[#667085] dark:text-white/60">
                            @{freelancer.x_username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#111418] dark:text-white">
                      {freelancer.transaction_count}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#10B981]">
                      $
                      {parseFloat(freelancer.total_earned).toLocaleString(
                        "en-US",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#667085] dark:text-white/60">
                      $
                      {parseFloat(freelancer.avg_transaction).toLocaleString(
                        "en-US",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
