import {
  AlertCircle,
  CheckCircle,
  Clock,
  PauseCircle,
  XCircle,
} from "lucide-react";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { formatDate, formatTime } from "../../utils/dateFormatter";
import { Complaint } from "../../models/complaint";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  "in progress": "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  "on hold": "bg-purple-100 text-purple-800",
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

export const NoDataFoundView = ({ text }: { text: string }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center py-12">
      <div className="w-64 h-64 relative">
        <img
          src="/placeholder.svg"
          alt="No data"
          className="w-64 h-64 opacity-50"
        />
      </div>
      <div className="text-center mt-3 font-medium text-xl text-gray-500">
        {text}
      </div>
    </div>
  );
};

export const ComplaintTile = ({
  complaint,
  isSelected,
  onClick,
}: {
  complaint: Complaint;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const formattedDate = formatDate(complaint.createdAt);
  const status =
    complaint.complaintAssignment?.status?.toLowerCase() ||
    complaint.status.toLowerCase();
  const time = formatTime(complaint.createdAt);

  // Truncate description to 100 characters
  const truncatedDescription =
    complaint.description.length > 100
      ? `${complaint.description.substring(0, 100)}...`
      : complaint.description;

  return (
    <div
      onClick={onClick}
      className={`w-full flex flex-col bg-white py-4 px-5 mb-4 rounded-xl shadow-sm cursor-pointer border-l-4 transition-all ${
        isSelected
          ? "border-l-[#4f46e5] bg-[#f8f9ff]"
          : "border-l-transparent hover:border-l-gray-200"
      }`}
    >
      <div className="w-full flex flex-row justify-between items-start mb-3">
        <h3 className="text-lg text-[#1e293b] font-semibold line-clamp-1">
          {complaint.title}
        </h3>
        <div className="text-sm text-gray-500 font-medium whitespace-nowrap ml-2">
          {formattedDate}
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-4 line-clamp-2">
        {truncatedDescription}
      </div>

      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-3">
          {/* Priority Badge */}
          <div
            className={`rounded-full ${
              priorityColors[complaint.priorityId!]
            } text-xs px-3 py-1 font-medium flex items-center`}
          >
            {complaint.priorityId! <= 2 && (
              <AlertCircle className="h-3 w-3 mr-1" />
            )}
            {priorityLabels[complaint.priorityId!]}
          </div>

          {/* Status Badge */}
          <div
            className={`rounded-full ${statusColors[status]} text-xs px-3 py-1 font-medium flex items-center`}
          >
            {status === "pending" && <Clock className="h-3 w-3 mr-1" />}
            {status === "in progress" && (
              <PauseCircle className="h-3 w-3 mr-1" />
            )}
            {status === "resolved" && <CheckCircle className="h-3 w-3 mr-1" />}
            {status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
            {status === "on hold" && <AlertCircle className="h-3 w-3 mr-1" />}
            <span className="ml-1">{capitalizeFirstLetter(status)}</span>
          </div>
        </div>

        {complaint.complaintAssignment?.staff ? (
          <div className="text-xs text-gray-500">
            Assigned to:{" "}
            <span className="font-medium">
              {complaint.complaintAssignment.staff.fullname}
            </span>
          </div>
        ) : (
          <div className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-1 rounded-full">
            Unassigned
          </div>
        )}
      </div>

      {/* Time indicator */}
      <div className="text-xs text-gray-400 mt-2">{time}</div>
    </div>
  );
};

export const ComplaintGridItem = ({
  complaint,
  isSelected,
  onClick,
}: {
  complaint: Complaint;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const formattedDate = formatDate(complaint.createdAt);
  const status =
    complaint.complaintAssignment?.status?.toLowerCase() ||
    complaint.status.toLowerCase();

  return (
    <div
      onClick={onClick}
      className={`bg-white p-4 rounded-xl shadow-sm cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-[#4f46e5] bg-[#f8f9ff]" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        {/* Status Badge */}
        <div
          className={`rounded-full ${statusColors[status]} text-xs px-3 py-1 font-medium flex items-center`}
        >
          {status === "pending" && <Clock className="h-3 w-3 mr-1" />}
          {status === "in progress" && <PauseCircle className="h-3 w-3 mr-1" />}
          {status === "resolved" && <CheckCircle className="h-3 w-3 mr-1" />}
          {status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
          {status === "on hold" && <AlertCircle className="h-3 w-3 mr-1" />}
          <span className="ml-1">{capitalizeFirstLetter(status)}</span>
        </div>

        {/* Priority Badge */}
        <div
          className={`rounded-full ${
            priorityColors[complaint.priorityId!]
          } text-xs px-3 py-1 font-medium flex items-center`}
        >
          {complaint.priorityId! <= 2 && (
            <AlertCircle className="h-3 w-3 mr-1" />
          )}
          {priorityLabels[complaint.priorityId!]}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-[#1e293b] line-clamp-1 mb-2">
        {complaint.title}
      </h3>

      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
        {complaint.description}
      </p>

      <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-2 border-t border-gray-100">
        <span>{formattedDate}</span>
        {complaint.complaintAssignment?.staff ? (
          <span>
            Assigned:{" "}
            <span className="font-medium">
              {complaint.complaintAssignment.staff.fullname}
            </span>
          </span>
        ) : (
          <div className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-1 rounded-full">
            Unassigned
          </div>
        )}
      </div>
    </div>
  );
};
