import { motion } from "framer-motion";
import {
  Clock,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  XCircle,
  PauseCircle,
} from "lucide-react";
import { Complaint } from "../../models/complaint";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { formatDate } from "../../utils/dateFormatter";

// Status icons mapping
const statusIcons = {
  pending: <Clock className="h-4 w-4" />,
  "in progress": <PauseCircle className="h-4 w-4" />,
  resolved: <CheckCircle className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />,
  "on hold": <AlertCircle className="h-4 w-4" />,
  assigned: <MessageSquare className="h-4 w-4" />,
};

export function ComplaintTile({
  complaint,
  onClick,
  isSelected = false,
}: {
  complaint: Complaint;
  onClick: () => void;
  isSelected?: boolean;
}) {
  const formattedDate = formatDate(complaint.createdAt);
  const status =
    complaint.complaintAssignment?.status?.toLowerCase() || "pending";

  // Format time manually without using formatTime
  const time = complaint.createdAt
    ? new Date(complaint.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  // Truncate description to 100 characters
  const truncatedDescription =
    complaint.description.length > 100
      ? `${complaint.description.substring(0, 100)}...`
      : complaint.description;

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`font-lato w-full flex flex-col bg-white py-4 px-5 mb-4 rounded-xl shadow-sm cursor-pointer border-l-4 ${
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
          <ComplaintPriority priority={complaint.priorityId!} />
          {status ? <ComplaintStatus status={status} /> : null}
        </div>

        {complaint.complaintAssignment?.staff && (
          <div className="text-xs text-gray-500">
            Assigned to:{" "}
            <span className="font-medium">
              {complaint.complaintAssignment.staff.fullname}
            </span>
          </div>
        )}
      </div>

      {/* Time indicator */}
      <div className="text-xs text-gray-400 mt-2">{time}</div>
    </motion.div>
  );
}

export function ComplaintPriority({ priority }: { priority: number }) {
  let title;
  let bgColor;
  let textColor;

  switch (priority) {
    case 1:
      title = "Critical";
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      break;

    case 2:
      title = "High";
      bgColor = "bg-orange-100";
      textColor = "text-orange-800";
      break;

    case 3:
      title = "Medium";
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      break;

    case 4:
      title = "Low";
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      break;

    default:
      title = "Low";
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
  }

  return (
    <div
      className={`rounded-full ${bgColor} ${textColor} text-xs px-3 py-1 font-medium flex items-center`}
    >
      {priority <= 2 && <AlertCircle className="h-3 w-3 mr-1" />}
      {title}
    </div>
  );
}

export const ComplaintStatus = ({ status }: { status: string }) => {
  const normalizedStatus = status.toLowerCase();
  let bgColor;
  let textColor;

  switch (normalizedStatus) {
    case "pending":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      break;
    case "in progress":
    case "assigned":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      break;
    case "resolved":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      break;
    case "rejected":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      break;
    case "on hold":
      bgColor = "bg-purple-100";
      textColor = "text-purple-800";
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
  }

  const icon = statusIcons[normalizedStatus] || statusIcons["pending"];

  return (
    <div
      className={`rounded-full ${bgColor} ${textColor} text-xs px-3 py-1 font-medium flex items-center`}
    >
      {icon}
      <span className="ml-1">{capitalizeFirstLetter(status)}</span>
    </div>
  );
};
