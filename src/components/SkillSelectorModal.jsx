"use client";

import { useState } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * SKILL SELECTOR MODAL
 * Lightweight profile signal collection for better recommendations
 * ═══════════════════════════════════════════════════════════════════════
 */

const SKILL_OPTIONS = [
  { value: "Video Editing", icon: "✂️", category: "Production" },
  { value: "YouTube", icon: "📺", category: "Platform" },
  { value: "Filmmaking", icon: "🎬", category: "Production" },
  { value: "Animation", icon: "🎨", category: "Creative" },
  { value: "Social Media", icon: "📱", category: "Marketing" },
  { value: "Brand Work", icon: "✨", category: "Business" },
  { value: "Photography", icon: "📸", category: "Creative" },
  { value: "Music Production", icon: "🎵", category: "Audio" },
  { value: "Writing", icon: "✍️", category: "Content" },
  { value: "Cinematography", icon: "📹", category: "Production" },
  { value: "Motion Graphics", icon: "🎭", category: "Creative" },
  { value: "Podcasting", icon: "🎙️", category: "Audio" },
  { value: "Content Strategy", icon: "📊", category: "Marketing" },
  { value: "Graphic Design", icon: "🖌️", category: "Creative" },
  { value: "Sound Design", icon: "🔊", category: "Audio" },
];

export default function SkillSelectorModal({ isOpen, onClose, onSave }) {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSave = async () => {
    if (selectedSkills.length === 0) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/profiles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: selectedSkills,
        }),
      });

      if (response.ok) {
        onSave(selectedSkills);
        onClose();
      } else {
        console.error("Failed to save skills");
      }
    } catch (error) {
      console.error("Error saving skills:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-t-3xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Sparkles size={28} />
            </div>
            <h2 className="text-3xl font-extrabold">
              Help Us Recommend Better Projects
            </h2>
          </div>
          <p className="text-white/90 text-lg">
            Select your skills so we can show you the most relevant
            collaborations.
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-6">
            <p className="text-[#667085] mb-4">
              Choose what you create or specialize in:
            </p>

            {/* Skill Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SKILL_OPTIONS.map((skill) => {
                const isSelected = selectedSkills.includes(skill.value);
                return (
                  <button
                    key={skill.value}
                    onClick={() => toggleSkill(skill.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300 bg-white"
                    }`}
                  >
                    <div className="text-2xl mb-2">{skill.icon}</div>
                    <div className="font-semibold text-[#111418] text-sm">
                      {skill.value}
                    </div>
                    <div className="text-xs text-[#667085] mt-1">
                      {skill.category}
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedSkills.length > 0 && (
              <div className="mt-4 text-sm text-purple-600 font-semibold">
                ✓ {selectedSkills.length} skill
                {selectedSkills.length > 1 ? "s" : ""} selected
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              disabled={selectedSkills.length === 0 || saving}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  Save & Get Recommendations
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            <button
              onClick={handleSkip}
              className="sm:w-auto bg-gray-100 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Skip for Now
            </button>
          </div>

          <p className="text-xs text-[#667085] text-center mt-4">
            You can always update your skills later in your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
}
