import { Outlet } from "react-router-dom";
import StaffSideBar from "./sidebar";

function StaffDashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden ">
      <StaffSideBar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default StaffDashboardLayout;
