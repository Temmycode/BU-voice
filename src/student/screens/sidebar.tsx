"use client";

import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";
import { menuItems } from "../../constants/constants";
import { useAuthClientStore } from "../../clients/authClientStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// ProfilePicture component
const ProfilePicture = ({
  imageUrl,
  name,
}: {
  imageUrl?: string;
  name?: string;
}) => {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "BU";

  return (
    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#4f46e5] flex items-center justify-center text-white font-medium">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement!.querySelector(
              "span"
            )!.style.display = "flex";
          }}
        />
      ) : null}
      <span
        className={
          imageUrl
            ? "hidden absolute inset-0 flex items-center justify-center"
            : "flex"
        }
      >
        {initials}
      </span>
    </div>
  );
};

function StudentSideBar() {
  const authStore = useAuthClientStore();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Get user info
  const userInfo = JSON.parse(localStorage.getItem("user") || "{}") || {
    fullname: "Student User",
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await authStore.logout();
    navigate("/login?role=student");
  };

  return (
    <div
      className={`font-jaka h-screen bg-white ${
        isCollapsed ? "w-20" : "w-64"
      } transition-all duration-300 flex flex-col border-r border-gray-200 relative`}
    >
      {/* Toggle collapse button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white rounded-full p-1 shadow-md border border-gray-200 text-gray-500 hover:text-[#4f46e5] md:hidden"
      >
        {isCollapsed ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        )}
      </button>

      {/* Logo */}
      <div
        className={`mb-8 px-4 py-6 flex items-center ${
          isCollapsed ? "justify-center" : ""
        }`}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center"
        >
          <div className="w-9 h-9 bg-[#4f46e5] rounded-lg flex items-center justify-center text-white">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          {!isCollapsed && (
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-bold text-[#1e293b] ml-2"
            >
              BU <span className="text-[#4f46e5]">Voice</span>
            </motion.h1>
          )}
        </motion.div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <motion.li
              key={item.path}
              whileHover={{ x: 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }: { isActive: boolean }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? "bg-[#4f46e5]/10 text-[#4f46e5]"
                      : "text-[#475569] hover:bg-gray-100"
                  }`
                }
              >
                <div className="text-gray-500">{item.icon}</div>
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.name}</span>
                )}
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Profile & Logout */}
      <div className="mt-auto border-t border-gray-200 pt-4 px-3">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "px-2 py-2"
          } mb-2`}
        >
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1e293b] truncate">
                {userInfo.fullname}
              </p>
              <p className="text-xs text-gray-500 truncate">Student</p>
            </div>
          )}
          <ProfilePicture
            imageUrl={userInfo.imageUrl}
            name={userInfo.fullname}
          />
        </div>

        <motion.button
          whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
          onClick={() => setShowLogoutConfirm(true)}
          className={`flex items-center gap-3 w-full ${
            isCollapsed ? "justify-center" : ""
          } px-3 py-2.5 text-red-600 rounded-lg transition-colors`}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
        </motion.button>
      </div>

      {/* Logout Confirmation */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
              <h3 className="text-lg font-semibold text-[#1e293b]">
                Logout from BU Voice?
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Are you sure you want to logout?
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default StudentSideBar;
