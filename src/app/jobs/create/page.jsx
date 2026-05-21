"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/utils/useUser";
import { Save, ArrowLeft, Plus, X } from "lucide-react";

export default function CreateJobPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    required_skills: [],
  });

  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  async function fetchProfile() {
    try {
      const response = await fetch("/api/profiles");
      if (response.ok) {
        const data = await response.json();
        const myProfile = data.profiles?.find((p) => p.user_id === user.id);
        setProfile(myProfile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user || !profile) {
      alert("Please create your profile first");
      window.location.href = "/profile/setup";
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Title and description are required");
      return;
    }

    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      alert("Please enter a valid budget");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        creator_id: profile.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        budget: parseFloat(formData.budget),
        deadline: formData.deadline || null,
        required_skills:
          formData.required_skills.length > 0 ? formData.required_skills : null,
      };

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create job");
      }

      const data = await response.json();
      alert("Job posted successfully!");
      window.location.href = `/jobs/${data.job.id}`;
    } catch (error) {
      console.error("Error creating job:", error);
      alert(error.message || "Failed to create job. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function addSkill() {
    if (
      skillInput.trim() &&
      !formData.required_skills.includes(skillInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        required_skills: [...prev.required_skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  }

  function removeSkill(skill) {
    setFormData((prev) => ({
      ...prev,
      required_skills: prev.required_skills.filter((s) => s !== skill),
    }));
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">
            Please sign in
          </h2>
          <p className="text-[#667085] dark:text-white/60">
            You need to be signed in to post a job
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">
            Create Your Profile First
          </h2>
          <p className="text-[#667085] dark:text-white/60 mb-6">
            You need to set up your profile before you can post jobs
          </p>
          <a
            href="/profile/setup"
            className="inline-block bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-bold px-8 py-3 rounded-full transition-colors"
          >
            Create Profile
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <a
          href="/dashboard"
          className="inline-flex items-center text-[#667085] dark:text-white/60 hover:text-[#1DA1F2] mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to dashboard
        </a>

        <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-8">
          <h1 className="text-3xl font-extrabold text-[#111418] dark:text-white mb-2">
            Post a Job
          </h1>
          <p className="text-[#667085] dark:text-white/60 mb-8">
            Find the perfect freelancer for your project
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Need a video editor for weekly YouTube content"
                className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe the project, requirements, deliverables, timeline..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                required
              />
            </div>

            {/* Budget & Deadline */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                  Budget ($) *
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleChange("budget", e.target.value)}
                  placeholder="500"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                  Deadline (optional)
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleChange("deadline", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                Required Skills
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSkill())
                  }
                  placeholder="Type a skill and press Enter"
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-6 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold rounded-xl transition-colors flex items-center"
                >
                  <Plus size={18} className="mr-1" />
                  Add
                </button>
              </div>

              {formData.required_skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.required_skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-4 py-2 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-full text-sm font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[#1DA1F2] hover:bg-[#1a8cd8] disabled:bg-gray-400 text-white font-bold py-4 rounded-full transition-colors flex items-center justify-center"
              >
                {saving ? (
                  "Posting..."
                ) : (
                  <>
                    <Save size={20} className="mr-2" />
                    Post Job
                  </>
                )}
              </button>
              <a
                href="/dashboard"
                className="px-6 py-4 border-2 border-gray-300 dark:border-white/10 text-[#667085] dark:text-white/60 hover:border-[#1DA1F2] hover:text-[#1DA1F2] font-semibold rounded-full transition-colors text-center"
              >
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
