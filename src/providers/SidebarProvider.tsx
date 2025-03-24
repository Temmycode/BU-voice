import { create } from "zustand";

interface SideBarProps {
  selectedRoute: string;
  setSelectedRoute: (value: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
  isDetailsPanelOpen: boolean;
  setIsDetailsPanelOpen: (value: boolean) => void;
  isAssignDialogOpen: boolean;
  setIsAssignDialogOpen: (value: boolean) => void;
  isResponseDialogOpen: boolean;
  setIsResponseDialogOpen: (value: boolean) => void;
}

export const useSidebarStore = create<SideBarProps>((set) => ({
  selectedRoute: "",
  setSelectedRoute(value) {
    set({ selectedRoute: value });
  },
  sidebarCollapsed: false,
  setSidebarCollapsed: (value: boolean) => {
    set({ sidebarCollapsed: value });
  },
  mobileMenuOpen: false,
  setMobileMenuOpen(value: boolean) {
    set({ mobileMenuOpen: value });
  },
  isDetailsPanelOpen: true,
  setIsDetailsPanelOpen(value) {
    set({ isDetailsPanelOpen: value });
  },
  isAssignDialogOpen: false,
  setIsAssignDialogOpen(value) {
    set({ isAssignDialogOpen: value });
  },
  isResponseDialogOpen: false,
  setIsResponseDialogOpen(value) {
    set({ isResponseDialogOpen: value });
  },
}));
