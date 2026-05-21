"use client";

import { UserPlus, X } from "lucide-react";

/**
 * Profile Gate Modal - Shown when user tries action without profile
 * Friendly onboarding message to guide user to profile creation
 */
export function ProfileGateModal({ isOpen, onClose, actionName, returnTo }) {
  if (!isOpen) return null;

  const handleCreateProfile = () => {
    const url = `/profile/setup?returnTo=${encodeURIComponent(returnTo)}&action=${encodeURIComponent(actionName)}`;
    window.location.href = url;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#121212] rounded-2xl max-w-md w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
            <UserPlus
              size={40}
              className="text-purple-600 dark:text-purple-400"
            />
          </div>
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-3 text-center">
          Profile Required
        </h2>
        <p className="text-[#667085] dark:text-white/60 mb-6 text-center">
          Before you can {actionName}, you need to create your profile. It only
          takes a minute!
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleCreateProfile}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 rounded-full transition-all shadow-lg"
          >
            Create Profile
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileGateModal;
