"use client";

import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { Menu, Search, Filter, ArrowUpRight, ChevronLeft } from "lucide-react";
import { useSidebarStore } from "../../providers/SidebarProvider";
import { useComplaintClientStore } from "../../clients/complaintClientStore";
import {
  ComplaintGridItem,
  ComplaintTile,
  NoDataFoundView,
} from "../components/StaffComplaintTile";
import { Complaint } from "../../models/complaint";
import { getInitials } from "../../utils/dateFormatter";
import { Staff } from "../../models/staff";
import { AdminStaffComplaintDetailView } from "../components/AdminStaffComplaintDetailView";

interface Category {
  id: number;
  name: string;
}

interface StaffMember {
  id: number;
  name: string;
  department: string;
}

// Mock data
const mockCategories: Category[] = [
  { id: 1, name: "Academic" },
  { id: 2, name: "Facilities" },
  { id: 3, name: "Administrative" },
  { id: 4, name: "Financial" },
  { id: 5, name: "Other" },
];

const mockStaffMembers: StaffMember[] = [
  { id: 1, name: "John Doe", department: "IT Support" },
  { id: 2, name: "Jane Smith", department: "Academic Affairs" },
  { id: 3, name: "Michael Johnson", department: "Facilities" },
  { id: 4, name: "Sarah Williams", department: "Student Services" },
];

// Dashboard stats
const dashboardStats = {
  totalComplaints: 124,
  pendingComplaints: 45,
  resolvedComplaints: 68,
  rejectedComplaints: 11,
  averageResponseTime: "1.5 days",
  resolutionRate: 78,
};

export default function StaffDashboard() {
  // const navigate = useNavigate();
  const complaintStore = useComplaintClientStore();
  const sidebarStore = useSidebarStore();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [responseText, setResponseText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [assignedStaff, setAssignedStaff] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const userInfo: Staff = JSON.parse(localStorage.getItem("user") || "{}") || {
    fullname: "Staff User",
  };

  // Filter complaints based on search query and active tab
  const filteredComplaints = complaintStore.allComplaints.filter(
    (complaint) => {
      // Search filter
      const matchesSearch = searchQuery
        ? complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          complaint.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true;

      // Tab filter
      let matchesTab = true;
      if (activeTab !== "all") {
        const status = complaint.status.toLowerCase();
        matchesTab = activeTab === status;
      }

      // Priority filter
      const matchesPriority = selectedPriority
        ? complaint.priorityId === Number.parseInt(selectedPriority)
        : true;

      // Category filter
      const matchesCategory = selectedCategory
        ? complaint.category?.id === Number.parseInt(selectedCategory)
        : true;

      // Date range filter
      let matchesDateRange = true;
      if (dateRange.start && dateRange.end) {
        const complaintDate = new Date(complaint.createdAt);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        matchesDateRange =
          complaintDate >= startDate && complaintDate <= endDate;
      }

      return (
        matchesSearch &&
        matchesTab &&
        matchesPriority &&
        matchesCategory &&
        matchesDateRange
      );
    }
  );

  const handleToggleMobileMenu = () => {
    sidebarStore.setMobileMenuOpen(!sidebarStore.mobileMenuOpen);
  };

  const handleToggleDetailsPanel = () => {
    sidebarStore.setIsDetailsPanelOpen(!sidebarStore.isDetailsPanelOpen);
  };

  const handleOpenAssignDialog = () => {
    sidebarStore.setIsAssignDialogOpen(true);
  };

  const handleCloseAssignDialog = () => {
    sidebarStore.setIsAssignDialogOpen(false);
  };

  const handleOpenResponseDialog = () => {
    sidebarStore.setIsResponseDialogOpen(true);
  };

  const handleCloseResponseDialog = () => {
    sidebarStore.setIsResponseDialogOpen(false);
  };

  const handleSelectComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    sidebarStore.setIsDetailsPanelOpen(true);

    // On mobile, scroll to top when selecting a complaint
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleToggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleClearFilters = () => {
    setSelectedPriority(null);
    setSelectedCategory(null);
    setDateRange({ start: "", end: "" });
  };

  const handleApplyFilters = () => {
    // Apply filters logic here
    setIsFilterOpen(false);
  };

  // Fetch complaints
  useEffect(() => {
    complaintStore.getAllComplaints();
  }, []);

  // Components

  const DashboardOverview = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-2">
            Total Complaints
          </div>
          <div className="text-2xl font-bold">
            {complaintStore.allComplaints.length}
          </div>
          <p className="text-xs text-gray-500 mt-1">All time</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-2">
            Pending Complaints
          </div>
          <div className="text-2xl font-bold">
            {
              complaintStore.allComplaints.filter(
                (complaint) => complaint.status == "pending"
              ).length
            }
          </div>
          <p className="text-xs text-gray-500 mt-1">Awaiting action</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-2">
            Resolution Rate
          </div>
          <div className="text-2xl font-bold">
            {dashboardStats.resolutionRate}%
          </div>
          <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-[#4f46e5] rounded-full"
              style={{ width: `${dashboardStats.resolutionRate}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  // const ComplaintDetailView = () => {
  //   if (!selectedComplaint) {
  //     return (
  //       <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-gray-500">
  //         <div className="text-center">
  //           <div className="w-64 h-64 relative mx-auto">
  //             <img
  //               src="/placeholder.svg"
  //               alt="Select a complaint"
  //               className="w-64 h-64 opacity-50"
  //             />
  //           </div>
  //           <span className="text-lg font-medium block mt-4">
  //             Select a complaint to view details
  //           </span>
  //           <p className="text-sm text-gray-400 mt-2">
  //             Click on any complaint from the list to see more information
  //           </p>
  //         </div>
  //       </div>
  //     );
  //   }

  //   const status =
  //     selectedComplaint.complaintAssignment?.status?.toLowerCase() ||
  //     selectedComplaint.status.toLowerCase();
  //   const currentStep = statusSteps[status];
  //   const priorityId = selectedComplaint.priorityId;

  //   return (
  //     <div className="flex flex-col gap-6 w-full overflow-y-auto max-h-[calc(100vh-200px)] pb-6">
  //       {/* Action buttons */}
  //       <div className="flex justify-between items-center">
  //         <h2 className="text-xl font-bold text-[#1e293b]">
  //           Complaint Details
  //         </h2>
  //         <div className="flex gap-2">
  //           <button
  //             onClick={handleToggleDetailsPanel}
  //             className="md:hidden p-2 rounded-md hover:bg-gray-100"
  //           >
  //             <ChevronRight className="h-4 w-4" />
  //           </button>
  //           <div className="relative group">
  //             <button className="p-2 rounded-md hover:bg-gray-100">
  //               <MoreHorizontal className="h-4 w-4" />
  //             </button>
  //             <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
  //               <div className="py-1">
  //                 <div className="px-4 py-2 text-xs font-semibold text-gray-500">
  //                   Actions
  //                 </div>
  //                 <div className="border-t border-gray-100"></div>
  //                 <button
  //                   onClick={handleOpenAssignDialog}
  //                   className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
  //                 >
  //                   <Users className="h-4 w-4 mr-2" />
  //                   Assign to Staff
  //                 </button>
  //                 <button
  //                   onClick={handleOpenResponseDialog}
  //                   className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
  //                 >
  //                   {/* <MessageSquare className="h-4 w-4 mr-2" />  */}
  //                   Respond
  //                 </button>
  //                 <div className="border-t border-gray-100"></div>
  //                 <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
  //                   <X className="h-4 w-4 mr-2" />
  //                   Delete Complaint
  //                 </button>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Header with Title and ID */}
  //       <div className="border-b pb-4">
  //         <div className="flex justify-between items-start">
  //           <h2 className="text-2xl font-bold text-[#1e293b]">
  //             {selectedComplaint.title}
  //           </h2>
  //           <div className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
  //             ID: {selectedComplaint.id?.substring(0, 8)}
  //           </div>
  //         </div>

  //         <div className="flex items-center mt-2 text-gray-500 text-sm">
  //           <Calendar className="h-4 w-4 mr-1" />
  //           <span>
  //             Submitted on{" "}
  //             {formatDate(selectedComplaint.createdAt.toDateString())} at{" "}
  //             {formatTime(selectedComplaint.createdAt.toDateString())}
  //           </span>
  //         </div>
  //       </div>

  //       {/* Progress Tracker */}
  //       <div className="mb-4">
  //         <h3 className="text-sm font-medium text-gray-500 mb-3">
  //           Complaint Progress
  //         </h3>

  //         {status === "rejected" ? (
  //           <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
  //             <XCircle className="text-red-500 h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
  //             <div>
  //               <h4 className="font-medium text-red-700">Complaint Rejected</h4>
  //               <p className="text-sm text-red-600 mt-1">
  //                 {selectedComplaint.complaintAssignment?.response ||
  //                   "This complaint has been reviewed and cannot be processed further."}
  //               </p>
  //             </div>
  //           </div>
  //         ) : status === "on hold" ? (
  //           <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start">
  //             <AlertCircle className="text-purple-500 h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
  //             <div>
  //               <h4 className="font-medium text-purple-700">
  //                 Complaint On Hold
  //               </h4>
  //               <p className="text-sm text-purple-600 mt-1">
  //                 {selectedComplaint.complaintAssignment?.response ||
  //                   "This complaint is currently on hold. We'll update when there's progress."}
  //               </p>
  //             </div>
  //           </div>
  //         ) : (
  //           <div className="relative">
  //             <div className="flex justify-between mb-2">
  //               <div className="text-center flex-1">
  //                 <div
  //                   className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
  //                     currentStep >= 0
  //                       ? "bg-[#4f46e5] text-white"
  //                       : "bg-gray-200 text-gray-500"
  //                   }`}
  //                 >
  //                   <Clock className="h-5 w-5" />
  //                 </div>
  //                 <span className="text-xs mt-1 block font-medium">
  //                   Submitted
  //                 </span>
  //               </div>
  //               <div className="text-center flex-1">
  //                 <div
  //                   className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
  //                     currentStep >= 1
  //                       ? "bg-[#4f46e5] text-white"
  //                       : "bg-gray-200 text-gray-500"
  //                   }`}
  //                 >
  //                   <MessageSquare className="h-5 w-5" />
  //                 </div>
  //                 <span className="text-xs mt-1 block font-medium">
  //                   In Progress
  //                 </span>
  //               </div>
  //               <div className="text-center flex-1">
  //                 <div
  //                   className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
  //                     currentStep >= 2
  //                       ? "bg-[#4f46e5] text-white"
  //                       : "bg-gray-200 text-gray-500"
  //                   }`}
  //                 >
  //                   <CheckCircle className="h-5 w-5" />
  //                 </div>
  //                 <span className="text-xs mt-1 block font-medium">
  //                   Resolved
  //                 </span>
  //               </div>
  //             </div>

  //             {/* Progress bar */}
  //             <div className="h-1 absolute top-5 left-0 right-0 mx-10 bg-gray-200">
  //               <div
  //                 className="h-full bg-[#4f46e5] transition-all duration-500"
  //                 style={{
  //                   width:
  //                     currentStep === 0
  //                       ? "0%"
  //                       : currentStep === 0.5
  //                       ? "25%"
  //                       : currentStep === 1
  //                       ? "50%"
  //                       : currentStep === 2
  //                       ? "100%"
  //                       : "0%",
  //                 }}
  //               ></div>
  //             </div>
  //           </div>
  //         )}
  //       </div>

  //       {/* Status and Priority */}
  //       <div className="grid grid-cols-2 gap-4">
  //         <div className="bg-gray-50 p-4 rounded-lg">
  //           <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
  //           <div
  //             className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
  //               status === "pending"
  //                 ? "bg-yellow-500"
  //                 : status === "in progress"
  //                 ? "bg-blue-500"
  //                 : status === "resolved"
  //                 ? "bg-green-500"
  //                 : status === "rejected"
  //                 ? "bg-red-500"
  //                 : "bg-purple-500"
  //             } text-white`}
  //           >
  //             {status === "pending" && <Clock className="h-5 w-5 mr-1.5" />}
  //             {status === "in progress" && (
  //               <PauseCircle className="h-5 w-5 mr-1.5" />
  //             )}
  //             {status === "resolved" && (
  //               <CheckCircle className="h-5 w-5 mr-1.5" />
  //             )}
  //             {status === "rejected" && <XCircle className="h-5 w-5 mr-1.5" />}
  //             {status === "on hold" && (
  //               <AlertCircle className="h-5 w-5 mr-1.5" />
  //             )}
  //             <span className="ml-1.5">{capitalizeFirstLetter(status)}</span>
  //           </div>
  //         </div>

  //         <div className="bg-gray-50 p-4 rounded-lg">
  //           <h3 className="text-sm font-medium text-gray-500 mb-2">Priority</h3>
  //           <div
  //             className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
  //               priorityColors[priorityId!]
  //             }`}
  //           >
  //             {priorityId! <= 2 ? (
  //               <AlertCircle className="h-4 w-4 mr-1" />
  //             ) : (
  //               <Tag className="h-4 w-4 mr-1" />
  //             )}
  //             {priorityLabels[priorityId!]}
  //           </div>
  //         </div>
  //       </div>

  //       {/* Student Information */}
  //       <div className="bg-gray-50 p-4 rounded-lg">
  //         <h3 className="text-sm font-medium text-gray-500 mb-2">
  //           Student Information
  //         </h3>
  //         <div className="flex items-center">
  //           <User className="h-5 w-5 text-[#4f46e5] mr-2" />
  //           <span className="text-[#1e293b] font-medium">
  //             Student ID: {selectedComplaint.studentId}
  //           </span>
  //         </div>
  //       </div>

  //       {/* Category */}
  //       <div className="bg-gray-50 p-4 rounded-lg">
  //         <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
  //         <div className="flex items-center">
  //           <FileText className="h-5 w-5 text-[#4f46e5] mr-2" />
  //           <span className="text-[#1e293b] font-medium">
  //             {capitalizeFirstLetter(
  //               selectedComplaint.category?.name || "General"
  //             )}
  //           </span>
  //         </div>
  //       </div>

  //       {/* Description */}
  //       <div className="bg-gray-50 p-4 rounded-lg">
  //         <h3 className="text-sm font-medium text-gray-500 mb-2">
  //           Description
  //         </h3>
  //         <p className="text-[#1e293b] whitespace-pre-line">
  //           {selectedComplaint.description}
  //         </p>
  //       </div>

  //       {/* Attachment if exists */}
  //       {selectedComplaint.fileUrl && (
  //         <div className="bg-gray-50 p-4 rounded-lg">
  //           <h3 className="text-sm font-medium text-gray-500 mb-2">
  //             Attachment
  //           </h3>
  //           <div className="mt-2 relative group">
  //             <img
  //               src={selectedComplaint.fileUrl || "/placeholder.svg"}
  //               alt="Complaint attachment"
  //               className="w-full h-auto max-h-64 object-contain rounded-md border border-gray-200"
  //             />
  //             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
  //               <a
  //                 href={selectedComplaint.fileUrl}
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //                 download
  //                 className="bg-white rounded-full p-2 shadow-lg"
  //               >
  //                 <Download className="h-5 w-5 text-[#4f46e5]" />
  //               </a>
  //             </div>
  //           </div>
  //         </div>
  //       )}

  //       {/* Assignment Details if assigned */}
  //       {selectedComplaint.complaintAssignment && (
  //         <div className="bg-gray-50 p-4 rounded-lg">
  //           <h3 className="text-sm font-medium text-gray-500 mb-3">
  //             Assignment Details
  //           </h3>

  //           <div className="flex items-center mb-3">
  //             <User className="h-5 w-5 text-[#4f46e5] mr-2" />
  //             <div>
  //               <span className="text-sm text-gray-500">Assigned To:</span>
  //               <span className="ml-2 font-medium text-[#1e293b]">
  //                 {selectedComplaint.complaintAssignment.staff.fullname}
  //               </span>
  //             </div>
  //           </div>

  //           {selectedComplaint.complaintAssignment.assignedAt && (
  //             <div className="flex items-center mb-3">
  //               <Calendar className="h-5 w-5 text-[#4f46e5] mr-2" />
  //               <div>
  //                 <span className="text-sm text-gray-500">Assigned On:</span>
  //                 <span className="ml-2 text-[#1e293b]">
  //                   {formatDate(
  //                     selectedComplaint.complaintAssignment.assignedAt.toDateString()
  //                   )}
  //                 </span>
  //               </div>
  //             </div>
  //           )}

  //           {selectedComplaint.complaintAssignment.response && (
  //             <div className="mt-3 border-t border-gray-200 pt-3">
  //               <h4 className="text-sm font-medium text-gray-500 mb-2">
  //                 Staff Response:
  //               </h4>
  //               <div className="bg-white p-3 rounded border border-gray-200 text-[#1e293b]">
  //                 {selectedComplaint.complaintAssignment.response}
  //               </div>
  //             </div>
  //           )}
  //         </div>
  //       )}

  //       {/* Timeline/History */}
  //       <div className="bg-gray-50 p-4 rounded-lg">
  //         <h3 className="text-sm font-medium text-gray-500 mb-3">
  //           Complaint Timeline
  //         </h3>

  //         <div className="space-y-4">
  //           <div className="flex">
  //             <div className="flex flex-col items-center mr-4">
  //               <div className="w-2.5 h-2.5 rounded-full bg-[#4f46e5] z-10"></div>
  //               <div className="h-full w-0.5 bg-gray-200"></div>
  //             </div>
  //             <div className="flex-1 pb-4">
  //               <div className="text-sm font-medium text-[#1e293b]">
  //                 Complaint Submitted
  //               </div>
  //               <div className="text-xs text-gray-500">
  //                 {formatDate(selectedComplaint.createdAt.toDateString())} at{" "}
  //                 {formatTime(selectedComplaint.createdAt.toDateString())}
  //               </div>
  //             </div>
  //           </div>

  //           {selectedComplaint.complaintAssignment && (
  //             <div className="flex">
  //               <div className="flex flex-col items-center mr-4">
  //                 <div className="w-2.5 h-2.5 rounded-full bg-[#4f46e5] z-10"></div>
  //                 <div className="h-full w-0.5 bg-gray-200"></div>
  //               </div>
  //               <div className="flex-1 pb-4">
  //                 <div className="text-sm font-medium text-[#1e293b]">
  //                   Assigned to Staff
  //                 </div>
  //                 <div className="text-xs text-gray-500">
  //                   {formatDate(
  //                     selectedComplaint.complaintAssignment.assignedAt.toDateString()
  //                   ) || "Date not available"}
  //                 </div>
  //                 <div className="text-sm mt-1">
  //                   Assigned to{" "}
  //                   {selectedComplaint.complaintAssignment.staff.fullname}
  //                 </div>
  //               </div>
  //             </div>
  //           )}

  //           {status === "in progress" && (
  //             <div className="flex">
  //               <div className="flex flex-col items-center mr-4">
  //                 <div className="w-2.5 h-2.5 rounded-full bg-[#4f46e5] z-10"></div>
  //                 <div className="h-full w-0.5 bg-gray-200"></div>
  //               </div>
  //               <div className="flex-1 pb-4">
  //                 <div className="text-sm font-medium text-[#1e293b]">
  //                   Processing Started
  //                 </div>
  //                 <div className="text-xs text-gray-500">
  //                   {selectedComplaint.complaintAssignment?.updatedAt
  //                     ? formatDate(
  //                         selectedComplaint.complaintAssignment.updatedAt.toDateString()
  //                       )
  //                     : "Date not available"}
  //                 </div>
  //                 <div className="text-sm mt-1">
  //                   Complaint is being processed
  //                 </div>
  //               </div>
  //             </div>
  //           )}

  //           {(status === "resolved" || status === "rejected") && (
  //             <div className="flex">
  //               <div className="flex flex-col items-center mr-4">
  //                 <div
  //                   className={`w-2.5 h-2.5 rounded-full ${
  //                     status === "resolved" ? "bg-green-500" : "bg-red-500"
  //                   } z-10`}
  //                 ></div>
  //                 <div className="h-full w-0.5 bg-transparent"></div>
  //               </div>
  //               <div className="flex-1">
  //                 <div className="text-sm font-medium text-[#1e293b]">
  //                   {status === "resolved"
  //                     ? "Complaint Resolved"
  //                     : "Complaint Rejected"}
  //                 </div>
  //                 <div className="text-xs text-gray-500">
  //                   {selectedComplaint.complaintAssignment?.updatedAt
  //                     ? formatDate(
  //                         selectedComplaint.complaintAssignment.updatedAt.toDateString()
  //                       )
  //                     : "Date not available"}
  //                 </div>
  //                 {selectedComplaint.complaintAssignment?.response && (
  //                   <div className="text-sm mt-1 text-gray-600">
  //                     {selectedComplaint.complaintAssignment.response}
  //                   </div>
  //                 )}
  //               </div>
  //             </div>
  //           )}
  //         </div>
  //       </div>

  //       {/* Staff Actions */}
  //       <div className="mt-2 flex flex-col gap-3">
  //         <h3 className="text-sm font-medium text-gray-500">Staff Actions</h3>
  //         <div className="flex gap-3">
  //           <button
  //             className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg ${
  //               status === "resolved" || status === "rejected"
  //                 ? "bg-gray-100 text-gray-400 cursor-not-allowed"
  //                 : "bg-[#4f46e5] text-white hover:bg-[#4338ca]"
  //             } transition-colors`}
  //             onClick={handleOpenAssignDialog}
  //             disabled={status === "resolved" || status === "rejected"}
  //           >
  //             <Users className="h-5 w-5" />
  //             {selectedComplaint.complaintAssignment ? "Reassign" : "Assign"}
  //           </button>
  //           <button
  //             className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg ${
  //               status === "resolved" || status === "rejected"
  //                 ? "bg-gray-100 text-gray-400 cursor-not-allowed"
  //                 : "bg-[#4f46e5] text-white hover:bg-[#4338ca]"
  //             } transition-colors`}
  //             onClick={handleOpenResponseDialog}
  //             disabled={status === "resolved" || status === "rejected"}
  //           >
  //             <MessageSquare className="h-5 w-5" />
  //             Respond
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      {/* Mobile menu overlay */}
      {sidebarStore.mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={handleToggleMobileMenu}
        ></div>
      )}

      {/* Main content */}
      <div
        className={`flex-1 ${
          sidebarStore.sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        } transition-all duration-300`}
      >
        {/* Header */}
        <header className="border-b bg-white p-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={handleToggleMobileMenu}
                className="mr-4 text-gray-500 md:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#1e293b]">
                  Staff Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Manage and respond to student complaints
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#4f46e5] flex items-center justify-center text-white font-medium">
                <span>{getInitials(userInfo.fullname)}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-0">
          <div className="flex flex-col md:flex-row h-full overflow-y-auto">
            {/* Complaints list panel */}
            <div
              className={`${
                sidebarStore.isDetailsPanelOpen
                  ? "w-full md:w-3/5 lg:w-2/3"
                  : "w-full"
              }`}
            >
              <div className="m-6">
                <DashboardOverview />
              </div>

              <div className="mx-6 flex justify-between items-center mb-6">
                <div className="flex overflow-x-auto pb-2 -mx-2 px-2">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                      activeTab === "all"
                        ? "bg-[#4f46e5] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab("pending")}
                    className={`px-4 py-2 text-sm font-medium rounded-md ml-2 whitespace-nowrap ${
                      activeTab === "pending"
                        ? "bg-[#4f46e5] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setActiveTab("in progress")}
                    className={`px-4 py-2 text-sm font-medium rounded-md ml-2 whitespace-nowrap ${
                      activeTab === "in progress"
                        ? "bg-[#4f46e5] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => setActiveTab("resolved")}
                    className={`px-4 py-2 text-sm font-medium rounded-md ml-2 whitespace-nowrap ${
                      activeTab === "resolved"
                        ? "bg-[#4f46e5] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Resolved
                  </button>
                  <button
                    onClick={() => setActiveTab("rejected")}
                    className={`px-4 py-2 text-sm font-medium rounded-md ml-2 whitespace-nowrap ${
                      activeTab === "rejected"
                        ? "bg-[#4f46e5] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Rejected
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 mx-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search complaints..."
                    className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleFilterPanel}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Filter className="h-4 w-4" />
                    Filter
                  </button>

                  <div className="relative group">
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50">
                      <ArrowUpRight className="h-4 w-4" />
                      Sort
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                      <div className="py-1">
                        <button className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                          Newest First
                        </button>
                        <button className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                          Oldest First
                        </button>
                        <button className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                          Priority (High to Low)
                        </button>
                        <button className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                          Priority (Low to High)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex border rounded-md overflow-hidden">
                    <button
                      className={`px-2 py-2 ${
                        viewMode === "list"
                          ? "bg-[#4f46e5] text-white"
                          : "bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                      onClick={() => setViewMode("list")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                      </svg>
                    </button>
                    <button
                      className={`px-2 py-2 ${
                        viewMode === "grid"
                          ? "bg-[#4f46e5] text-white"
                          : "bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                      onClick={() => setViewMode("grid")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter panel */}
              {isFilterOpen && (
                <div className="mb-6 overflow-hidden mx-6">
                  <div className="bg-white w-full overflow-x-auto p-4 rounded-lg border shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Advanced Filters</h3>
                      <button
                        onClick={handleClearFilters}
                        className="text-sm text-[#4f46e5] hover:underline"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Priority
                        </label>
                        <select
                          value={selectedPriority || ""}
                          onChange={(e) => setSelectedPriority(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]"
                        >
                          <option value="">Any Priority</option>
                          <option value="1">Critical</option>
                          <option value="2">High</option>
                          <option value="3">Medium</option>
                          <option value="4">Low</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Category
                        </label>
                        <select
                          value={selectedCategory || ""}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]"
                        >
                          <option value="">Any Category</option>
                          {mockCategories.map((category) => (
                            <option
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Date Range
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) =>
                              setDateRange({
                                ...dateRange,
                                start: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]"
                          />
                          <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) =>
                              setDateRange({
                                ...dateRange,
                                end: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={handleApplyFilters}
                        className="px-4 py-2 bg-[#4f46e5] text-white rounded-lg hover:bg-[#4338ca] transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Complaints list */}
              <div className="mx-6">
                {complaintStore.loading ? (
                  <div className="w-full h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4f46e5]"></div>
                  </div>
                ) : filteredComplaints.length > 0 ? (
                  viewMode === "list" ? (
                    filteredComplaints.map((complaint) => (
                      <ComplaintTile
                        onClick={() => handleSelectComplaint(complaint)}
                        key={complaint.id}
                        complaint={complaint}
                        isSelected={selectedComplaint?.id === complaint.id}
                      />
                    ))
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredComplaints.map((complaint) => (
                        <ComplaintGridItem
                          onClick={() => handleSelectComplaint(complaint)}
                          key={complaint.id}
                          complaint={complaint}
                          isSelected={selectedComplaint?.id === complaint.id}
                        />
                      ))}
                    </div>
                  )
                ) : (
                  <NoDataFoundView
                    text={
                      searchQuery
                        ? "No matching complaints found"
                        : "No complaints found"
                    }
                  />
                )}
              </div>
            </div>

            {/* Complaint details panel */}
            {sidebarStore.isDetailsPanelOpen && (
              <div className="hidden md:block md:w-2/5 lg:w-1/3 max-h-screen bg-white border-l pt-6 px-6 overflow-y-auto">
                <AdminStaffComplaintDetailView
                  selectedComplaint={selectedComplaint!}
                  toggleDetailsPanel={handleToggleDetailsPanel}
                  openAssignDialog={handleOpenAssignDialog}
                  openResponseDialog={handleOpenResponseDialog}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Assign Dialog */}
      {sidebarStore.isAssignDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Assign Complaint</h2>

            {selectedComplaint && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-sm text-gray-500">Complaint</h3>
                <p className="font-medium">{selectedComplaint.title}</p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Assign to Staff Member
              </label>
              <select
                value={assignedStaff}
                onChange={(e) => setAssignedStaff(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]"
              >
                <option value="">Select staff member</option>
                {mockStaffMembers.map((staff) => (
                  <option key={staff.id} value={staff.id.toString()}>
                    {staff.name} - {staff.department}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseAssignDialog}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                // onClick={handleAssignComplaint}
                disabled={!assignedStaff}
                className={`px-4 py-2 rounded-lg ${
                  !assignedStaff
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#4f46e5] text-white hover:bg-[#4338ca]"
                } transition-colors`}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Response Dialog */}
      {sidebarStore.isResponseDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Respond to Complaint</h2>

            {selectedComplaint && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-sm text-gray-500">Complaint</h3>
                <p className="font-medium">{selectedComplaint.title}</p>
              </div>
            )}

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
              >
                Cancel
              </button>
              <button
                // onClick={handleSubmitResponse}
                disabled={!selectedStatus || !responseText}
                className={`px-4 py-2 rounded-lg ${
                  !selectedStatus || !responseText
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#4f46e5] text-white hover:bg-[#4338ca]"
                } transition-colors`}
              >
                Submit Response
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Complaint Detail Dialog */}
      {selectedComplaint !== null && sidebarStore.isDetailsPanelOpen && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto md:hidden">
          <div className="p-4">
            <button
              onClick={() => sidebarStore.setIsDetailsPanelOpen(false)}
              className="mb-4 flex items-center gap-2 px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to List
            </button>
            <AdminStaffComplaintDetailView
              selectedComplaint={selectedComplaint}
              toggleDetailsPanel={handleToggleDetailsPanel}
              openAssignDialog={handleOpenAssignDialog}
              openResponseDialog={handleOpenResponseDialog}
            />
          </div>
        </div>
      )}
    </div>
  );
}
