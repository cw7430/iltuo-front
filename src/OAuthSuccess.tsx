import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader } from "./components/Gif";
import { AlertModal } from "./components/Modals";
import { loginUser } from "./utils/auth";
import { MAIN_PATH } from "./constants/url";

export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [ready, setReady] = useState<boolean>(false);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertText, setAlertText] = useState<string>("");

  const handleShowAlertModal = () => setShowAlertModal(true);
  const handleCloseAlertModal = () => {
    setShowAlertModal(false);
    setReady(true);
    navigate(MAIN_PATH(), { replace: true });
  };

  useEffect(() => {
    const accessTokenExpiresAt = Number(params.get("accessTokenExpiresAt"));
    const refreshTokenExpiresAt = Number(params.get("refreshTokenExpiresAt"));
    const userPermission = params.get("userPermission") as "USER" | "ADMIN";
    const authMethod = params.get("authMethod") as "SOCIAL" | "NATIVE";

    if (accessTokenExpiresAt && refreshTokenExpiresAt && userPermission && authMethod) {
      loginUser(accessTokenExpiresAt, refreshTokenExpiresAt, userPermission, authMethod);
      setReady(true);
      navigate(MAIN_PATH());
    } else {
      setAlertTitle("오류");
      setAlertText("서버에 이상이 있습니다.");
      handleShowAlertModal();
    }
  }, [params, navigate]);

  if (!ready) return <Loader />;

  return (
    <AlertModal
      showAlertModal={showAlertModal}
      handleCloseAlertModal={handleCloseAlertModal}
      handleAfterAlert={handleCloseAlertModal}
      alertTitle={alertTitle}
      alertText={alertText}
    />
  );
}
