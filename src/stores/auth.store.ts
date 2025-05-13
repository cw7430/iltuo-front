import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    isLoggedIn: boolean;
    userPermission: "ADMIN" | "USER" | null;
    accessTokenExpiresAt: number | null;
    refreshTokenExpiresAt: number | null;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            userPermission: null,
            accessTokenExpiresAt: null,
            refreshTokenExpiresAt: null,

            login: (
                accessTokenExpiresAt: number,
                refreshTokenExpiresAt: number,
                userPermission: "ADMIN" | "USER"
            ) =>
                set({
                    isLoggedIn: true,
                    userPermission: userPermission,
                    accessTokenExpiresAt: accessTokenExpiresAt,
                    refreshTokenExpiresAt: refreshTokenExpiresAt,
                }),

            refresh: (
                accessTokenExpiresAt: number,
                userPermission: "ADMIN" | "USER"
            ) =>
                set({
                    isLoggedIn: true,
                    userPermission: userPermission,
                    accessTokenExpiresAt: accessTokenExpiresAt,
                }),

            logout: () =>
                set({
                    isLoggedIn: false,
                    userPermission: null,
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
