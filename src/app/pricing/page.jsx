"use client";

import { Check, Sparkles, Zap, Star, Users, Crown } from "lucide-react";
import { useState } from "react";
import useUser from "@/utils/useUser";

export default function PricingPage() {
  const { data: user } = useUser();
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);

  // ✅ EARLY ACCESS MODE — NO PAYMENT FUNCTIONALITY
  function handleEarlyAccess() {
    setShowEarlyAccessModal(true);
  }

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out One Reel",
      features: [
        "Unlimited collaborations",
        "AI-powered generation",
        "Clean, professional outputs",
        "Download-ready files",
        "Basic styles & moods",
        "Community support",
        "Access to talent marketplace",
      ],
      cta: "Free During Early Access",
      tier: "free",
      popular: false,
    },
    {
      name: "Pro",
      price: billingPeriod === "monthly" ? "$19" : "$190",
      period: billingPeriod === "monthly" ? "/month" : "/year",
      description: "For professional creators",
      features: [
        "Everything in Free",
        "Unlimited creations",
        "Advanced AI models",
        "Priority generation speed",
        "All premium styles & moods",
        "4K export quality",
        "Early access to features",
        "Priority support",
        "Commercial license",
      ],
      cta: "Free During Early Access",
      tier: "pro",
      popular: true,
      savings: billingPeriod === "yearly" ? "Save $38/year" : null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A]">
      {/* 🔥 EARLY ACCESS HERO BANNER */}
      <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Crown size={28} className="text-yellow-300" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              One Reel is FREE while we build the future of collaboration
            </h2>
            <Crown size={28} className="text-yellow-300" />
          </div>
          <p className="text-xl text-white/90 font-medium mb-3">
            Early users receive Pro-level access at no cost.
          </p>
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-5 py-2 rounded-full font-bold text-sm">
            <Star size={18} fill="currentColor" />
            FOUNDING USER STATUS
            <Star size={18} fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            See what's coming. Everything unlocked during Early Access.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full p-1">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                billingPeriod === "monthly"
                  ? "bg-white text-purple-600"
                  : "text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                billingPeriod === "yearly"
                  ? "bg-white text-purple-600"
                  : "text-white"
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                Save 16%
              </span>
            </button>
          </div>

          {/* Early Access Notice */}
          <div className="mt-6 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl px-6 py-4 inline-block">
            <p className="text-white font-semibold text-lg">
              ⚡ All features unlocked — No payment required during Early Access
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white dark:bg-[#121212] rounded-2xl p-8 border-2 transition-all hover:shadow-2xl ${
                plan.popular
                  ? "border-purple-600 shadow-xl scale-105"
                  : "border-gray-200 dark:border-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                  MOST POPULAR
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-extrabold text-purple-600 line-through opacity-50">
                    {plan.price}
                  </span>
                  <span className="text-5xl font-extrabold text-green-600 ml-2">
                    $0
                  </span>
                </div>
                <div className="text-lg text-green-600 font-bold mb-2">
                  ✨ FREE DURING EARLY ACCESS
                </div>
                {plan.savings && (
                  <div className="text-sm text-[#667085] line-through">
                    {plan.savings}
                  </div>
                )}
                <p className="text-[#667085] dark:text-white/60">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-purple-600/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={14} className="text-purple-600" />
                    </div>
                    <span className="text-[#111418] dark:text-white">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* ✅ UNIVERSAL EARLY ACCESS BUTTON */}
              <button
                onClick={handleEarlyAccess}
                className="w-full py-4 rounded-xl font-bold text-lg transition-all bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Star size={20} fill="currentColor" />
                Free During Early Access
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-24">
          <h2 className="text-4xl font-extrabold text-[#111418] dark:text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                q: "Why is everything free?",
                a: "We're building a talent marketplace. We only monetize after creators are getting work and collaborations are flowing. Liquidity first, revenue second.",
              },
              {
                q: "How long is Early Access?",
                a: "As long as it takes to build a thriving marketplace. You'll be grandfathered in with special benefits when we launch paid plans.",
              },
              {
                q: "What's a Founding User?",
                a: "Early users who help us build One Reel. You get Pro features free, priority support, and lifetime perks.",
              },
              {
                q: "Will I have to pay later?",
                a: "When we launch monetization, Founding Users will receive exclusive discounts and benefits. But only after the marketplace is thriving.",
              },
              {
                q: "Can I use content commercially?",
                a: "Yes! All users during Early Access have full commercial rights to their creations.",
              },
              {
                q: "What if I want to support you now?",
                a: "The best way to support us is to use One Reel, collaborate with others, and tell your creator friends. Your activity builds the marketplace.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#121212] rounded-xl p-6 border border-gray-200 dark:border-white/10"
              >
                <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-3">
                  {faq.q}
                </h3>
                <p className="text-[#667085] dark:text-white/60">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Join the Founding Users
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Start collaborating for free — Help us build the future
          </p>
          <a
            href={user ? "/opportunity-hub" : "/account/signup"}
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-purple-600 font-bold text-lg rounded-xl hover:bg-gray-50 transition-all shadow-xl"
          >
            <Users className="w-6 h-6" />
            {user ? "Explore Opportunities" : "Become a Founding User"}
          </a>
        </div>
      </div>

      {/* ✅ EARLY ACCESS MODAL */}
      {showEarlyAccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#121212] rounded-3xl max-w-2xl w-full p-8 relative">
            {/* Close button */}
            <button
              onClick={() => setShowEarlyAccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>

            {/* Modal content */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Crown size={40} className="text-yellow-300" />
                </div>
              </div>

              <h2 className="text-4xl font-extrabold text-[#111418] dark:text-white mb-4">
                You are an early user of One Reel
              </h2>

              <p className="text-xl text-[#667085] dark:text-white/60 mb-6 leading-relaxed">
                All premium features are currently{" "}
                <span className="text-green-600 font-bold">
                  unlocked at no cost
                </span>{" "}
                while we build the world's most powerful collaboration
                marketplace.
              </p>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-lg text-[#111418] dark:text-white mb-4">
                  🎉 What you get as a Founding User:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start gap-2">
                    <Check
                      size={20}
                      className="text-purple-600 flex-shrink-0 mt-0.5"
                    />
                    <span className="text-[#111418] dark:text-white font-medium">
                      Unlimited AI generations
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check
                      size={20}
                      className="text-purple-600 flex-shrink-0 mt-0.5"
                    />
                    <span className="text-[#111418] dark:text-white font-medium">
                      Priority support
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check
                      size={20}
                      className="text-purple-600 flex-shrink-0 mt-0.5"
                    />
                    <span className="text-[#111418] dark:text-white font-medium">
                      Access to talent marketplace
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check
                      size={20}
                      className="text-purple-600 flex-shrink-0 mt-0.5"
                    />
                    <span className="text-[#111418] dark:text-white font-medium">
                      Lifetime perks & discounts
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-600 rounded-xl p-4 mb-6">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold">
                  💡 Your mission: Help us build a thriving marketplace by
                  collaborating, creating, and inviting your network.
                </p>
              </div>

              <button
                onClick={() => setShowEarlyAccessModal(false)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
              >
                Let's Go! 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
