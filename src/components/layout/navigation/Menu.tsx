"use client";

import Link from "next/link";
import {useState, useRef, useEffect} from "react";
import {useAuth} from "@/store/Auth";
import {Button} from "@/components/ui/button";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export function NavMenu() {
  const {logout, user} = useAuth();
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
                className="flex items-center gap-2 text-gray-900 cursor-pointer hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                aria-haspopup="true"
                aria-expanded={isProfileOpen}
              >
                <div className="flex items-center gap-3">
                  {user?.coverPhoto ? (
                    <img
                      src={`${BASE_URL}/uploads/${user.coverPhoto}`}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full p-5 bg-black text-white flex items-center justify-center gap-1 font-semibold">
                      <span>{user?.firstName?.[0] || ""}</span>
                      <span>{user?.lastName?.[0] || ""}</span>
                    </div>
                  )}
                </div>

                <div className="w-12 h-12 flex items-center justify-center gap-2">
                  <span className="text-sm font-semibold">{user?.firstName || "User"}</span>
                  <span className="text-xs font-medium">{user?.lastName?.[0] || "U"}</span>
                </div>

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
                  className="absolute left-0 w-full bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
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
