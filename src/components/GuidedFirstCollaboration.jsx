"use client";

import { useState } from "react";
import { Sparkles, Rocket, ArrowRight, Zap, Users, Film } from "lucide-react";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * GUIDED FIRST COLLABORATION
 * Activation-optimized onboarding that gets creators collaborating in 60s
 * ═══════════════════════════════════════════════════════════════════════
 */

const PROJECT_TYPES = [
  { value: "youtube_video", label: "YouTube Video", icon: "🎥" },
  { value: "short_film", label: "Short Film", icon: "🎬" },
  { value: "podcast", label: "Podcast", icon: "🎙️" },
  { value: "brand_content", label: "Brand Content", icon: "✨" },
  { value: "social_series", label: "Social Media Series", icon: "📱" },
  { value: "documentary", label: "Documentary", icon: "📽️" },
  { value: "music_video", label: "Music Video", icon: "🎵" },
  { value: "animation", label: "Animation", icon: "🎨" },
  { value: "other", label: "Something Else", icon: "💡" },
];

const COMMON_ROLES = [
  { value: "Video Editor", icon: "✂️" },
  { value: "Creator", icon: "🎭" },
  { value: "Cinematographer", icon: "📹" },
  { value: "Animator", icon: "🎨" },
  { value: "Designer", icon: "🖌️" },
  { value: "Brand Partner", icon: "🤝" },
  { value: "Writer", icon: "✍️" },
  { value: "Photographer", icon: "📸" },
  { value: "Sound Designer", icon: "🎵" },
  { value: "Producer", icon: "🎬" },
];

const COLLAB_TYPES = [
  { value: "paid", label: "Paid Project", emoji: "💰" },
  { value: "partnership", label: "Partnership", emoji: "🤝" },
  { value: "passion", label: "Passion Project", emoji: "❤️" },
];

const TIMELINES = [
  { value: "immediately", label: "Immediately", emoji: "⚡" },
  { value: "this_week", label: "This Week", emoji: "📅" },
  { value: "this_month", label: "This Month", emoji: "🗓️" },
  { value: "flexible", label: "Flexible", emoji: "🌊" },
];

export default function GuidedFirstCollaboration({ onComplete, onExplore }) {
  const [step, setStep] = useState("welcome"); // welcome, create, success
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    projectType: "",
    roles: [],
    collabType: "",
    timeline: "",
  });

  const generateCollaboration = () => {
    const projectTypeObj = PROJECT_TYPES.find(
      (p) => p.value === formData.projectType,
    );
    const projectTypeName = projectTypeObj?.label || "Creative Project";

    // Auto-generate title
    const titles = {
      youtube_video: [
        `${formData.roles[0] || "Team"} Needed for YouTube Series`,
        `Seeking ${formData.roles[0] || "Collaborators"} for YouTube Channel`,
        `YouTube Creator Looking for ${formData.roles[0] || "Partners"}`,
      ],
      short_film: [
        `Short Film ${formData.roles[0] || "Crew"} Needed`,
        `Indie Film Seeking ${formData.roles[0] || "Team"}`,
        `${formData.roles[0] || "Collaborators"} Wanted for Short Film`,
      ],
      podcast: [
        `Podcast Launch Team Needed`,
        `Seeking ${formData.roles[0] || "Co-Host"} for New Podcast`,
        `${formData.roles[0] || "Producer"} Needed for Podcast Series`,
      ],
      brand_content: [
        `Brand Content ${formData.roles[0] || "Creator"} Needed`,
        `Seeking ${formData.roles[0] || "Team"} for Brand Partnership`,
        `${formData.roles[0] || "Collaborators"} for Brand Campaign`,
      ],
      social_series: [
        `Social Media Series Needs ${formData.roles[0] || "Team"}`,
        `TikTok/Instagram ${formData.roles[0] || "Creator"} Wanted`,
        `${formData.roles[0] || "Collaborators"} for Viral Series`,
      ],
      documentary: [
        `Documentary ${formData.roles[0] || "Team"} Needed`,
        `Seeking ${formData.roles[0] || "Cinematographer"} for Doc Film`,
        `${formData.roles[0] || "Crew"} for Documentary Project`,
      ],
      music_video: [
        `Music Video ${formData.roles[0] || "Director"} Needed`,
        `Seeking ${formData.roles[0] || "Team"} for Music Visual`,
        `${formData.roles[0] || "Collaborators"} for Artist Project`,
      ],
      animation: [
        `Animation ${formData.roles[0] || "Artist"} Needed`,
        `Seeking ${formData.roles[0] || "Animator"} for Creative Project`,
        `${formData.roles[0] || "Team"} for Animated Series`,
      ],
      other: [
        `Creative ${formData.roles[0] || "Collaborators"} Needed`,
        `Seeking ${formData.roles[0] || "Team"} for New Project`,
        `${formData.roles[0] || "Partners"} Wanted for Collaboration`,
      ],
    };

    const titleOptions = titles[formData.projectType] || titles.other;
    const title = titleOptions[Math.floor(Math.random() * titleOptions.length)];

    // Auto-generate vision/description
    const visions = {
      youtube_video: `Looking to create engaging YouTube content that stands out. I need talented ${formData.roles.slice(0, 2).join(" and ")} to help bring this vision to life. Let's build something amazing together!`,
      short_film: `Working on an exciting short film project that needs the right creative minds. Seeking ${formData.roles.slice(0, 2).join(" and ")} who are passionate about storytelling and visual excellence.`,
      podcast: `Launching a new podcast and building the perfect team. Looking for ${formData.roles.slice(0, 2).join(" and ")} to create something listeners will love. Great opportunity to grow together!`,
      brand_content: `Creating premium brand content that connects with audiences. Need ${formData.roles.slice(0, 2).join(" and ")} who understand both creativity and brand messaging.`,
      social_series: `Building a viral-worthy social media series. Seeking ${formData.roles.slice(0, 2).join(" and ")} who know how to create thumb-stopping content that performs.`,
      documentary: `Documenting an important story that needs to be told. Looking for ${formData.roles.slice(0, 2).join(" and ")} passionate about meaningful storytelling.`,
      music_video: `Creating a music video that captures the essence of the track. Need ${formData.roles.slice(0, 2).join(" and ")} with a strong visual sense and creative energy.`,
      animation: `Working on an animation project that needs talented artists. Seeking ${formData.roles.slice(0, 2).join(" and ")} who can bring characters and stories to life.`,
      other: `Excited to collaborate on a creative project. Looking for ${formData.roles.slice(0, 2).join(" and ")} who are ready to create something special together.`,
    };

    const vision = visions[formData.projectType] || visions.other;

    return { title, vision };
  };

  const handleCreateCollaboration = async () => {
    setCreating(true);

    try {
      const { title, vision } = generateCollaboration();

      const timelineMap = {
        immediately: "ASAP - Ready to start now",
        this_week: "Within 1 week",
        this_month: "Within 1 month",
        flexible: "Flexible timeline",
      };

      const payload = {
        title,
        vision,
        rolesNeeded: formData.roles,
        requiredSkills: formData.roles.map((role) => role.toLowerCase()),
        collabType: formData.collabType,
        estimatedTimeline: timelineMap[formData.timeline],
        collabStyle: "remote",
        urgencyLevel: formData.timeline === "immediately" ? "urgent" : "normal",
      };

      const response = await fetch("/api/collaborations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setStep("success");
        setTimeout(() => {
          onComplete(data.collaboration.id);
        }, 3000);
      } else {
        throw new Error(data.error || "Failed to create collaboration");
      }
    } catch (error) {
      console.error("Error creating collaboration:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const canProceed = () => {
    return (
      formData.projectType &&
      formData.roles.length > 0 &&
      formData.collabType &&
      formData.timeline
    );
  };

  if (step === "welcome") {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-600 flex items-center justify-center z-50 p-4">
        <div className="max-w-2xl w-full text-center">
          {/* Animated Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl"></div>
              <div className="relative bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-full p-8">
                <Sparkles size={64} className="text-white" />
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            Your next creative partner is closer than you think
          </h1>

          {/* Subtext */}
          <p className="text-2xl text-white/90 mb-12 font-medium">
            Let's launch your first collaboration in under a minute.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setStep("create")}
              className="bg-white text-purple-600 px-8 py-5 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl flex items-center justify-center gap-3 group"
            >
              <Rocket
                size={28}
                className="group-hover:rotate-12 transition-transform"
              />
              Start My First Collaboration
            </button>

            <button
              onClick={onExplore}
              className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white px-8 py-5 rounded-2xl font-bold text-xl hover:bg-white/20 transition-all flex items-center justify-center gap-3"
            >
              <Users size={28} />
              Explore Active Projects
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex items-center justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <Zap size={20} />
              <span>Takes 20 seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={20} />
              <span>Free forever</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "create") {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-3xl w-full my-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-t-3xl">
            <div className="flex items-center gap-3 mb-3">
              <Rocket size={32} />
              <h2 className="text-3xl font-extrabold">Quick Launch</h2>
            </div>
            <p className="text-white/90 text-lg">
              Answer 4 quick questions to start collaborating
            </p>

            {/* Progress Bar */}
            <div className="mt-6 bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{
                  width: `${
                    (Object.values(formData).filter((v) =>
                      Array.isArray(v) ? v.length > 0 : v,
                    ).length /
                      4) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Step 1: Project Type */}
            <div>
              <label className="block text-xl font-bold text-[#111418] mb-4">
                1. What are you creating?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PROJECT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() =>
                      setFormData({ ...formData, projectType: type.value })
                    }
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.projectType === type.value
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <div className="font-semibold text-[#111418] text-sm">
                      {type.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Roles Needed */}
            <div>
              <label className="block text-xl font-bold text-[#111418] mb-4">
                2. Who do you need? (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_ROLES.map((role) => {
                  const isSelected = formData.roles.includes(role.value);
                  return (
                    <button
                      key={role.value}
                      onClick={() => {
                        if (isSelected) {
                          setFormData({
                            ...formData,
                            roles: formData.roles.filter(
                              (r) => r !== role.value,
                            ),
                          });
                        } else {
                          setFormData({
                            ...formData,
                            roles: [...formData.roles, role.value],
                          });
                        }
                      }}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                        isSelected
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-purple-100"
                      }`}
                    >
                      <span>{role.icon}</span>
                      {role.value}
                    </button>
                  );
                })}
              </div>
              {formData.roles.length > 0 && (
                <p className="text-sm text-purple-600 mt-2">
                  ✓ {formData.roles.length} role
                  {formData.roles.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            {/* Step 3: Compensation Type */}
            <div>
              <label className="block text-xl font-bold text-[#111418] mb-4">
                3. Is this paid?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {COLLAB_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() =>
                      setFormData({ ...formData, collabType: type.value })
                    }
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.collabType === type.value
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.emoji}</div>
                    <div className="font-semibold text-[#111418] text-sm">
                      {type.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Timeline */}
            <div>
              <label className="block text-xl font-bold text-[#111418] mb-4">
                4. When do you want to start?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TIMELINES.map((timeline) => (
                  <button
                    key={timeline.value}
                    onClick={() =>
                      setFormData({ ...formData, timeline: timeline.value })
                    }
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.timeline === timeline.value
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">{timeline.emoji}</div>
                    <div className="font-semibold text-[#111418] text-xs">
                      {timeline.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleCreateCollaboration}
              disabled={!canProceed() || creating}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-5 rounded-2xl font-bold text-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              {creating ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"></div>
                  Launching...
                </>
              ) : (
                <>
                  <Rocket size={24} />
                  Launch Collaboration 🚀
                </>
              )}
            </button>

            {!canProceed() && (
              <p className="text-center text-sm text-[#667085]">
                Please answer all questions to continue
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center z-50 p-4">
        <div className="max-w-2xl w-full text-center">
          {/* Success Animation */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl"></div>
              <div className="relative bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-full p-8">
                <Film size={64} className="text-white" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            Your collaboration is live! 🎉
          </h1>

          <p className="text-2xl text-white/90 mb-8 font-medium">
            Creators can now discover and apply to your project
          </p>

          {/* Redirecting Message */}
          <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-6 inline-block">
            <div className="flex items-center gap-3 text-white">
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"></div>
              <span className="text-lg font-semibold">
                Taking you to your collaboration...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
