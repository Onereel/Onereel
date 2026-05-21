"use client";

import { useState, useEffect } from "react";

/**
 * Renders the global site footer on every page EXCEPT the homepage.
 * The homepage "/" is fully self-contained with its own footer.
 *
 * ✅ FIXED: isHome starts as false on BOTH server and client.
 * The old code used useState(() => window.location.pathname) which caused
 * server=false / client=true → React hydration crash → blank page.
 */
export default function ConditionalFooter() {
  const [isHome, setIsHome] = useState(false); // Always false on SSR

  useEffect(() => {
    setIsHome(window.location.pathname === "/");
  }, []);

  if (isHome) return null;

  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-400">
              © 2026 One Reel. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6 text-sm">
            <a
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms
            </a>
            <a
              href="/privacy"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="/content-policy"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Content Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
