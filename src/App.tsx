import LoginScreen from "./auth/LoginScreen";
import {
  createBrowserRouter,
  Navigate,
  // BrowserRouter as Router,
  RouterProvider,
} from "react-router-dom";
import SignupScreen from "./auth/SignupScreen";
import ForgotPasswordScreen from "./auth/ForgotPassword";
import StudentDashboardLayout from "./student/screens/layout";
import StudentDashboard from "./student/screens/StudentDashboard";
import StudentProfile from "./student/screens/StudentProfile";
import StudentSettings from "./student/screens/StudentSettings";
import { Alert, Snackbar } from "@mui/material";
import { useAlert } from "./providers/AlertContext";
// import NewComplaintScreen from "./student/screens/NewComplaintScreen";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginScreen />,
  },
  { path: "/signup", element: <SignupScreen /> },
  { path: "/forgot-password", element: <ForgotPasswordScreen /> },
  {
    path: "/student",
    element: <StudentDashboardLayout />,
    children: [
      {
        index: true,
        element: <StudentDashboard />,
      },
      {
        path: "profile",
        element: <StudentProfile />,
      },
      {
        path: "settings",
        element: <StudentSettings />,
      },
    ],
  },
]);

function App() {
  const { alert, closeAlert } = useAlert();

  // return <NewComplaintScreen />;
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
