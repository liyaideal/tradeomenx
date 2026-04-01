import { create } from "zustand";

interface AuthFlowState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useAuthFlowStore = create<AuthFlowState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));
