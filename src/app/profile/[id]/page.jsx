"use client";

import { useState, useEffect } from "react";
import {
  Star,
  MapPin,
  Link as LinkIcon,
  Shield,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";

export default function PublicProfilePage({ params }) {
  const [profile, setProfile] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, [params.id]);

  async function fetchProfileData() {
    try {
      // Fetch profile
      const profileRes = await fetch(`/api/profiles/${params.id}`);
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData.profile);
      }

      // Fetch gigs
      const gigsRes = await fetch(`/api/gigs?freelancer_id=${params.id}`);
      if (gigsRes.ok) {
        const gigsData = await gigsRes.json();
        setGigs(gigsData.gigs || []);
      }

      // Fetch reviews
      const reviewsRes = await fetch(`/api/reviews?reviewee_id=${params.id}`);
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#1DA1F2] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#667085] dark:text-white/60">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
            Profile not found
          </h2>
          <a href="/marketplace" className="text-[#1DA1F2] hover:underline">
            Back to marketplace
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <a
          href="/marketplace"
          className="inline-flex items-center text-[#667085] dark:text-white/60 hover:text-[#1DA1F2] mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to marketplace
        </a>

        {/* Profile Header */}
        <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1DA1F2] to-[#0A66C2] flex items-center justify-center text-white font-bold text-4xl mb-4 md:mb-0">
              {profile.name?.charAt(0) || "U"}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-[#111418] dark:text-white mb-2">
                    {profile.name}
                  </h1>
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-[#667085] dark:text-white/60">
                      @{profile.x_username}
                    </span>
                    {profile.x_blue_verified && (
                      <div className="inline-flex items-center px-3 py-1 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-full text-sm font-semibold">
                        <Shield size={14} className="mr-1" />X Blue Verified
                      </div>
                    )}
                    {profile.x_verified && (
                      <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-semibold">
                        <Shield size={14} className="mr-1" />
                        Verified
                      </div>
                    )}
                  </div>

                  {profile.rating > 0 && (
                    <div className="flex items-center mb-4">
                      <Star
                        size={20}
                        className="text-[#FFD400] fill-[#FFD400] mr-1"
                      />
                      <span className="font-bold text-[#111418] dark:text-white text-lg">
                        {parseFloat(profile.rating).toFixed(1)}
                      </span>
                      <span className="text-[#667085] dark:text-white/60 ml-2">
                        ({profile.total_reviews} reviews)
                      </span>
                    </div>
                  )}

                  {profile.bio && (
                    <p className="text-[#667085] dark:text-white/60 mb-4 max-w-2xl">
                      {profile.bio}
                    </p>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-[#667085] dark:text-white/60">
                    {profile.hourly_rate && (
                      <div>
                        <span className="font-semibold text-[#1DA1F2]">
                          ${parseFloat(profile.hourly_rate).toFixed(0)}/hr
                        </span>
                      </div>
                    )}
                    {profile.fixed_pricing && (
                      <div>
                        <span className="font-semibold text-[#1DA1F2]">
                          ${parseFloat(profile.fixed_pricing).toFixed(0)}
                        </span>{" "}
                        fixed
                      </div>
                    )}
                    {profile.follower_count > 0 && (
                      <div>
                        {profile.follower_count.toLocaleString()} followers
                      </div>
                    )}
                  </div>
                </div>

                <a
                  href={`/messages?userId=${profile.id}`}
                  className="flex items-center px-6 py-3 border-2 border-[#1DA1F2] text-[#1DA1F2] hover:bg-[#1DA1F2]/10 font-semibold rounded-full transition-colors"
                >
                  <MessageCircle size={18} className="mr-2" />
                  Contact
                </a>
              </div>

              {/* Skills */}
              {profile.skills && profile.skills.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-[#111418] dark:text-white mb-2">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, i) => (
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

              {/* Portfolio Links */}
              {profile.portfolio_links &&
                profile.portfolio_links.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#111418] dark:text-white mb-2">
                      Portfolio
                    </h3>
                    <div className="space-y-2">
                      {profile.portfolio_links.map((link, i) => (
                        <a
                          key={i}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-[#1DA1F2] hover:underline"
                        >
                          <LinkIcon size={14} className="mr-2" />
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Gigs */}
        {gigs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-6">
              Active Gigs
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gigs.map((gig) => (
                <a
                  key={gig.id}
                  href={`/gigs/${gig.id}`}
                  className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6 hover:border-[#1DA1F2] transition-colors"
                >
                  <h3 className="font-bold text-lg text-[#111418] dark:text-white mb-2 line-clamp-2">
                    {gig.title}
                  </h3>
                  <p className="text-sm text-[#667085] dark:text-white/60 mb-4 line-clamp-2">
                    {gig.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#667085] dark:text-white/60 text-sm">
                      {gig.delivery_days} day
                      {gig.delivery_days !== 1 ? "s" : ""}
                    </span>
                    <span className="text-2xl font-bold text-[#1DA1F2]">
                      ${parseFloat(gig.price).toFixed(0)}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-6">
              Reviews
            </h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1DA1F2] to-[#0A66C2] flex items-center justify-center text-white font-bold">
                        {review.reviewer_name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="font-semibold text-[#111418] dark:text-white">
                          {review.reviewer_name}
                        </div>
                        <div className="text-sm text-[#667085] dark:text-white/60">
                          @{review.reviewer_username}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star
                        size={16}
                        className="text-[#FFD400] fill-[#FFD400] mr-1"
                      />
                      <span className="font-bold text-[#111418] dark:text-white">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-[#667085] dark:text-white/60">
                      {review.comment}
                    </p>
                  )}
                  <div className="text-xs text-[#667085] dark:text-white/60 mt-3">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
