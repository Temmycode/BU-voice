"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  School,
  Building,
  Home,
  Calendar,
  Edit,
  Camera,
  Lock,
  ChevronRight,
  Save,
  X,
  LogOut,
  AlertCircle,
} from "lucide-react";
import { useAuthClientStore } from "../../clients/authClientStore";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatter";
import { Student } from "../../models/student";

const StudentProfileScreen: React.FC = () => {
  const authStore = useAuthClientStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const studentData = (() => {
    const storedData = localStorage.getItem("user");
    if (!storedData) return null;

    const parsedData = JSON.parse(storedData);
    return Student.fromJson(parsedData); // Ensure correct deserialization
  })();

  console.log(studentData);

  // Form state for editing
  const [formData, setFormData] = useState({
    fullName: studentData?.fullName,
    email: studentData?.email,
    department: studentData?.department,
    school: studentData?.school,
    hallName: studentData?.hallName,
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
          <div className="relative h-48 bg-gradient-to-r from-[#4f46e5] to-[#6366f1]">
            <div className="absolute -bottom-16 left-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
                  {studentData?.profileImage ? (
                    <img
                      src={studentData?.profileImage || "/placeholder.svg"}
                      alt={studentData?.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#4f46e5]/10 flex items-center justify-center">
                      <span className="text-3xl font-bold text-[#4f46e5]">
                        {studentData?.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .substring(0, 2)}
                      </span>
                    </div>
                  )}
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
                {studentData?.fullName}
              </h1>
              <p className="text-[#475569]">{studentData?.matricNo}</p>
            </div>

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
                          name="fullName"
                          value={formData.fullName}
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
                          <p className="text-[#1e293b]">{studentData?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-[#94a3b8] mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm text-[#94a3b8]">Joined</p>
                          <p className="text-[#1e293b]">
                            {studentData?.createdAt
                              ? formatDate(studentData.createdAt)
                              : "HEllo world"}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Academic Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-[#f8fafc] p-6 rounded-xl"
              >
                <h2 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center">
                  <School className="h-5 w-5 mr-2 text-[#4f46e5]" />
                  Academic Information
                </h2>

                <div className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#475569] mb-1">
                          School
                        </label>
                        <input
                          type="text"
                          name="school"
                          value={formData.school}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/50 focus:border-[#4f46e5]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#475569] mb-1">
                          Department
                        </label>
                        <input
                          type="text"
                          name="department"
                          value={formData.department ?? "wol"}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/50 focus:border-[#4f46e5]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#475569] mb-1">
                          Hall Name
                        </label>
                        <input
                          type="text"
                          name="hallName"
                          value={formData.hallName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/50 focus:border-[#4f46e5]"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start">
                        <School className="h-5 w-5 text-[#94a3b8] mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm text-[#94a3b8]">School</p>
                          <p className="text-[#1e293b]">
                            {studentData?.school}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Building className="h-5 w-5 text-[#94a3b8] mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm text-[#94a3b8]">Department</p>
                          <p className="text-[#1e293b]">
                            {studentData?.department}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Home className="h-5 w-5 text-[#94a3b8] mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm text-[#94a3b8]">Hall Name</p>
                          <p className="text-[#1e293b]">
                            {studentData?.hallName}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Account Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 bg-[#f8fafc] p-6 rounded-xl"
            >
              <h2 className="text-lg font-semibold text-[#1e293b] mb-4 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-[#4f46e5]" />
                Account Settings
              </h2>

              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <Lock className="h-5 w-5 text-[#94a3b8] mr-3" />
                    <span className="text-[#1e293b]">Change Password</span>
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
          </div>
        </motion.div>

        {/* Student ID Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-lg font-semibold text-[#1e293b] mb-4">
              Student ID Card
            </h2>

            <div className="bg-gradient-to-r from-[#4f46e5] to-[#6366f1] rounded-xl overflow-hidden shadow-lg">
              <div className="p-6 text-white">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold">Babcock University</h3>
                    <p className="text-sm opacity-80">Student Identification</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <School className="h-6 w-6" />
                  </div>
                </div>

                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-white/20 mr-4 flex items-center justify-center">
                    {studentData?.profileImage ? (
                      <img
                        src={studentData.profileImage || "/placeholder.svg"}
                        alt={studentData.fullName}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-xl font-bold">
                        {/* {studentData.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .substring(0, 2)} */}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">
                      {studentData?.fullName}
                    </h4>
                    <p className="text-sm opacity-80">
                      {studentData?.matricNo}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="opacity-80">School</p>
                    <p className="font-medium">{studentData?.school}</p>
                  </div>
                  <div>
                    <p className="opacity-80">Department</p>
                    <p className="font-medium">{studentData?.department}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center">
                  <p className="text-xs opacity-80">
                    ID: {studentData?.id.toString().padStart(6, "0")}
                  </p>
                  <p className="text-xs opacity-80">
                    Valid until: {new Date().getFullYear() + 4}
                  </p>
                </div>
              </div>
            </div>
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

export default StudentProfileScreen;
