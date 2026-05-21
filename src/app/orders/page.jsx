"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import VerificationGate from "../../components/VerificationGate";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
  DollarSign,
  Star,
} from "lucide-react";

export default function OrdersPage() {
  const { data: user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  async function fetchOrders() {
    try {
      setLoading(true);

      // Get profile
      const profileRes = await fetch("/api/profiles");
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        const myProfile = profileData.profiles?.find(
          (p) => p.user_id === user.id,
        );
        setProfile(myProfile);

        if (myProfile) {
          // Fetch transactions (orders)
          const txRes = await fetch(
            `/api/transactions?profile_id=${myProfile.id}`,
          );
          if (txRes.ok) {
            const txData = await txRes.json();
            setOrders(txData.transactions || []);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  async function markCompleted(orderId) {
    try {
      const response = await fetch(`/api/transactions/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Error marking order as completed:", error);
    }
  }

  async function releasePayment(orderId) {
    try {
      const response = await fetch("/api/release-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction_id: orderId }),
      });

      if (response.ok) {
        alert("Payment released successfully!");
        fetchOrders();
      } else {
        alert("Failed to release payment");
      }
    } catch (error) {
      console.error("Error releasing payment:", error);
    }
  }

  const filterOrders = (status) => {
    if (status === "active") {
      return orders.filter((o) =>
        ["pending", "held", "in_progress"].includes(o.status),
      );
    } else if (status === "completed") {
      return orders.filter((o) => ["completed", "released"].includes(o.status));
    }
    return orders;
  };

  const activeOrders = filterOrders("active");
  const completedOrders = filterOrders("completed");

  return (
    <VerificationGate>
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A]">
        {/* Header */}
        <div className="bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-[#111418] dark:text-white">
                  Orders
                </h1>
                <p className="text-[#667085] dark:text-white/60 mt-1">
                  Manage your active and completed orders
                </p>
              </div>
              <a
                href="/dashboard"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20 text-[#111418] dark:text-white font-semibold rounded-full transition-colors"
              >
                Dashboard
              </a>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 mt-6">
              <button
                onClick={() => setActiveTab("active")}
                className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                  activeTab === "active"
                    ? "bg-[#1DA1F2] text-white"
                    : "bg-white dark:bg-[#1E1E1E] text-[#667085] dark:text-white/60 hover:bg-gray-50 dark:hover:bg-[#1E1E1E]"
                }`}
              >
                Active ({activeOrders.length})
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                  activeTab === "completed"
                    ? "bg-[#1DA1F2] text-white"
                    : "bg-white dark:bg-[#1E1E1E] text-[#667085] dark:text-white/60 hover:bg-gray-50 dark:hover:bg-[#1E1E1E]"
                }`}
              >
                Completed ({completedOrders.length})
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-[#1DA1F2] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-[#667085] dark:text-white/60">
                Loading orders...
              </p>
            </div>
          ) : filterOrders(activeTab).length === 0 ? (
            <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-12 text-center">
              <Package
                size={48}
                className="mx-auto text-gray-300 dark:text-white/20 mb-4"
              />
              <h3 className="text-xl font-bold text-[#111418] dark:text-white mb-2">
                No {activeTab} orders
              </h3>
              <p className="text-[#667085] dark:text-white/60 mb-6">
                {activeTab === "active"
                  ? "You don't have any active orders at the moment"
                  : "You haven't completed any orders yet"}
              </p>
              <a
                href="/marketplace"
                className="inline-block bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold px-8 py-3 rounded-full transition-colors"
              >
                Browse Marketplace
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {filterOrders(activeTab).map((order) => {
                const isBuyer = order.payer_id === profile?.id;
                const isSeller = order.payee_id === profile?.id;

                return (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-[#111418] dark:text-white">
                            Order #{order.id}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === "completed" ||
                              order.status === "released"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : order.status === "held" ||
                                    order.status === "in_progress"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-[#667085] dark:text-white/60">
                          <span>
                            {isBuyer ? "Purchasing from" : "Selling to"}:{" "}
                            <span className="font-semibold text-[#111418] dark:text-white">
                              @
                              {isBuyer
                                ? order.payee_username
                                : order.payer_username}
                            </span>
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {order.gig_title && (
                          <p className="text-[#111418] dark:text-white mt-2">
                            {order.gig_title}
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#1DA1F2]">
                          ${parseFloat(order.amount).toFixed(2)}
                        </div>
                        <div className="text-xs text-[#667085] dark:text-white/60">
                          Fee: ${parseFloat(order.platform_fee).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                      <a
                        href={`/messages?order=${order.id}`}
                        className="flex items-center px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-gray-300 dark:border-white/10 hover:border-[#1DA1F2] text-[#667085] dark:text-white/60 hover:text-[#1DA1F2] font-semibold rounded-full transition-colors"
                      >
                        <MessageCircle size={16} className="mr-2" />
                        Message
                      </a>

                      {isSeller && order.status === "held" && (
                        <button
                          onClick={() => markCompleted(order.id)}
                          className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-colors"
                        >
                          <CheckCircle size={16} className="mr-2" />
                          Mark Completed
                        </button>
                      )}

                      {isBuyer && order.status === "completed" && (
                        <button
                          onClick={() => releasePayment(order.id)}
                          className="flex items-center px-4 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold rounded-full transition-colors"
                        >
                          <DollarSign size={16} className="mr-2" />
                          Release Payment
                        </button>
                      )}

                      {order.status === "released" && !order.review_id && (
                        <a
                          href={`/reviews/create?order=${order.id}`}
                          className="flex items-center px-4 py-2 bg-[#FFD400] hover:bg-[#FFA000] text-[#111418] font-semibold rounded-full transition-colors"
                        >
                          <Star size={16} className="mr-2" />
                          Leave Review
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </VerificationGate>
  );
}
