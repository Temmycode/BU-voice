import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  Tag,
  User,
  MessageSquare,
  Download,
  //   ChevronRight,
  XCircle,
  PauseCircle,
} from "lucide-react";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Complaint } from "../models/complaint";
import { formatDate, formatTime } from "../utils/dateFormatter";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { useComplaintClientStore } from "../clients/complaintClientStore";
import { useSidebarStore } from "../providers/SidebarProvider";
import ProgressTracker from "./ProgressTracker";

interface ComplaintDetailViewProps {
  complaint: Complaint | null;
}

// Status step mapping
const statusSteps = {
  pending: 0,
  "in progress": 1,
  resolved: 2,
  rejected: -1,
  "on hold": 0.5,
};

// Status colors
const statusColors = {
  pending: "bg-yellow-500",
  "in progress": "bg-blue-500",
  resolved: "bg-green-500",
  rejected: "bg-red-500",
  "on hold": "bg-purple-500",
};

// Status icons
const statusIcons = {
  pending: <Clock className="h-5 w-5" />,
  "in progress": <PauseCircle className="h-5 w-5" />,
  resolved: <CheckCircle className="h-5 w-5" />,
  rejected: <XCircle className="h-5 w-5" />,
  "on hold": <AlertCircle className="h-5 w-5" />,
};

// Priority mapping
const priorityLabels = {
  4: "Low",
  3: "Medium",
  2: "High",
  1: "Critical",
};

const priorityColors = {
  1: "bg-green-100 text-green-800",
  2: "bg-blue-100 text-blue-800",
  3: "bg-orange-100 text-orange-800",
  4: "bg-red-100 text-red-800",
};

export const ComplaintDetailView: React.FC<ComplaintDetailViewProps> = ({
  complaint,
}) => {
  const sidebarStore = useSidebarStore();
  const [followUpMessage, setFollowUpMessage] = useState("");
  const { studentComplaintFollowUp } = useComplaintClientStore();

  const handleOpenResponseDialog = () => {
    sidebarStore.setIsResponseDialogOpen(true);
  };

  const handleCloseResponseDialog = () => {
    sidebarStore.setIsResponseDialogOpen(false);
  };

  const handleSubmitResponse = async () => {
    console.log(followUpMessage.length);
    if (followUpMessage.length > 0) {
      followUp();
    }

    sidebarStore.setIsResponseDialogOpen(false);
  };

  async function followUp() {
    await studentComplaintFollowUp(followUpMessage, complaint!.id!);
  }

  if (!complaint) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-gray-500">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <DotLottieReact
            src="https://lottie.host/86ad3b44-a532-4897-bcd3-0098f70f0d28/Au3JouTGv3.lottie"
            autoplay
            loop
            className="w-64 h-64 mx-auto"
          />
          <span className="text-lg font-medium block mt-4">
            Select a complaint to view details
          </span>
          <p className="text-sm text-gray-400 mt-2">
            Click on any complaint from the list to see more information
          </p>
        </motion.div>
      </div>
    );
  }

  const status =
    complaint.complaintAssignment?.status?.toLowerCase() || "pending";
  const currentStep = statusSteps[status];
  const priorityId = complaint.priorityId || 1;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={complaint.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6 w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6 h-screen overflow-y-auto"
      >
        {/* Header with Title and ID */}
        <div className="border-b pb-4">
          <div className="flex justify-between items-start">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold text-[#1e293b]"
            >
              {complaint.title}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium"
            >
              ID: {complaint.id?.substring(0, 8)}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center mt-2 text-gray-500 text-sm"
          >
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              Submitted on {formatDate(complaint.createdAt)} at{" "}
              {formatTime(complaint.createdAt)}
            </span>
          </motion.div>
        </div>

        {/* Progress Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-4"
        >
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            Complaint Progress
          </h3>
          <ProgressTracker
            status={status}
            response={complaint.complaintAssignment?.response ?? "Empty"}
          />
        </motion.div>

        {/* Status and Priority */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]} text-primary-black`}
            >
              {statusIcons[status]}
              <span className="ml-1.5">{capitalizeFirstLetter(status)}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Priority</h3>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${priorityColors[priorityId]}`}
            >
              {priorityId >= 3 ? (
                <AlertCircle className="h-4 w-4 mr-1" />
              ) : (
                <Tag className="h-4 w-4 mr-1" />
              )}
              {priorityLabels[priorityId]}
            </div>
          </div>
        </motion.div>

        {/* Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-50 p-4 rounded-lg"
        >
          <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-[#4f46e5] mr-2" />
            <span className="text-[#1e293b] font-medium">
              {capitalizeFirstLetter(complaint.category?.name || "General")}
            </span>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-50 p-4 rounded-lg"
        >
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Description
          </h3>
          <p className="text-[#1e293b] whitespace-pre-line">
            {complaint.description}
          </p>
        </motion.div>

        {/* Staff Response */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-50 p-4 rounded-lg"
        >
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Staff Response
          </h3>
          <p className="text-[#1e293b] whitespace-pre-line">
            {complaint?.complaintAssignment?.response ?? "Empty"}
          </p>
        </motion.div>

        {/* Attachment if exists */}
        {complaint.fileUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gray-50 p-4 rounded-lg"
          >
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Attachment
            </h3>
            <div className="mt-2 relative group">
              <img
                src={complaint.fileUrl || "/placeholder.svg"}
                alt="Complaint attachment"
                className="w-full h-auto max-h-64 object-contain rounded-md border border-gray-200"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                <a
                  href={complaint.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="bg-white rounded-full p-2 shadow-lg"
                >
                  <Download className="h-5 w-5 text-[#4f46e5]" />
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Assignment Details if assigned */}
        {complaint.complaintAssignment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gray-50 p-4 rounded-lg"
          >
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              Assignment Details
            </h3>

            <div className="flex items-center mb-3">
              <User className="h-5 w-5 text-[#4f46e5] mr-2" />
              <div>
                <span className="text-sm text-gray-500">Assigned To:</span>
                <span className="ml-2 font-medium text-[#1e293b]">
                  {complaint.complaintAssignment.staff.fullname}
                </span>
              </div>
            </div>

            {complaint.complaintAssignment.assignedAt && (
              <div className="flex items-center mb-3">
                <Calendar className="h-5 w-5 text-[#4f46e5] mr-2" />
                <div>
                  <span className="text-sm text-gray-500">Assigned On:</span>
                  <span className="ml-2 text-[#1e293b]">
                    {formatDate(complaint.complaintAssignment.assignedAt)}
                  </span>
                </div>
              </div>
            )}

            {complaint.complaintAssignment.response && (
              <div className="mt-3 border-t border-gray-200 pt-3">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Staff Response:
                </h4>
                <div className="bg-white p-3 rounded border border-gray-200 text-[#1e293b]">
                  {complaint.complaintAssignment.response}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Timeline/History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-gray-50 p-4 rounded-lg"
        >
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            Complaint Timeline
          </h3>

          <div className="space-y-4">
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#4f46e5] z-10"></div>
                <div className="h-full w-0.5 bg-gray-200"></div>
              </div>
              <div className="flex-1 pb-4">
                <div className="text-sm font-medium text-[#1e293b]">
                  Complaint Submitted
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(complaint.createdAt)} at{" "}
                  {formatTime(complaint.createdAt)}
                </div>
              </div>
            </div>

            {complaint.complaintAssignment && (
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4f46e5] z-10"></div>
                  <div className="h-full w-0.5 bg-gray-200"></div>
                </div>
                <div className="flex-1 pb-4">
                  <div className="text-sm font-medium text-[#1e293b]">
                    Assigned to Staff
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(complaint.complaintAssignment.assignedAt) ||
                      "Date not available"}
                  </div>
                  <div className="text-sm mt-1">
                    Assigned to {complaint.complaintAssignment.staff.fullname}
                  </div>
                </div>
              </div>
            )}

            {status === "in progress" && (
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4f46e5] z-10"></div>
                  <div className="h-full w-0.5 bg-gray-200"></div>
                </div>
                <div className="flex-1 pb-4">
                  <div className="text-sm font-medium text-[#1e293b]">
                    Processing Started
                  </div>
                  <div className="text-xs text-gray-500">
                    {complaint.complaintAssignment?.updatedAt
                      ? formatDate(complaint.complaintAssignment.updatedAt)
                      : "Date not available"}
                  </div>
                  <div className="text-sm mt-1">
                    Your complaint is being processed
                  </div>
                </div>
              </div>
            )}

            {(status === "resolved" || status === "rejected") && (
              <div className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      status === "resolved" ? "bg-green-500" : "bg-red-500"
                    } z-10`}
                  ></div>
                  <div className="h-full w-0.5 bg-transparent"></div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#1e293b]">
                    {status === "resolved"
                      ? "Complaint Resolved"
                      : "Complaint Rejected"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {complaint.complaintAssignment?.updatedAt
                      ? formatDate(complaint.complaintAssignment.updatedAt)
                      : "Date not available"}
                  </div>
                  {complaint.complaintAssignment?.response && (
                    <div className="text-sm mt-1 text-gray-600">
                      {complaint.complaintAssignment.response}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Actions */}
        {status !== "resolved" && status !== "rejected" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-2"
          >
            <button
              onClick={handleOpenResponseDialog}
              className="w-full bg-[#4f46e5] text-white py-3 rounded-lg font-medium flex items-center justify-center hover:bg-[#4338ca] transition-colors"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Send Follow-up Message
            </button>
          </motion.div>
        )}

        {/* Response Dialog */}
        {sidebarStore.isResponseDialogOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">
                Send a Follow Up Message
              </h2>

              {complaint && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-sm text-gray-500">
                    Complaint
                  </h3>
                  <p className="font-medium">{complaint.title}</p>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  placeholder="Enter your response to the student..."
                  value={followUpMessage}
                  onChange={(e) => setFollowUpMessage(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCloseResponseDialog}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitResponse}
                  disabled={!followUpMessage}
                  className={`px-4 py-2 rounded-lg ${
                    followUpMessage
                      ? "bg-[#4f46e5] text-white hover:bg-[#4338ca]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  } transition-colors`}
                >
                  Submit Response
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ComplaintDetailView;
