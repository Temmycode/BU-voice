import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  FileText,
  MessageSquare,
  MoreHorizontal,
  PauseCircle,
  Tag,
  User,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { Complaint } from "../../models/complaint";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Staff } from "../../models/staff";
import ProgressTracker from "../../components/ProgressTracker";

// Status step mapping for progress tracker
export const statusSteps: Record<string, number> = {
  pending: 0,
  "in progress": 1,
  resolved: 2,
  rejected: -1,
  "on hold": 0.5,
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

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

export const AdminStaffComplaintDetailView = ({
  selectedComplaint,
  toggleDetailsPanel,
  openAssignDialog,
  openResponseDialog,
}: {
  selectedComplaint: Complaint;
  toggleDetailsPanel: () => void;
  openAssignDialog: () => void;
  openResponseDialog: () => void;
}) => {
  const userInfo: Staff = JSON.parse(localStorage.getItem("user") || "{}") || {
    fullname: "Student User",
  };

  if (!selectedComplaint) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-gray-500">
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
    // selectedComplaint.complaintAssignment?.status?.toLowerCase() ||
    selectedComplaint.status.toLowerCase();
  const priorityId = selectedComplaint.priorityId;

  return (
    <div className="flex flex-col gap-6 w-full overflow-y-auto max-h-[calc(100vh-105px)] pb-6">
      {/* Action buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#1e293b]">Complaint Details</h2>
        <div className="flex gap-2">
          <button
            onClick={toggleDetailsPanel}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
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
                  onClick={openAssignDialog}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Assign to Staff
                </button>
                <button
                  onClick={openResponseDialog}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {/* <MessageSquare className="h-4 w-4 mr-2" />  */}
                  Respond
                </button>
                <div className="border-t border-gray-100"></div>
                <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  <X className="h-4 w-4 mr-2" />
                  Delete Complaint
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header with Title and ID */}
      <div className="border-b pb-4">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-[#1e293b]">
            {selectedComplaint.title}
          </h2>
          <div className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
            ID: {selectedComplaint.id?.substring(0, 8)}
          </div>
        </div>

        <div className="flex items-center mt-2 text-gray-500 text-sm">
          <Calendar className="h-4 w-4 mr-1" />
          <span>
            Submitted on{" "}
            {formatDate(selectedComplaint.createdAt.toDateString())} at{" "}
            {formatTime(selectedComplaint.createdAt.toDateString())}
          </span>
        </div>
      </div>

      {/* Progress Tracker */}
      <ProgressTracker
        status={status}
        response={selectedComplaint.complaintAssignment?.response ?? "Empty"}
      />

      {/* Status and Priority */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
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
            {status === "rejected" && <XCircle className="h-5 w-5 mr-1.5" />}
            {status === "on hold" && <AlertCircle className="h-5 w-5 mr-1.5" />}
            <span className="ml-1.5">{capitalizeFirstLetter(status)}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Priority</h3>
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
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          Student Information
        </h3>
        <div className="flex items-center">
          <User className="h-5 w-5 text-[#4f46e5] mr-2" />
          <span className="text-[#1e293b] font-medium">
            Student ID: {selectedComplaint.studentId}
          </span>
        </div>
      </div>

      {/* Category */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-[#4f46e5] mr-2" />
          <span className="text-[#1e293b] font-medium">
            {capitalizeFirstLetter(
              selectedComplaint.category?.name || "General"
            )}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
        <p className="text-[#1e293b] whitespace-pre-line">
          {selectedComplaint.description}
        </p>
      </div>

      {/* Follow Up Response */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          Follow-up Notes
        </h3>
        <p className="text-[#1e293b] whitespace-pre-line">
          {selectedComplaint.complaintAssignment?.internalNotes}
        </p>
      </div>

      {/* Attachment if exists */}
      {selectedComplaint.fileUrl && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Attachment</h3>
          <div className="mt-2 relative group">
            <img
              src={selectedComplaint.fileUrl || "/placeholder.svg"}
              alt="Complaint attachment"
              className="w-full h-auto max-h-64 object-contain rounded-md border border-gray-200"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
              <a
                href={selectedComplaint.fileUrl}
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
      {selectedComplaint.complaintAssignment && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            Assignment Details
          </h3>

          <div className="flex items-center mb-3">
            <User className="h-5 w-5 text-[#4f46e5] mr-2" />
            <div>
              <span className="text-sm text-gray-500">Assigned To:</span>
              <span className="ml-2 font-medium text-[#1e293b]">
                {selectedComplaint.complaintAssignment.staff.fullname}
              </span>
            </div>
          </div>

          {selectedComplaint.complaintAssignment.assignedAt && (
            <div className="flex items-center mb-3">
              <Calendar className="h-5 w-5 text-[#4f46e5] mr-2" />
              <div>
                <span className="text-sm text-gray-500">Assigned On:</span>
                <span className="ml-2 text-[#1e293b]">
                  {formatDate(
                    selectedComplaint.complaintAssignment.assignedAt.toDateString()
                  )}
                </span>
              </div>
            </div>
          )}

          {selectedComplaint.complaintAssignment.response && (
            <div className="mt-3 border-t border-gray-200 pt-3">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Staff Response:
              </h4>
              <div className="bg-white p-3 rounded border border-gray-200 text-[#1e293b]">
                {selectedComplaint.complaintAssignment.response}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Timeline/History */}
      <div className="bg-gray-50 p-4 rounded-lg">
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
                {formatDate(selectedComplaint.createdAt.toDateString())} at{" "}
                {formatTime(selectedComplaint.createdAt.toDateString())}
              </div>
            </div>
          </div>

          {selectedComplaint.complaintAssignment && (
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
                  {formatDate(
                    selectedComplaint.complaintAssignment.assignedAt.toDateString()
                  ) || "Date not available"}
                </div>
                <div className="text-sm mt-1">
                  Assigned to{" "}
                  {selectedComplaint.complaintAssignment.staff.fullname}
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
                  {selectedComplaint.complaintAssignment?.updatedAt
                    ? formatDate(
                        selectedComplaint.complaintAssignment.updatedAt.toDateString()
                      )
                    : "Date not available"}
                </div>
                <div className="text-sm mt-1">Complaint is being processed</div>
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
                  {selectedComplaint.complaintAssignment?.updatedAt
                    ? formatDate(
                        selectedComplaint.complaintAssignment.updatedAt.toDateString()
                      )
                    : "Date not available"}
                </div>
                {selectedComplaint.complaintAssignment?.response && (
                  <div className="text-sm mt-1 text-gray-600">
                    {selectedComplaint.complaintAssignment.response}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Staff Actions */}
      <div className="mt-2 flex flex-col gap-3">
        <h3 className="text-sm font-medium text-gray-500">Staff Actions</h3>
        <div className="flex gap-3">
          {userInfo.role.id < 4 ? (
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg ${
                status === "resolved" || status === "rejected"
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#4f46e5] text-white hover:bg-[#4338ca]"
              } transition-colors`}
              onClick={openAssignDialog}
              disabled={status === "resolved" || status === "rejected"}
            >
              <Users className="h-5 w-5" />
              {selectedComplaint.complaintAssignment ? "Reassign" : "Assign"}
            </button>
          ) : null}
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg ${
              status === "resolved" || status === "rejected"
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#4f46e5] text-white hover:bg-[#4338ca]"
            } transition-colors`}
            onClick={openResponseDialog}
            disabled={status === "resolved" || status === "rejected"}
          >
            <MessageSquare className="h-5 w-5" />
            Respond
          </button>
        </div>
      </div>
    </div>
  );
};
