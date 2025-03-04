import {
  UserRound,
  Ticket,
  // Settings
} from "lucide-react";

// export const complaints = [
//   new Complaint(
//     1,
//     2,
//     new ComplaintCategory(1, "hall"),
//     3,
//     "Broken Ceiling",
//     "The ceiling in my room is broken",
//     null,
//     "pending",
//     new Date()
//   ),
//   new Complaint(
//     2,
//     2,
//     new ComplaintCategory(1, "hall"),
//     3,
//     "Broken door",
//     "The door in my room is broken",
//     null,
//     "pending",
//     new Date()
//   ),
//   new Complaint(
//     3,
//     2,
//     new ComplaintCategory(1, "hall"),
//     3,
//     "Leaking roof",
//     "The roof in my room is leaking and we will need experts to come and take a look at it",
//     null,
//     "pending",
//     new Date()
//   ),
//   new Complaint(
//     3,
//     2,
//     new ComplaintCategory(1, "hall"),
//     3,
//     "Leaking roof",
//     "The roof in my room is leaking and we will need experts to come and take a look at it",
//     null,
//     "pending",
//     new Date()
//   ),
//   new Complaint(
//     3,
//     2,
//     new ComplaintCategory(1, "hall"),
//     3,
//     "Leaking roof",
//     "The roof in my room is leaking and we will need experts to come and take a look at it",
//     null,
//     "pending",
//     new Date()
//   ),
// ];

export const menuItems = [
  {
    path: "/student",
    name: "Dashboard",
    icon: <Ticket className="w-6 h-6 " />,
  },
  {
    path: "/student/profile",
    name: "Profile",
    icon: <UserRound className="w-6 h-6" />,
  },
  // {
  //   path: "/student/settings",
  //   name: "Settings",
  //   icon: <Settings className="w-6 h-6" />,
  // },
];

export const complaintStatus = [
  "All",
  "Unassigned",
  "Assigned",
  "Resolved",
  "Escalated",
];
