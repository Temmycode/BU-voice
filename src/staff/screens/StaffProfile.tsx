"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  Edit,
  Camera,
  Lock,
  ChevronRight,
  Save,
  X,
  LogOut,
  AlertCircle,
  Briefcase,
  Shield,
  Settings,
  Users,
  Bell,
} from "lucide-react";
import { useAuthClientStore } from "../../clients/authClientStore";
import { useNavigate } from "react-router-dom";
import formatDate2, { formatDate } from "../../utils/dateFormatter";
import { Staff } from "../../models/staff";
import { Complaint } from "../../models/complaint";
import { useComplaintClientStore } from "../../clients/complaintClientStore";

const StaffProfile: React.FC = () => {
  const authStore = useAuthClientStore();
  const complaintStore = useComplaintClientStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const staffData = (() => {
    const storedData = localStorage.getItem("user");
    if (!storedData) return null;

    const parsedData = JSON.parse(storedData);
    return Staff.fromJson(parsedData); // Ensure correct deserialization
  })();

  useEffect(() => {
    complaintStore.getStaffResolvedComplaints();
  }, []);

  // Form state for editing
  const [formData, setFormData] = useState({
    fullname: staffData?.fullname,
    email: staffData?.email,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    // Here you would call an API to update the profile
    // For now, we'll just exit edit mode
    setIsEditing(false);
    // Show success toast or notification
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await authStore.logout();
    navigate("/login");
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Here you would upload the file to your server
      // For now, we'll just log it
      console.log("File selected:", file.name);
    }
  };

  // Get role badge color based on role name
  const getRoleBadgeColor = (roleName: string) => {
    const role = roleName.toLowerCase();
    if (role === "admin" || role === "administrator")
      return "bg-red-100 text-red-800";
    if (role === "manager") return "bg-purple-100 text-purple-800";
    if (role === "supervisor") return "bg-blue-100 text-blue-800";
    return "bg-green-100 text-green-800"; // default for staff
  };

  const ResolvedContainer = ({ complaint }: { complaint: Complaint }) => {
    return (
      <div className="relative pl-8 pb-4 border-l-2 border-gray-200">
        <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-[#4f46e5]"></div>
        <div className="mb-1 text-sm font-medium text-[#1e293b]">
          Resolved Complaint #{complaint.id}
        </div>
        <div className="text-xs text-[#94a3b8]">
          {formatDate2(complaint.complaintAssignment!.resolvedAt!)}
        </div>
        <div className="mt-2 text-sm text-[#475569]">
          Resolved a student complaint regarding course registration issues.
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-[#f8fafc] py-8 px-4 md:px-8 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm overflow-y-auto"
        >
          {/* Header with profile image */}
          <div className="relative h-48 bg-gradient-to-r from-[#1e293b] to-[#334155]">
            <div className="absolute -bottom-16 left-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
                  {/* We'll use a placeholder since we don't have profileImage in the Staff class */}
                  <div className="w-full h-full bg-[#4f46e5]/10 flex items-center justify-center">
                    <span className="text-3xl font-bold text-[#4f46e5]">
                      {staffData?.fullname
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .substring(0, 2)}
                    </span>
                  </div>
                </div>
                <label className="absolute bottom-0 right-0 bg-[#4f46e5] text-white p-2 rounded-full cursor-pointer shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-5 w-5" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                  />
                </label>
              </div>
            </div>

            {/* Role badge */}
            <div className="absolute top-4 left-4">
              <div
                className={`${getRoleBadgeColor(
                  staffData!.role.name!
                )} px-3 py-1 rounded-full text-sm font-medium flex items-center`}
              >
                <Shield className="h-4 w-4 mr-1.5" />
                {staffData?.role.name}
              </div>
            </div>

            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="bg-white text-[#4f46e5] p-2 rounded-lg hover:bg-white/90 transition-colors"
                  >
                    <Save className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Edit className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Profile content */}
          <div className="pt-20 pb-8 px-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[#1e293b]">
                {staffData?.fullname}
              </h1>
              <div className="flex items-center mt-1">
                <Briefcase className="h-4 w-4 text-[#94a3b8] mr-1.5" />
                <p className="text-[#475569]">{staffData?.role.name}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`pb-4 px-1 ${
                    activeTab === "profile"
                      ? "border-b-2 border-[#4f46e5] text-[#4f46e5] font-medium"
                      : "text-[#475569] hover:text-[#1e293b]"
                  } transition-colors`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`pb-4 px-1 ${
                    activeTab === "activity"
                      ? "border-b-2 border-[#4f46e5] text-[#4f46e5] font-medium"
                      : "text-[#475569] hover:text-[#1e293b]"
                  } transition-colors`}
                >
                  Activity
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`pb-4 px-1 ${
                    activeTab === "settings"
                      ? "border-b-2 border-[#4f46e5] text-[#4f46e5] font-medium"
                      : "text-[#475569] hover:text-[#1e293b]"
                  } transition-colors`}
                >
                  Settings
                </button>
              </div>
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Profile sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="bg-[#f8fafc] p-6 rounded-xl"
                    >
                      <h2 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center">
                        <User className="h-5 w-5 mr-2 text-[#4f46e5]" />
                        Personal Information
                      </h2>

                      <div className="space-y-4">
                        {isEditing ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-[#475569] mb-1">
                                Full Name
                              </label>
                              <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/50 focus:border-[#4f46e5]"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#475569] mb-1">
                                Email
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/50 focus:border-[#4f46e5]"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start">
                              <Mail className="h-5 w-5 text-[#94a3b8] mt-0.5 mr-3" />
                              <div>
                                <p className="text-sm text-[#94a3b8]">Email</p>
                                <p className="text-[#1e293b]">
                                  {staffData?.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Calendar className="h-5 w-5 text-[#94a3b8] mt-0.5 mr-3" />
                              <div>
                                <p className="text-sm text-[#94a3b8]">Joined</p>
                                <p className="text-[#1e293b]">
                                  {formatDate(staffData!.created_at)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Shield className="h-5 w-5 text-[#94a3b8] mt-0.5 mr-3" />
                              <div>
                                <p className="text-sm text-[#94a3b8]">Role</p>
                                <p className="text-[#1e293b]">
                                  {staffData?.role.name}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>

                    {/* Role & Permissions */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="bg-[#f8fafc] p-6 rounded-xl"
                    >
                      <h2 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-[#4f46e5]" />
                        Role & Permissions
                      </h2>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                          <div className="flex items-center">
                            <Users className="h-5 w-5 text-[#94a3b8] mr-3" />
                            <span className="text-[#1e293b]">
                              Manage Students
                            </span>
                          </div>
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                          <div className="flex items-center">
                            <Briefcase className="h-5 w-5 text-[#94a3b8] mr-3" />
                            <span className="text-[#1e293b]">
                              Manage Complaints
                            </span>
                          </div>
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                          <div className="flex items-center">
                            <Settings className="h-5 w-5 text-[#94a3b8] mr-3" />
                            <span className="text-[#1e293b]">
                              System Settings
                            </span>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full ${
                              staffData?.role.name.toLowerCase() === "admin"
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Staff ID Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-8 bg-[#f8fafc] p-6 rounded-xl"
                  >
                    <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
                      Staff ID Card
                    </h2>

                    <div className="bg-gradient-to-r from-[#1e293b] to-[#334155] rounded-xl overflow-hidden shadow-lg">
                      <div className="p-6 text-white">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-xl font-bold">
                              Babcock University
                            </h3>
                            <p className="text-sm opacity-80">
                              Staff Identification
                            </p>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                            <Briefcase className="h-6 w-6" />
                          </div>
                        </div>

                        <div className="flex items-center mb-6">
                          <div className="w-16 h-16 rounded-full bg-white/20 mr-4 flex items-center justify-center">
                            <span className="text-xl font-bold">
                              {staffData?.fullname
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .substring(0, 2)}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-lg font-bold">
                              {staffData?.fullname}
                            </h4>
                            <div
                              className={`inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium bg-white/20`}
                            >
                              {staffData?.role.name}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="opacity-80">Email</p>
                            <p className="font-medium">{staffData?.email}</p>
                          </div>
                          <div>
                            <p className="opacity-80">Staff ID</p>
                            <p className="font-medium">
                              {staffData?.id.toString().padStart(6, "0")}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center">
                          <p className="text-xs opacity-80">
                            Joined: {formatDate(staffData!.created_at)}
                          </p>
                          <div className="bg-white/20 px-2 py-1 rounded text-xs">
                            STAFF
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === "activity" && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#f8fafc] p-6 rounded-xl"
                >
                  <h2 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-[#4f46e5]" />
                    Recent Activity
                  </h2>

                  <div className="space-y-4">
                    {/* Activity Timeline */}
                    {complaintStore.staffResolvedComplaints.map((complaint) => (
                      <ResolvedContainer complaint={complaint} />
                    ))}

                    <div className="relative pl-8 pb-4 border-l-2 border-gray-200">
                      <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-[#4f46e5]"></div>
                      <div className="mb-1 text-sm font-medium text-[#1e293b]">
                        Assigned Complaint #1230
                      </div>
                      <div className="text-xs text-[#94a3b8]">
                        Yesterday at 3:45 PM
                      </div>
                      <div className="mt-2 text-sm text-[#475569]">
                        Assigned a new complaint to the Facilities department.
                      </div>
                    </div>

                    <div className="relative pl-8 pb-4 border-l-2 border-gray-200">
                      <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-[#4f46e5]"></div>
                      <div className="mb-1 text-sm font-medium text-[#1e293b]">
                        Updated Profile
                      </div>
                      <div className="text-xs text-[#94a3b8]">3 days ago</div>
                      <div className="mt-2 text-sm text-[#475569]">
                        Updated profile information and contact details.
                      </div>
                    </div>

                    <div className="relative pl-8 pb-0">
                      <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-[#4f46e5]"></div>
                      <div className="mb-1 text-sm font-medium text-[#1e293b]">
                        Account Created
                      </div>
                      <div className="text-xs text-[#94a3b8]">
                        {formatDate(staffData!.created_at)}
                      </div>
                      <div className="mt-2 text-sm text-[#475569]">
                        Account was created and role was assigned.
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Account Settings */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-[#f8fafc] p-6 rounded-xl"
                  >
                    <h2 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center">
                      <Lock className="h-5 w-5 mr-2 text-[#4f46e5]" />
                      Account Settings
                    </h2>

                    <div className="space-y-2">
                      <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center">
                          <Lock className="h-5 w-5 text-[#94a3b8] mr-3" />
                          <span className="text-[#1e293b]">
                            Change Password
                          </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-[#94a3b8]" />
                      </button>

                      <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center">
                          <Bell className="h-5 w-5 text-[#94a3b8] mr-3" />
                          <span className="text-[#1e293b]">
                            Notification Settings
                          </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-[#94a3b8]" />
                      </button>

                      <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                      >
                        <div className="flex items-center">
                          <LogOut className="h-5 w-5 mr-3" />
                          <span>Logout</span>
                        </div>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </motion.div>

                  {/* System Preferences */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mt-6 bg-[#f8fafc] p-6 rounded-xl"
                  >
                    <h2 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-[#4f46e5]" />
                      System Preferences
                    </h2>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-[#1e293b]">Dark Mode</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4f46e5]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4f46e5]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-[#1e293b]">
                            Email Notifications
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                            checked
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4f46e5]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4f46e5]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-[#1e293b]">
                            Two-Factor Authentication
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4f46e5]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4f46e5]"></div>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-[#1e293b]">
                  Logout from BU Voice?
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Are you sure you want to logout from your account?
                </p>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="ml-auto bg-gray-100 rounded-full p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffProfile;
