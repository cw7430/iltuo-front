export default interface SocialAuth {
  userIdx: number;
  userName: string | null;
  phoneNumber: string | null;
  email: string | null;
  authProvider: "naver" | "kakao" | "google";
  providerUserId: string;
}
