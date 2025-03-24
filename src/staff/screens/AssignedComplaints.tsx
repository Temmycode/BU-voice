"use client";

import { Search, ArrowUpRight } from "lucide-react";
import { complaintStatus } from "../../constants/constants";
import { useState, useEffect } from "react";
import { useComplaintClientStore } from "../../clients/complaintClientStore";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ClipLoader } from "react-spinners";
import type { Complaint } from "../../models/complaint";
import {
  ComplaintGridItem,
  ComplaintTile,
} from "../components/StaffComplaintTile";
import { useSidebarStore } from "../../providers/SidebarProvider";
import AssignedComplaintDetailsView from "../components/AssignedComplaintDetailsView";

export default function AssignedComplaints() {
  const complaintStore = useComplaintClientStore();
  const { sidebarCollapsed } = useSidebarStore();
  // const [anchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  // const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    complaintStore.getStaffComplaints();
    complaintStore.setFilter(complaintStatus[0]);
  }, []);

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  const handleSelectComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailsPanelOpen(true);

    // On mobile, scroll to top when selecting a complaint
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleToggleDetailsPanel = () => {
    setIsDetailsPanelOpen(!isDetailsPanelOpen);
  };

  // function selectFilter(value: string) {
  //   complaintStore.setFilter(value);
  //   handleClose();
  // }

  const filteredComplaints = complaintStore.staffComplaints?.filter(
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

      return matchesSearch && matchesTab;
    }
  );

  // const open = Boolean(anchorEl);
  // const id = open ? "simple-popover" : undefined;

  const NoDataFoundView = ({ text }: { text: string }) => {
    return (
      <div className="h-100 w-100 flex justify-center mt-12">
        <div className="w-96 h-96">
          <DotLottieReact
            src="https://lottie.host/ece06929-d241-408f-a8fd-87aa76e59d2b/SFj2TiNa27.lottie"
            loop={true}
            autoplay
            className="w-full h-full object-contain"
          />
          <div className="text-center mt-3 font-jaka font-semibold text-xl">
            {text}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`h-screen flex flex-row`}>
      {/* Complaints list panel */}
      <section
        className={`${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        } transition-all duration-300 bg-off-white overflow-y-auto  ${
          isDetailsPanelOpen ? "md:w-3/5 lg:w-2/3" : "w-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6 mx-6">
          <div className="relative flex-1 max-w-md mt-6">
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

        <div className="mx-6 w-full flex justify-between items-center mb-6">
          <div className="flex w-full overflow-x-auto pb-2 px-2 justify-center">
            {[
              "all",
              "pending",
              "assigned",
              "in progress",
              "resolved",
              "rejected",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md mx-1 whitespace-nowrap transition 
          ${
            activeTab === tab
              ? "bg-[#4f46e5] text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Complaints List */}
        {complaintStore.loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <ClipLoader className="bg-primary-purple/10" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {complaintStore && filteredComplaints.length > 0 ? (
              viewMode === "grid" ? (
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
              ) : (
                filteredComplaints.map((complaint, index) => (
                  <ComplaintTile
                    onClick={() => handleSelectComplaint(complaint)}
                    key={index}
                    complaint={complaint}
                    isSelected={selectedComplaint?.id === complaint.id}
                  />
                ))
              )
            ) : (
              <div className="h-full w-full flex justify-center pt-12">
                <NoDataFoundView
                  text={
                    searchQuery
                      ? "No matching complaints found"
                      : "No Complaints Found!"
                  }
                />
              </div>
            )}
          </div>
        )}
      </section>

      {/* Complaint Selection Section */}
      {isDetailsPanelOpen && (
        <section className="hidden md:block md:w-2/5 lg:w-1/3 h-screen font-lato bg-off-white border-l-1 border-l-secondary-grey overflow-hidden">
          <AssignedComplaintDetailsView
            complaint={selectedComplaint}
            onClose={handleToggleDetailsPanel}
          />
        </section>
      )}

      {/* Mobile Complaint Detail Dialog */}
      {selectedComplaint !== null && isDetailsPanelOpen && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto md:hidden">
          <AssignedComplaintDetailsView
            complaint={selectedComplaint}
            onClose={() => setIsDetailsPanelOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
