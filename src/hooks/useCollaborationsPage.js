import { useState, useEffect } from "react";

export function useCollaborationsPage() {
  const [collaborations, setCollaborations] = useState([]);
  const [recommendations, setRecommendations] = useState({
    opportunities: [],
    collaborators: [],
  });
  const [activeMatches, setActiveMatches] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGuidedFlow, setShowGuidedFlow] = useState(false);
  const [checkingFirstTime, setCheckingFirstTime] = useState(true);

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
        // Small delay to let user see the page before showing flow
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

  const fetchActiveProjects = async () => {
    try {
      const response = await fetch("/api/profiles/active-projects");
      const data = await response.json();

      if (data.success) {
        setActiveProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Error fetching active projects:", error);
    }
  };

  const handleSave = async (collabId, user) => {
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

  const handleGuidedFlowComplete = (collaborationId) => {
    setShowGuidedFlow(false);
    // Redirect to the created collaboration
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
    // Refresh recommendations after saving skills
    fetchRecommendations();
  };

  useEffect(() => {
    // Check if user is first-time and needs guided flow
    checkFirstTimeUser();

    // Seed marketplace if needed
    seedMarketplace();

    fetchCollaborations();
    fetchRecommendations();
    fetchActiveMatches();
    fetchActiveProjects();
  }, []);

  useEffect(() => {
    fetchCollaborations();
  }, [filters]);

  return {
    collaborations,
    recommendations,
    activeMatches,
    activeProjects,
    loading,
    showGuidedFlow,
    checkingFirstTime,
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    showSkillSelector,
    setShowSkillSelector,
    handleSave,
    handleGuidedFlowComplete,
    handleExploreProjects,
    handleSkillsNeeded,
    handleSkillsSaved,
  };
}
