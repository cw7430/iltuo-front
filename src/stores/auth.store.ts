import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  userPermission: "ADMIN" | "USER" | null;
  authMethod: "NATIVE" | "SOCIAL" | null;
  accessTokenExpiresAt: number | null;
  refreshTokenExpiresAt: number | null;

  login: (
    accessTokenExpiresAt: number,
    refreshTokenExpiresAt: number,
    userPermission: "ADMIN" | "USER",
    authMethod: "NATIVE" | "SOCIAL"
  ) => void;

  refresh: (
    accessTokenExpiresAt: number,
    userPermission: "ADMIN" | "USER",
    authMethod: "NATIVE" | "SOCIAL"
  ) => void;

  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      userPermission: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      authMethod: null,

      login: (
        accessTokenExpiresAt: number,
        refreshTokenExpiresAt: number,
        userPermission: "ADMIN" | "USER",
        authMethod: "NATIVE" | "SOCIAL"
      ) =>
        set({
          isLoggedIn: true,
          userPermission: userPermission,
          authMethod: authMethod,
          accessTokenExpiresAt: accessTokenExpiresAt,
          refreshTokenExpiresAt: refreshTokenExpiresAt,
        }),

      refresh: (
        accessTokenExpiresAt: number,
        userPermission: "ADMIN" | "USER",
        authMethod: "NATIVE" | "SOCIAL"
      ) =>
        set({
          isLoggedIn: true,
          userPermission: userPermission,
          authMethod: authMethod,
          accessTokenExpiresAt: accessTokenExpiresAt,
        }),

      logout: () =>
        set({
          isLoggedIn: false,
          userPermission: null,
          authMethod: null,
          accessTokenExpiresAt: null,
          refreshTokenExpiresAt: null,
        }),
    }),
    {
      name: "auth-storage", // localStorage key
    }
  )
);

export default useAuthStore;
