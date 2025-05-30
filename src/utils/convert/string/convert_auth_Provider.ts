const convertAuthProvider = (provider: "naver" | "kakao" | "google"): string => {
  const map = {
    naver: "네이버",
    kakao: "카카오",
    google: "구글",
  } as const;
  return map[provider];
};

export default convertAuthProvider;
