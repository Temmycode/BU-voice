import { Filter, Search, XIcon, PenSquare } from "lucide-react";
import { complaintStatus } from "../../constants/constants";
import { Dialog, Popover, Slide, Typography } from "@mui/material";
import React, { useState, useEffect, Fragment } from "react";
import { useComplaintClientStore } from "../../clients/complaintClientStore";
import NewComplaintScreen from "./NewComplaintScreen";
import { TransitionProps } from "@mui/material/transitions";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ClipLoader } from "react-spinners";
import { Complaint } from "../../models/complaint";
import { formatDate } from "../../utils/dateFormatter";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { ComplaintTile, ComplaintPriority, ComplaintStatus } from "../components/ComplaintTile";

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

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const NoDataFoundView = ({ text }: { text: string }) => {
    return (
      <div className="h-full w-full flex justify-center pt-12">
        <div className="w-96 h-96">
          {" "}
          {/* Fixed width and height container */}
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

  const ComplaintDetailView = () => {
    if (!selectedComplaint) {
      return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-gray-500">
          <span className="text-lg">Select a complaint to view details</span>
        </div>
      );
    }

    const status = selectedComplaint.complaintAssignment?.status;

    return (
      <div className="flex flex-col gap-6">
        {/* Title and Date */}
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-semibold text-primary-black">
            {selectedComplaint.title}
          </h2>
          <span className="text-sm text-gray-500">
            {formatDate(selectedComplaint.createdAt)}
          </span>
        </div>

        {/* Status and Priority */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500">Status</span>
            {status ? <ComplaintStatus status={status} /> : null}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500">Priority</span>
            <ComplaintPriority priority={selectedComplaint.priorityId!} />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-500">Description</span>
          <p className="text-primary-black">{selectedComplaint.description}</p>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-500">Category</span>
          <span className="text-primary-black">
            {capitalizeFirstLetter(selectedComplaint.category?.name || "")}
          </span>
        </div>

        {/* Attachment if exists */}
        {selectedComplaint.fileUrl ? (
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-500">Attachment</span>
            <img
              src={selectedComplaint.fileUrl}
              alt="Complaint attachment"
              className="w-full h-45 object-contain rounded-md shadow-lg"
            />
          </div>
        ) : (
          <div>
            <DotLottieReact
              src="https://lottie.host/86ad3b44-a532-4897-bcd3-0098f70f0d28/Au3JouTGv3.lottie"
              autoplay
            />
            <div className="text-center font-light font-">No Image</div>
          </div>
        )}

        {/* Assignment Details if assigned */}
        {selectedComplaint.complaintAssignment && (
          <div className="flex flex-col gap-2 mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-primary-black">
              Assignment Details
            </h3>
            <div className="flex flex-row items-center justify-between gap-1">
              <span className="text-sm text-gray-500">Assigned To:</span>
              <span className="text-lg font-bold text-primary-black">
                {selectedComplaint.complaintAssignment.staff.fullname}
                {/* this should be staff name */}
              </span>
            </div>
            {selectedComplaint.complaintAssignment.status && (
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-sm text-gray-500">Response</span>
                <p className="text-primary-black">
                  {selectedComplaint.complaintAssignment.id}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-row">
      <section className="flex flex-col w-full bg-off-white">
        {/* Fixed Header Section */}
        <div className="px-6 py-10">
          <div className="flex flex-row justify-between items-center font-lato mb-7.5">
            <span className="text-4xl font-medium">Complaints</span>
            <Fragment>
              <button
                onClick={handleDialogOpen}
                className="flex flex-row items-center gap-2.5 font-lato bg-primary-purple rounded-md h-11 px-4 text-white font-medium hover:bg-primary-purple/80 cursor-pointer"
              >
                <PenSquare />
                New Complaint
              </button>
              <Dialog
                // className="mt-18 mx-15"
                // style={{ borderRadius: 30 }}
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
          {/* <div className="font-lato flex flex-row justify-between bg-white w-full rounded-2xl py-5.5 px-7 mb-6">
          <div>
            <div className="text-sm font-normal text-primary-grey mb-1.5">
              Akisanya Temiloluwa
            </div>
            <div className="text-lg font-medium text-primary-black">
              Welcome to BU Voice where your voice is heard
            </div>
          </div>
          <div className="flex flex-row gap-2.5 justify-center items-center border-1 border-border-color rounded-2xl px-6 py-4 font-medium hover:bg-off-white cursor-pointer">
            <CirclePlus />
            Lodge a complaint
          </div>
        </div> */}

          {/* Complaint number and search */}
          <div className="font-jaka font-semibold text-primary-black mb-5">
            <div className="flex flex-row items-center justify-between">
              <div>Complaints ( {complaintStore.complaints?.length} )</div>
              <div className="flex flex-row justify-center items-center">
                <div className="relative">
                  {/* Search & Filter Button */}
                  <input
                    className="bg-white rounded-lg font-medium text-base placeholder-[#5F5F5F] font-lato border-1 border-gray-300 w-55.5 h-13 py-2 pl-12 pr-3"
                    placeholder="Search here"
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
                    className=" flex flex-col items-start gap-1"
                    fontFamily="lato"
                    sx={{ p: 2 }}
                  >
                    {complaintStatus.map((complaint) => (
                      <button
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
                  className="flex flex-row justify-center items-center bg-[#ECECEC] h-13.5 rounded-md ml-7.5 w-26 cursor-pointer hover:opacity-80"
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
          <div className="flex-1 overflow-y-auto px-6">
            {complaintStore.complaints?.length > 0 ? (
              complaintStore.complaints.map((complaint, index) => (
                <ComplaintTile
                  onClick={() => setSelectedComplaint(complaint)}
                  key={index}
                  complaint={complaint}
                />
              ))
            ) : (
              <div className="h-full w-full flex justify-center pt-12">
                <NoDataFoundView text={"No Complaints Found!"} />
              </div>
            )}
          </div>
        )}
      </section>

      {/* Complaint Selection Section */}
      <section className="font-lato bg-off-white border-l-1 border-l-secondary-grey px-10 py-10 ">
        <div className="text-3xl font-medium w-70 text-center mb-8">
          Complaint Details
        </div>
        <ComplaintDetailView />
      </section>
    </div>
  );
}
