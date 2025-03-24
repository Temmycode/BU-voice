import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.tsx";
import { AlertProvider } from "./providers/AlertContext.tsx";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log(googleClientId);

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={googleClientId!}>
    <BrowserRouter>
      <StrictMode>
        <AlertProvider>
          <App />
        </AlertProvider>
      </StrictMode>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
