import { useAuthStore } from "../../stores";

const loginUser = (
    accessTokenExpiresAt: number,
    refreshTokenExpiresAt: number,
    userPermission: "ADMIN" | "USER"
) => {
    useAuthStore.getState().login(accessTokenExpiresAt, refreshTokenExpiresAt, userPermission)
};

export default loginUser;
