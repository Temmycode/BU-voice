"use client";

import { useAuthClientStore } from "../../clients/authClientStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  BarChart2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  LogOut,
  MessageSquare,
  User,
  X,
} from "lucide-react";
import { useSidebarStore } from "../../providers/SidebarProvider";
import { Staff } from "../../models/staff";
import { getInitials } from "../../utils/dateFormatter";
import { useComplaintClientStore } from "../../clients/complaintClientStore";

function StaffSideBar() {
  const authStore = useAuthClientStore();
  const complaintStore = useComplaintClientStore();
  const navigate = useNavigate();
  const sidebarProvider = useSidebarStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userInfo: Staff = JSON.parse(localStorage.getItem("user") || "{}") || {
    fullname: "Staff User",
  };

  const handleLogout = async () => {
    // setShowLogoutConfirm(false);
    await authStore.logout();
    navigate("/login?role=admin");
  };

  // Dashboard stats
  const dashboardStats = {
    totalComplaints: 124,
    pendingComplaints: 45,
    resolvedComplaints: 68,
    rejectedComplaints: 11,
    averageResponseTime: "1.5 days",
    resolutionRate: 78,
  };

  // Handlers
  const handleToggleSidebar = () => {
    sidebarProvider.setSidebarCollapsed(!sidebarProvider.sidebarCollapsed);
  };

  const handleToggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div
      className={`h-screen bg-white ${
        sidebarProvider.sidebarCollapsed ? "w-20" : "w-64"
      } transition-all duration-300 flex flex-col border-r border-gray-200 fixed z-20 ${
        mobileMenuOpen ? "left-0" : "-left-full md:left-0"
      }`}
    >
      {/* Toggle collapse button */}
      <button
        onClick={handleToggleSidebar}
        className="absolute -right-3 top-6 bg-white rounded-full p-1 shadow-md border border-gray-200 text-gray-500 hover:text-[#4f46e5] hidden md:block"
      >
        {sidebarProvider.sidebarCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {/* Close mobile menu button */}
      <button
        onClick={handleToggleMobileMenu}
        className="absolute right-4 top-4 text-gray-500 md:hidden"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Logo Section */}
      <div
        className={`mb-8 px-4 py-6 flex items-center ${
          sidebarProvider.sidebarCollapsed ? "justify-center" : ""
        }`}
      >
        <div className="flex items-center">
          <div className="w-9 h-9 bg-[#4f46e5] rounded-lg flex items-center justify-center text-white">
            <MessageSquare className="h-5 w-5" />
          </div>
          {!sidebarProvider.sidebarCollapsed && (
            <h1 className="text-xl font-bold text-[#1e293b] ml-2">
              BU <span className="text-[#4f46e5]">Voice</span>
            </h1>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2">
        <ul className="space-y-1">
          <li>
            <div
              onClick={() => navigate("/staff")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all bg-[#4f46e5]/10 text-[#4f46e5]`}
            >
              <BarChart2 className="h-5 w-5" />
              {!sidebarProvider.sidebarCollapsed && (
                <span className="font-medium text-sm">Dashboard</span>
              )}
            </div>
          </li>
          <li>
            <div
              onClick={() => navigate("/staff/complaints")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-[#475569] hover:bg-gray-100`}
            >
              <MessageSquare className="h-5 w-5 text-gray-500" />
              {!sidebarProvider.sidebarCollapsed && (
                <span className="font-medium text-sm">All Complaints</span>
              )}
              {!sidebarProvider.sidebarCollapsed && (
                <span className="ml-auto bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {complaintStore.allComplaints.length}
                </span>
              )}
            </div>
          </li>
          <li>
            <div
              onClick={() => navigate("/staff/assigned")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-[#475569] hover:bg-gray-100`}
            >
              <User className="h-5 w-5 text-gray-500" />
              {!sidebarProvider.sidebarCollapsed && (
                <span className="font-medium text-sm">Assigned to Me</span>
              )}
            </div>
          </li>
          <li>
            <div
              onClick={() => navigate("/staff/pending")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-[#475569] hover:bg-gray-100`}
            >
              <Clock className="h-5 w-5 text-gray-500" />
              {!sidebarProvider.sidebarCollapsed && (
                <span className="font-medium text-sm">Pending</span>
              )}
              {!sidebarProvider.sidebarCollapsed && (
                <span className="ml-auto bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {dashboardStats.pendingComplaints}
                </span>
              )}
            </div>
          </li>
          <li>
            <div
              onClick={() => navigate("/staff/resolved")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-[#475569] hover:bg-gray-100`}
            >
              <CheckCircle className="h-5 w-5 text-gray-500" />
              {!sidebarProvider.sidebarCollapsed && (
                <span className="font-medium text-sm">Resolved</span>
              )}
            </div>
          </li>
        </ul>
      </nav>

      {/* User Profile & Logout */}
      <div className="mt-auto border-t border-gray-200 pt-4 px-3">
        <div
          className={`flex items-center ${
            sidebarProvider.sidebarCollapsed ? "justify-center" : "px-2 py-2"
          } mb-2`}
        >
          {!sidebarProvider.sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1e293b] truncate">
                {userInfo.fullname}
              </p>
              <p className="text-xs text-gray-500 truncate">Staff</p>
            </div>
          )}
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#4f46e5] flex items-center justify-center text-white font-medium">
            <span>{getInitials(userInfo.fullname)}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full ${
            sidebarProvider.sidebarCollapsed ? "justify-center" : ""
          } px-3 py-2.5 text-red-600 rounded-lg transition-colors hover:bg-red-50`}
        >
          <LogOut className="w-5 h-5" />
          {!sidebarProvider.sidebarCollapsed && (
            <span className="font-medium text-sm">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default StaffSideBar;
