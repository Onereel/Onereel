import { useState, useEffect } from "react";

export function useDashboard(user) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [myGigs, setMyGigs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [myTransactions, setMyTransactions] = useState([]);
  const [myReels, setMyReels] = useState([]);
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  async function fetchDashboardData() {
    try {
      setLoading(true);

      // Fetch profile
      const profileRes = await fetch("/api/profiles");
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        const myProfile = profileData.profiles?.find(
          (p) => p.user_id === user.id,
        );
        setProfile(myProfile);

        if (myProfile) {
          // Fetch my gigs
          const gigsRes = await fetch(
            `/api/gigs?freelancer_id=${myProfile.id}`,
          );
          if (gigsRes.ok) {
            const gigsData = await gigsRes.json();
            setMyGigs(gigsData.gigs || []);
          }

          // Fetch my jobs
          const jobsRes = await fetch(`/api/jobs?creator_id=${myProfile.id}`);
          if (jobsRes.ok) {
            const jobsData = await jobsRes.json();
            setMyJobs(jobsData.jobs || []);
          }

          // Fetch my applications
          const appsRes = await fetch(
            `/api/applications?applicant_id=${myProfile.id}`,
          );
          if (appsRes.ok) {
            const appsData = await appsRes.json();
            setMyApplications(appsData.applications || []);
          }

          // Fetch my transactions
          const txRes = await fetch(
            `/api/transactions?profile_id=${myProfile.id}`,
          );
          if (txRes.ok) {
            const txData = await txRes.json();
            setMyTransactions(txData.transactions || []);
          }

          // Fetch my reels
          const reelsRes = await fetch(`/api/reels?profileId=${myProfile.id}`);
          if (reelsRes.ok) {
            const reelsData = await reelsRes.json();
            setMyReels(reelsData.reels || []);
          }

          // Fetch usage
          const usageRes = await fetch("/api/subscription/usage");
          if (usageRes.ok) {
            const usageData = await usageRes.json();
            setUsage(usageData);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    profile,
    myGigs,
    myJobs,
    myApplications,
    myTransactions,
    myReels,
    usage,
  };
}
