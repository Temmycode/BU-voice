"use client";

import { Filter, Search, XIcon, PenSquare } from "lucide-react";
import { complaintStatus } from "../../constants/constants";
import { Dialog, Popover, Slide, Typography } from "@mui/material";
import React, { useState, useEffect, Fragment } from "react";
import { useComplaintClientStore } from "../../clients/complaintClientStore";
import NewComplaintScreen from "./NewComplaintScreen";
import type { TransitionProps } from "@mui/material/transitions";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ClipLoader } from "react-spinners";
import type { Complaint } from "../../models/complaint";
import { ComplaintTile } from "../components/ComplaintTile";
import ComplaintDetailView from "../../components/ComplaintDetailsView";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function StudentDashboard() {
  const complaintStore = useComplaintClientStore();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    complaintStore.getStudentsComplaints();
    complaintStore.setFilter(complaintStatus[0]);
  }, []);

  const handleDialogOpen = () => {
    complaintStore.setIsComplaintDialogOpen(true);
  };

  const handleDialogClose = () => {
    complaintStore.setIsComplaintDialogOpen(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function selectFilter(value: string) {
    complaintStore.setFilter(value);
    handleClose();
  }

  const filteredComplaints = complaintStore.complaints?.filter((complaint) => {
    if (searchQuery) {
      return (
        complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const NoDataFoundView = ({ text }: { text: string }) => {
    return (
      <div className="h-full w-full flex justify-center pt-12">
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
    <div className="h-screen flex flex-row">
      <section className="flex flex-col w-full md:w-3/5 lg:w-2/3 bg-off-white">
        {/* Fixed Header Section */}
        <div className="px-6 py-10">
          <div className="flex flex-row justify-between items-center font-lato mb-7.5">
            <span className="text-4xl font-medium">Complaints</span>
            <Fragment>
              <button
                onClick={handleDialogOpen}
                className="flex flex-row items-center gap-2.5 font-lato bg-primary-purple rounded-md h-11 px-4 text-white font-medium hover:bg-primary-purple/80 cursor-pointer transition-all"
              >
                <PenSquare />
                New Complaint
              </button>
              <Dialog
                fullScreen
                open={complaintStore.isComplaintDialogOpen}
                slots={{ transition: Transition }}
              >
                <div className="bg-off-white relative">
                  <button onClick={handleDialogClose}>
                    <XIcon
                      size={30}
                      className="absolute right-3 top-3 active:bg-gray-200 transition-colors p-1 rounded-full cursor-pointer"
                    />
                  </button>
                  <NewComplaintScreen />
                </div>
              </Dialog>
            </Fragment>
          </div>

          {/* Complaint number and search */}
          <div className="font-jaka font-semibold text-primary-black mb-5">
            <div className="flex flex-row items-center justify-between">
              <div>Complaints ({filteredComplaints?.length || 0})</div>
              <div className="flex flex-row justify-center items-center">
                <div className="relative">
                  {/* Search & Filter Button */}
                  <input
                    className="bg-white rounded-lg font-medium text-base placeholder-[#5F5F5F] font-lato border-1 border-gray-300 w-55.5 h-13 py-2 pl-12 pr-3"
                    placeholder="Search here"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-[#5F5F5F]" />
                </div>

                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  {/* Filter Button */}
                  <Typography
                    className="flex flex-col items-start gap-1"
                    fontFamily="lato"
                    sx={{ p: 2 }}
                  >
                    {complaintStatus.map((complaint) => (
                      <button
                        key={complaint}
                        onClick={() => selectFilter(complaint)}
                        className={`hover:text-primary-black cursor-pointer ${
                          complaintStore.filter === complaint
                            ? "text-primary-black"
                            : "text-tertiary-grey"
                        }`}
                      >
                        {complaint}
                      </button>
                    ))}
                  </Typography>
                </Popover>

                <button
                  aria-describedby={id}
                  onClick={handleClick}
                  className="flex flex-row justify-center items-center bg-[#ECECEC] h-13.5 rounded-md ml-7.5 w-26 cursor-pointer hover:opacity-80 transition-all"
                >
                  <Filter className="text-[#5F5F5F] mr-3" size={20} />
                  <div className="text-base font-medium text-[#5F5F5F]">
                    Filter
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Complaints List */}
        {complaintStore.loading ? (
          <div className="w-full h-screen flex items-center justify-center">
            <ClipLoader className="bg-primary-purple/10" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {filteredComplaints && filteredComplaints.length > 0 ? (
              filteredComplaints.map((complaint, index) => (
                <ComplaintTile
                  onClick={() => setSelectedComplaint(complaint)}
                  key={index}
                  complaint={complaint}
                  isSelected={selectedComplaint?.id === complaint.id}
                />
              ))
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
      <section className="hidden md:block md:w-2/5 lg:w-1/3 font-lato bg-off-white border-l-1 border-l-secondary-grey">
        <ComplaintDetailView complaint={selectedComplaint} />
      </section>
    </div>
  );
}
