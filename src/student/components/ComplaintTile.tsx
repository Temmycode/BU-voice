import { Complaint } from "../../models/complaint";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";
import { formatDate } from "../../utils/dateFormatter";

export function ComplaintTile({
  complaint,
  onClick,
}: {
  complaint: Complaint;
  onClick: () => void;
}) {
  const formattedDate = formatDate(complaint.createdAt);
  const status = complaint.complaintAssignment?.status;

  return (
    <div
      onClick={onClick}
      className="font-lato w-full flex flex-col bg-wxphite py-2.5 px-3.5 mb-7.5 rounded-[10px] shadow-md shadow-[#0000001a]"
    >
      <div className="h-13 w-full flex flex-row justify-between items-center px-2.5 py-3 mb-2.5">
        <div className="text-xl text-primary-black font-medium">
          {complaint.title}
        </div>
        <div className="text-base text-primary-black font-medium">
          {formattedDate}
        </div>
      </div>
      <div className="h-13 flex flex-row text-sm text-primary-black py-1.5 px-2.5 mb-2.5">
        <div>{complaint.description}</div>
      </div>
      <div className="flex flex-row px-2.5 py-4 gap-4">
        <ComplaintPriority priority={complaint.priorityId!} />
        {status ? <ComplaintStatus status={status} /> : null}
      </div>
    </div>
  );
}

export function ComplaintPriority({ priority }: { priority: number }) {
  let title;
  let primaryColor;
  let secondaryColor;
  let faintColor;

  switch (priority) {
    case 1:
      title = "Critical";
      primaryColor = "text-primary-red";
      secondaryColor = "border-secondary-red";
      faintColor = "bg-faint-red";
      break;

    case 2:
      title = "High";
      primaryColor = "text-primary-orange";
      secondaryColor = "border-secondary-orange/40";
      faintColor = "bg-faint-orange/40";
      break;

    case 3:
      title = "Medium";
      primaryColor = "text-primary-green";
      secondaryColor = "border-secondary-green";
      faintColor = "bg-faint-green";
      break;

    case 4:
      title = "Low";
      primaryColor = "text-primary-blue"; // You can use "text-primary-green" if you prefer
      secondaryColor = "border-secondary-blue";
      faintColor = "bg-faint-blue";
      break;

    default:
      title = "Low";
  }

  return (
    <div
      className={`rounded-full border ${secondaryColor} ${faintColor} ${primaryColor} text-sm items-center justify-center px-3 py-0.5 font-medium`}
    >
      {title}
    </div>
  );
}

export const ComplaintStatus = ({ status }: { status: string }) => {
  return (
    <div
      className={`px-3 py-0.5 border rounded-full text-sm font-medium 
    ${
      status === "pending"
        ? "bg-yellow-100 text-yellow-800"
        : status === "assigned"
        ? "bg-blue-100 text-blue-800"
        : status === "resolved"
        ? "bg-green-100 text-green-800"
        : "bg-gray-100 text-gray-800"
    }`}
    >
      {capitalizeFirstLetter(status)}
    </div>
  );
};

// export function ComplaintStatus({ status }: { status: string }) {
//   let primaryColor;
//   let secondaryColor;
//   let faintColor;

//   return (
//     <div
//       className={`rounded-full border-1 ${secondaryColor} ${faintColor} ${primaryColor} text-xs px-2 py-0.5 font-medium`}
//     >
//       {status ? capitalizeFirstLetter(status) : "Nothing"}
//     </div>
//   );
// }
