export default interface RefreshAccessTokenResponseDto {
  accessTokenExpiresAt: number;
  userPermission: "ADMIN" | "USER";
  authMethod: "NATIVE" | "SOCIAL";
}
