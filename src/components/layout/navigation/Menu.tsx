"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/store/Auth";
import { Button } from "@/components/ui/button";

export function NavMenu() {
  const { logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  return (
    <nav className="w-full">
      <div className="w-full">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/auth"
              className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Home
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                ref={triggerRef}
                onClick={toggleProfile}
                className="flex items-center text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-haspopup="true"
                aria-expanded={isProfileOpen}
              >
                My Profile
                <svg
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isProfileOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="py-1" role="none">
                    <Link
                      href="/auth/profile"
                      onClick={closeProfile}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                      role="menuitem"
                    >
                      View Profile
                    </Link>
                    <Link
                      href="/auth/profile/edit"
                      onClick={closeProfile}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                      role="menuitem"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={logout}
              className="cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
