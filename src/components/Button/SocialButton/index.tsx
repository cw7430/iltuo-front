import naverIcon from "../../../assets/images/naver_icon.png";
import kakaoIcon from "../../../assets/images/kakao_icon.png";
import googleIcon from "../../../assets/images/google_icon.png";

interface Props {
  providerName: "naver" | "kakao" | "google";
}

const iconMap: Record<"naver" | "kakao" | "google", string> = {
  naver: naverIcon,
  kakao: kakaoIcon,
  google: googleIcon,
};

export default function SocialButton(props: Props) {
  const { providerName } = props;

  return (
    <div>
      <img src={iconMap[providerName]} alt={`${providerName} icon`} />
    </div>
  );
}
