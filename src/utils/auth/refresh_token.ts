import { useAuthStore } from "../../stores";

const refreshToken = (
  accessTokenExpiresAt: number,
  userPermission: "ADMIN" | "USER",
  authMethod: "NATIVE" | "SOCIAL"
) => {
  useAuthStore.getState().refresh(accessTokenExpiresAt, userPermission, authMethod);
};

export default refreshToken;
