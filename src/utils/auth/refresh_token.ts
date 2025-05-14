import { useAuthStore } from "../../stores";

const refreshToken = (accessTokenExpiresAt: number, userPermission: "ADMIN" | "USER") => {
    useAuthStore.getState().refresh(accessTokenExpiresAt, userPermission);
};

export default refreshToken;
