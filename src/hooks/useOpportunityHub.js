import { useState, useEffect, useRef } from "react";

export function useOpportunityHub(user) {
  const [collaborations, setCollaborations] = useState([]);
  const [recommendations, setRecommendations] = useState({
    opportunities: [],
    collaborators: [],
  });
  const [activeMatches, setActiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGuidedFlow, setShowGuidedFlow] = useState(false);
  const [checkingFirstTime, setCheckingFirstTime] = useState(true);
  const [perfectMatches, setPerfectMatches] = useState([]);
  const [showInactivityPrompt, setShowInactivityPrompt] = useState(false);
  const [quickApplying, setQuickApplying] = useState(null);
  const inactivityTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  const [filters, setFilters] = useState({
    search: "",
    industry: "",
    niche: "",
    type: "",
    style: "",
    skills: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showSkillSelector, setShowSkillSelector] = useState(false);

  const checkFirstTimeUser = async () => {
    try {
      const response = await fetch("/api/collaborations/check-first-time");
      const data = await response.json();

      if (data.success && data.isFirstTime) {
        setTimeout(() => {
          setShowGuidedFlow(true);
        }, 500);
      }
    } catch (error) {
      console.error("Error checking first-time user:", error);
    } finally {
      setCheckingFirstTime(false);
    }
  };

  const seedMarketplace = async () => {
    try {
      await fetch("/api/collaborations/seed");
    } catch (error) {
      console.error("Error seeding marketplace:", error);
    }
  };

  const fetchCollaborations = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (filters.industry) params.append("industry", filters.industry);
      if (filters.niche) params.append("niche", filters.niche);
      if (filters.type) params.append("type", filters.type);
      if (filters.style) params.append("style", filters.style);
      if (filters.skills) params.append("skills", filters.skills);

      const response = await fetch(`/api/collaborations?${params}`);
      const data = await response.json();

      if (data.success) {
        setCollaborations(data.collaborations);
      }
    } catch (error) {
      console.error("Error fetching collaborations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await fetch("/api/collaborations/recommendations");
      const data = await response.json();

      if (data.success) {
        setRecommendations(data);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const fetchActiveMatches = async () => {
    try {
      const response = await fetch("/api/collaborations/active");
      const data = await response.json();

      if (data.success) {
        setActiveMatches(data.matches);
      }
    } catch (error) {
      console.error("Error fetching active matches:", error);
    }
  };

  const fetchPerfectMatches = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/collaborations/perfect-matches");
      const data = await response.json();

      if (data.success) {
        setPerfectMatches(data.matches || []);
      }
    } catch (error) {
      console.error("Error fetching perfect matches:", error);
    }
  };

  const handleSave = async (collabId) => {
    if (!user) {
      window.location.href = "/account/signin";
      return;
    }

    try {
      const response = await fetch(`/api/collaborations/${collabId}/save`, {
        method: "POST",
      });

      if (response.ok) {
        fetchCollaborations();
      }
    } catch (error) {
      console.error("Error saving collaboration:", error);
    }
  };

  const handleQuickApply = async (collabId, title) => {
    if (!user) {
      window.location.href = "/account/signin";
      return;
    }

    // Check if user has profile before applying
    try {
      const profileCheck = await fetch("/api/profiles/check");
      const profileData = await profileCheck.json();

      if (!profileData.exists || profileData.needsSetup) {
        // Redirect to profile setup with return URL
        window.location.href = `/profile/setup?returnTo=${encodeURIComponent(`/collaborations/${collabId}`)}&action=${encodeURIComponent("apply to this collaboration")}`;
        return;
      }
    } catch (error) {
      console.error("Error checking profile:", error);
      // Continue anyway if check fails
    }

    setQuickApplying(collabId);

    try {
      const response = await fetch(`/api/collaborations/${collabId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `I'm interested in collaborating on "${title}". Let's discuss how I can contribute!`,
        }),
      });

      if (response.ok) {
        fetchCollaborations();
        fetchPerfectMatches();
      }
    } catch (error) {
      console.error("Error applying to collaboration:", error);
    } finally {
      setQuickApplying(null);
    }
  };

  const handleGuidedFlowComplete = (collaborationId) => {
    setShowGuidedFlow(false);
    window.location.href = `/collaborations/${collaborationId}`;
  };

  const handleExploreProjects = () => {
    setShowGuidedFlow(false);
  };

  const handleSkillsNeeded = () => {
    setShowSkillSelector(true);
  };

  const handleSkillsSaved = (skills) => {
    console.log("Skills saved:", skills);
    fetchRecommendations();
  };

  return {
    collaborations,
    recommendations,
    activeMatches,
    loading,
    showGuidedFlow,
    checkingFirstTime,
    perfectMatches,
    showInactivityPrompt,
    setShowInactivityPrompt,
    quickApplying,
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    showSkillSelector,
    setShowSkillSelector,
    inactivityTimerRef,
    lastActivityRef,
    checkFirstTimeUser,
    seedMarketplace,
    fetchCollaborations,
    fetchRecommendations,
    fetchActiveMatches,
    fetchPerfectMatches,
    handleSave,
    handleQuickApply,
    handleGuidedFlowComplete,
    handleExploreProjects,
    handleSkillsNeeded,
    handleSkillsSaved,
  };
}
