import { Outlet } from "react-router-dom";
import SideBar from "./sidebar";

function StudentDashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden ">
      <SideBar />
      <main className="flex-1">
        {/* <div className="py-6 flex justify-between items-center" /> */}
        <Outlet />
      </main>
    </div>
  );
}

export default StudentDashboardLayout;
