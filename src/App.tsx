import LoginScreen from "./auth/LoginScreen";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignupScreen from "./auth/SignupScreen";
import ForgotPasswordScreen from "./auth/ForgotPassword";
import StudentDashboardLayout from "./student/screens/layout";
import StudentDashboard from "./student/screens/StudentDashboard";
import StudentProfile from "./student/screens/StudentProfile";
import StudentSettings from "./student/screens/StudentSettings";
import { Alert, Snackbar } from "@mui/material";
import { useAlert } from "./providers/AlertContext";
import StaffDashboardLayout from "./staff/screens/layout";
import StaffDashboard from "./staff/screens/StaffDashboard";
import StaffProfile from "./staff/screens/StaffProfile";
import StaffSettings from "./staff/screens/StaffSettings";
import LandingPage from "./LandingPage";
import AssignedComplaints from "./staff/screens/AssignedComplaints";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginScreen /> },
  { path: "/signup", element: <SignupScreen /> },
  { path: "/forgot-password", element: <ForgotPasswordScreen /> },
  {
    path: "/student",
    element: <StudentDashboardLayout />,
    children: [
      { index: true, element: <StudentDashboard /> },
      { path: "profile", element: <StudentProfile /> },
      { path: "settings", element: <StudentSettings /> },
    ],
  },
  {
    path: "/staff",
    element: <StaffDashboardLayout />,
    children: [
      { index: true, element: <StaffDashboard /> },
      { path: "assigned", element: <AssignedComplaints /> },
      { path: "profile", element: <StaffProfile /> },
      { path: "settings", element: <StaffSettings /> },
    ],
  },
]);

function App() {
  const { alert, closeAlert } = useAlert();

  return (
    <div>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={closeAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={closeAlert}
          severity={alert.severity}
          variant="standard"
        >
          {alert.message}
        </Alert>
      </Snackbar>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
