import { createContext, useState, useContext, ReactNode } from "react";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertContextType {
  alert: {
    open: boolean;
    message: string;
    severity: AlertType;
  };
  showAlert: (message: string, severity?: AlertType) => void;
  closeAlert: () => void;
}

interface AlertProviderProps {
  children: ReactNode;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: AlertProviderProps) => {
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: AlertType;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showAlert = (message: string, severity: AlertType = "success") => {
    setAlert({ open: true, message, severity });
  };

  const closeAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert, closeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
