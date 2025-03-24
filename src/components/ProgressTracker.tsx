import { motion } from "framer-motion";
import {
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  PauseCircle,
} from "lucide-react";

interface ProgressTrackerProps {
  status: string;
  response?: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  status,
  response,
}) => {
  const getProgressStep = (status: string): number => {
    switch (status.toLowerCase()) {
      case "pending":
        return 0;
      case "assigned":
        return 1;
      case "in progress":
        return 2;
      case "resolved":
        return 3;
      case "rejected":
        return -1;
      case "on hold":
        return 0.5;
      default:
        return 0;
    }
  };

  const currentStep = getProgressStep(status);

  if (status === "rejected") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
        <XCircle className="text-red-500 h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-red-700">Complaint Rejected</h4>
          <p className="text-sm text-red-600 mt-1">
            {response ||
              "Your complaint has been reviewed and cannot be processed further."}
          </p>
        </div>
      </div>
    );
  }

  if (status === "on hold") {
    return (
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start">
        <AlertCircle className="text-purple-500 h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-purple-700">Complaint On Hold</h4>
          <p className="text-sm text-purple-600 mt-1">
            {response ||
              "Your complaint is currently on hold. We'll update you when there's progress."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex justify-between mb-2">
        {/* Submitted Step */}
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
          <span className="text-xs mt-1 block font-medium">Submitted</span>
        </div>

        {/* Assigned Step */}
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
          <span className="text-xs mt-1 block font-medium">Assigned</span>
        </div>

        {/* In Progress Step */}
        <div className="text-center flex-1">
          <div
            className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
              currentStep >= 2
                ? "bg-[#4f46e5] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            <PauseCircle className="h-5 w-5" />
          </div>
          <span className="text-xs mt-1 block font-medium">In Progress</span>
        </div>

        {/* Resolved Step */}
        <div className="text-center flex-1">
          <div
            className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
              currentStep >= 3
                ? "bg-[#4f46e5] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            <CheckCircle className="h-5 w-5" />
          </div>
          <span className="text-xs mt-1 block font-medium">Resolved</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 absolute top-5 left-0 right-0 mx-10 bg-gray-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width:
              currentStep === 0
                ? "0%"
                : currentStep === 0.5
                ? "25%"
                : currentStep === 1
                ? "33%"
                : currentStep === 2
                ? "66%"
                : currentStep === 3
                ? "100%"
                : "0%",
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-[#4f46e5]"
        />
      </div>
    </div>
  );
};

export default ProgressTracker;
