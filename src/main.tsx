import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.tsx";
import { AlertProvider } from "./providers/AlertContext.tsx";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={googleClientId!}>
    <StrictMode>
      <AlertProvider>
        <App />
      </AlertProvider>
    </StrictMode>
  </GoogleOAuthProvider>
);
