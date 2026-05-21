"use client";

import { useState, useEffect } from "react";
import { Star, Clock, Shield, ArrowLeft, MessageCircle } from "lucide-react";
import { useUser } from "@/utils/useUser";
import VerificationGate from "../../../components/VerificationGate";

export default function GigDetailPage({ params }) {
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hiring, setHiring] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    fetchGig();
  }, [params.id]);

  async function fetchGig() {
    try {
      const response = await fetch(`/api/gigs/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch gig");
      }
      const data = await response.json();
      setGig(data.gig);
    } catch (error) {
      console.error("Error fetching gig:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleHire() {
    if (!user) {
      alert("Please sign in to hire this creator");
      window.location.href = "/account/signin";
      return;
    }

    try {
      setHiring(true);

      // Create Stripe checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(gig.price),
          gigId: gig.id,
          freelancerId: gig.freelancer_id,
          type: "gig",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert(`Failed to start payment process: ${error.message}`);
      setHiring(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#1DA1F2] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#667085] dark:text-white/60">
            Loading gig...
          </p>
        </div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
            Gig not found
          </h2>
          <a href="/marketplace" className="text-[#1DA1F2] hover:underline">
            Back to marketplace
          </a>
        </div>
      </div>
    );
  }

  return (
    <VerificationGate>
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Back Button */}
          <a
            href="/marketplace"
            className="inline-flex items-center text-[#667085] dark:text-white/60 hover:text-[#1DA1F2] mb-8"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to marketplace
          </a>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-8">
                {gig.is_boosted && (
                  <div className="inline-block bg-gradient-to-r from-[#FFD400] to-[#FFA000] px-4 py-2 rounded-full mb-4">
                    <span className="text-[#111418] font-bold text-sm">
                      ⭐ Boosted Gig
                    </span>
                  </div>
                )}

                <h1 className="text-3xl font-extrabold text-[#111418] dark:text-white mb-4">
                  {gig.title}
                </h1>

                <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200 dark:border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1DA1F2] to-[#0A66C2] flex items-center justify-center text-white font-bold text-lg">
                      {gig.freelancer_name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <a
                        href={`/profile/${gig.freelancer_id}`}
                        className="font-semibold text-[#111418] dark:text-white hover:text-[#1DA1F2]"
                      >
                        {gig.freelancer_name}
                      </a>
                      <div className="text-sm text-[#667085] dark:text-white/60">
                        @{gig.freelancer_username}
                      </div>
                    </div>
                  </div>

                  {gig.freelancer_rating > 0 && (
                    <div className="flex items-center">
                      <Star
                        size={20}
                        className="text-[#FFD400] fill-[#FFD400] mr-1"
                      />
                      <span className="font-bold text-[#111418] dark:text-white">
                        {parseFloat(gig.freelancer_rating).toFixed(1)}
                      </span>
                      <span className="text-[#667085] dark:text-white/60 ml-1">
                        ({gig.freelancer_reviews} reviews)
                      </span>
                    </div>
                  )}
                </div>

                <div className="prose dark:prose-invert max-w-none mb-6">
                  <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-3">
                    About This Gig
                  </h2>
                  <p className="text-[#667085] dark:text-white/60 whitespace-pre-wrap">
                    {gig.description}
                  </p>
                </div>

                {gig.freelancer_skills && gig.freelancer_skills.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-3">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {gig.freelancer_skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {gig.freelancer_bio && (
                  <div>
                    <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-3">
                      About the Creator
                    </h3>
                    <p className="text-[#667085] dark:text-white/60">
                      {gig.freelancer_bio}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6 sticky top-6">
                <div className="text-4xl font-extrabold text-[#1DA1F2] mb-6">
                  ${parseFloat(gig.price).toFixed(0)}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[#667085] dark:text-white/60">
                      <Clock size={18} className="mr-2" />
                      Delivery Time
                    </div>
                    <span className="font-semibold text-[#111418] dark:text-white">
                      {gig.delivery_days} day
                      {gig.delivery_days !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[#667085] dark:text-white/60">
                      <Shield size={18} className="mr-2" />
                      Platform Fee
                    </div>
                    <span className="font-semibold text-[#111418] dark:text-white">
                      12%
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-white/10 pt-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#667085] dark:text-white/60">
                      Subtotal
                    </span>
                    <span className="text-[#111418] dark:text-white">
                      ${parseFloat(gig.price).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#667085] dark:text-white/60">
                      Service Fee (12%)
                    </span>
                    <span className="text-[#111418] dark:text-white">
                      ${(parseFloat(gig.price) * 0.12).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-lg border-t border-gray-200 dark:border-white/10 pt-2 mt-2">
                    <span className="text-[#111418] dark:text-white">
                      Total
                    </span>
                    <span className="text-[#1DA1F2]">
                      ${(parseFloat(gig.price) * 1.12).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleHire}
                  disabled={hiring}
                  className="w-full bg-[#1DA1F2] hover:bg-[#1a8cd8] disabled:bg-gray-400 text-white font-bold py-4 rounded-full transition-colors mb-3"
                >
                  {hiring ? "Processing..." : "Hire Now"}
                </button>

                <a
                  href={`/messages?userId=${gig.freelancer_id}`}
                  className="w-full flex items-center justify-center border-2 border-[#1DA1F2] text-[#1DA1F2] hover:bg-[#1DA1F2]/10 font-semibold py-3 rounded-full transition-colors"
                >
                  <MessageCircle size={20} className="mr-2" />
                  Message Creator
                </a>

                <p className="text-xs text-center text-[#667085] dark:text-white/60 mt-4">
                  Payment is held in escrow and released upon completion
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VerificationGate>
  );
}
