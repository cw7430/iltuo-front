export default interface SignInResponseDto {
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
  userPermission: "ADMIN" | "USER";
  authMethod: "NATIVE" | "SOCIAL";
}
