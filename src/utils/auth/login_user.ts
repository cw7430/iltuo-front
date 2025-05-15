import { useAuthStore } from "../../stores";

const loginUser = (
    accessTokenExpiresAt: number,
    refreshTokenExpiresAt: number,
    userPermission: "ADMIN" | "USER",
    authMethod: "NATIVE" | "SOCIAL" | "CROSS"
) => {
    useAuthStore.getState().login(accessTokenExpiresAt, refreshTokenExpiresAt, userPermission, authMethod)
};

export default loginUser;
