import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthSession {
  isAdmin: boolean;
}

interface AuthState {
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (session: AuthSession) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      isAdmin: false,
      login: ({ isAdmin }) => set({ isLoggedIn: true, isAdmin }),
      logout: () => set({ isLoggedIn: false, isAdmin: false }),
    }),
    { name: "auth" }
  )
);
