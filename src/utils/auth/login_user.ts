import { useAuthStore } from "../../stores";

const loginUser = (
  accessTokenExpiresAt: number,
  refreshTokenExpiresAt: number,
  userPermission: "ADMIN" | "USER",
  authMethod: "NATIVE" | "SOCIAL"
) => {
  useAuthStore
    .getState()
    .login(accessTokenExpiresAt, refreshTokenExpiresAt, userPermission, authMethod);
};

export default loginUser;
