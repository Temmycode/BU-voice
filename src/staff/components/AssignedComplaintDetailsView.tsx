"use client";

import type React from "react";
import { useState } from "react";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  PauseCircle,
  Calendar,
  User,
  FileText,
  Tag,
  Download,
  MessageSquare,
  MoreHorizontal,
  ChevronLeft,
} from "lucide-react";
import type { Complaint } from "../../models/complaint";
import { formatDate, formatTime } from "../../utils/dateFormatter";
import { ClipLoader } from "react-spinners";
import { useComplaintClientStore } from "../../clients/complaintClientStore";

// Status step mapping for progress tracker
const statusSteps: Record<string, number> = {
  pending: 0,
  "in progress": 1,
  resolved: 2,
  rejected: -1,
  "on hold": 0.5,
};

// // Status and priority mappings
// const statusColors: Record<string, string> = {
//   pending: "bg-yellow-100 text-yellow-800",
//   "in progress": "bg-blue-100 text-blue-800",
//   resolved: "bg-green-100 text-green-800",
//   rejected: "bg-red-100 text-red-800",
//   "on hold": "bg-purple-100 text-purple-800",
// };

const priorityLabels: Record<number, string> = {
  1: "Critical",
  2: "High",
  3: "Medium",
  4: "Low",
};

const priorityColors: Record<number, string> = {
  1: "bg-red-100 text-red-800",
  2: "bg-orange-100 text-orange-800",
  3: "bg-yellow-100 text-yellow-800",
  4: "bg-blue-100 text-blue-800",
};

const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

interface ComplaintDetailViewProps {
  complaint: Complaint | null;
  onClose?: () => void;
}

const AssignedComplaintDetailsView: React.FC<ComplaintDetailViewProps> = ({
  complaint,
  onClose,
}) => {
  const complaintStore = useComplaintClientStore();
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!complaint) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
        <div className="text-center">
          <div className="w-64 h-64 relative mx-auto">
            <img
              src="/placeholder.svg"
              alt="Select a complaint"
              className="w-64 h-64 opacity-50"
            />
          </div>
          <span className="text-lg font-medium block mt-4">
            Select a complaint to view details
          </span>
          <p className="text-sm text-gray-400 mt-2">
            Click on any complaint from the list to see more information
          </p>
        </div>
      </div>
    );
  }

  const status =
    complaint.complaintAssignment?.status?.toLowerCase() ||
    complaint.status.toLowerCase();
  const currentStep = statusSteps[status];
  const priorityId = complaint.priorityId;

  const handleOpenResponseDialog = () => {
    setIsResponseDialogOpen(true);
    // Pre-fill with current status if it exists
    if (status) {
      setSelectedStatus(status);
    }
  };

  const handleCloseResponseDialog = () => {
    setIsResponseDialogOpen(false);
    setResponseText("");
    setSelectedStatus("");
  };

  const handleSubmitResponse = async () => {
    try {
      setIsSubmitting(true);
      await complaintStore.updateComplaint({
        id: complaint.id,
        status: selectedStatus,
        response: responseText,
      });

      // Close dialog after successful submission
      setIsResponseDialogOpen(false);
      setResponseText("");
      setSelectedStatus("");

      // You might want to refresh the complaint data here
      // or update the local state to reflect the changes
    } catch (error) {
      console.error("Error submitting response:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white p-6 border-b sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#1e293b]">
            Complaint Details
          </h2>
          <div className="flex gap-2">
            {onClose && (
              <button
                onClick={onClose}
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            <div className="relative group">
              <button className="p-2 rounded-md hover:bg-gray-100">
                <MoreHorizontal className="h-4 w-4" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                <div className="py-1">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500">
                    Actions
                  </div>
                  <div className="border-t border-gray-100"></div>
                  <button
                    onClick={handleOpenResponseDialog}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Respond
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
          {/* Header with Title and ID */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-[#1e293b]">
                {complaint.title}
              </h2>
              <div className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                ID: {complaint.id?.substring(0, 8)}
              </div>
            </div>

            <div className="flex items-center mt-2 text-gray-500 text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                Submitted on {formatDate(complaint.createdAt)} at{" "}
                {formatTime(complaint.createdAt.toString())}
              </span>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              Complaint Progress
            </h3>

            {status === "rejected" ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <XCircle className="text-red-500 h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-700">
                    Complaint Rejected
                  </h4>
                  <p className="text-sm text-red-600 mt-1">
                    {complaint.complaintAssignment?.response ||
                      "This complaint has been reviewed and cannot be processed further."}
                  </p>
                </div>
              </div>
            ) : status === "on hold" ? (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="text-purple-500 h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-purple-700">
                    Complaint On Hold
                  </h4>
                  <p className="text-sm text-purple-600 mt-1">
                    {complaint.complaintAssignment?.response ||
                      "This complaint is currently on hold. We'll update when there's progress."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="flex justify-between mb-2">
                  <div className="text-center flex-1">
                    <div
                      className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                        currentStep >= 0
                          ? "bg-[#4f46e5] text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      <Clock className="h-5 w-5" />
                    </div>
                    <span className="text-xs mt-1 block font-medium">
                      Submitted
                    </span>
                  </div>
                  <div className="text-center flex-1">
                    <div
                      className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                        currentStep >= 1
                          ? "bg-[#4f46e5] text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <span className="text-xs mt-1 block font-medium">
                      In Progress
                    </span>
                  </div>
                  <div className="text-center flex-1">
                    <div
                      className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                        currentStep >= 2
                          ? "bg-[#4f46e5] text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <span className="text-xs mt-1 block font-medium">
                      Resolved
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1 absolute top-5 left-0 right-0 mx-10 bg-gray-200">
                  <div
                    className="h-full bg-[#4f46e5] transition-all duration-500"
                    style={{
                      width:
                        currentStep === 0
                          ? "0%"
                          : currentStep === 0.5
                          ? "25%"
                          : currentStep === 1
                          ? "50%"
                          : currentStep === 2
                          ? "100%"
                          : "0%",
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  status === "pending"
                    ? "bg-yellow-500"
                    : status === "in progress"
                    ? "bg-blue-500"
                    : status === "resolved"
                    ? "bg-green-500"
                    : status === "rejected"
                    ? "bg-red-500"
                    : "bg-purple-500"
                } text-white`}
              >
                {status === "pending" && <Clock className="h-5 w-5 mr-1.5" />}
                {status === "in progress" && (
                  <PauseCircle className="h-5 w-5 mr-1.5" />
                )}
                {status === "resolved" && (
                  <CheckCircle className="h-5 w-5 mr-1.5" />
                )}
                {status === "rejected" && (
                  <XCircle className="h-5 w-5 mr-1.5" />
                )}
                {status === "on hold" && (
                  <AlertCircle className="h-5 w-5 mr-1.5" />
                )}
                <span className="ml-1.5">{capitalizeFirstLetter(status)}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Priority
              </h3>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  priorityColors[priorityId!]
                }`}
              >
                {priorityId! <= 2 ? (
                  <AlertCircle className="h-4 w-4 mr-1" />
                ) : (
                  <Tag className="h-4 w-4 mr-1" />
                )}
                {priorityLabels[priorityId!]}
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Student Information
            </h3>
            <div className="flex items-center">
              <User className="h-5 w-5 text-[#4f46e5] mr-2" />
              <span className="text-[#1e293b] font-medium">
                Student ID: {complaint.studentId}
              </span>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-[#4f46e5] mr-2" />
              <span className="text-[#1e293b] font-medium">
                {capitalizeFirstLetter(complaint.category?.name || "General")}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Description
            </h3>
            <p className="text-[#1e293b] whitespace-pre-line">
              {complaint.description}
            </p>
          </div>

          {/* Attachment if exists */}
          {complaint.fileUrl && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
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
            </div>
          )}

          {/* Assignment Details if assigned */}
          {complaint.complaintAssignment && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
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
            </div>
          )}

          {/* Timeline/History */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
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
                    {formatTime(complaint.createdAt.toString())}
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
                      Complaint is being processed
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
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-white p-4 border-t sticky bottom-0">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleOpenResponseDialog}
            disabled={status === "resolved" || status === "rejected"}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg ${
              status === "resolved" || status === "rejected"
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#4f46e5] text-white hover:bg-[#4338ca]"
            } transition-colors`}
          >
            <MessageSquare className="h-5 w-5" />
            {complaint.complaintAssignment?.response
              ? "Update Response"
              : "Respond to Complaint"}
          </button>
        </div>
      </div>

      {/* Response Dialog */}
      {isResponseDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Respond to Complaint</h2>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-sm text-gray-500">Complaint</h3>
              <p className="font-medium">{complaint.title}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Update Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]"
              >
                <option value="">Select status</option>
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
                <option value="on hold">On Hold</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Response</label>
              <textarea
                placeholder="Enter your response to the student..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseResponseDialog}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitResponse}
                disabled={!selectedStatus || !responseText || isSubmitting}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  !selectedStatus || !responseText || isSubmitting
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#4f46e5] text-white hover:bg-[#4338ca]"
                } transition-colors`}
              >
                {isSubmitting ? <ClipLoader size={20} /> : "Submit Response"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedComplaintDetailsView;
