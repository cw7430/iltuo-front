import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./stores";
import { Loader } from "./components/Gif";
import { AlertModal } from "./components/Modals";
import { MAIN_PATH } from "./constants/url";

interface Props {
  children: JSX.Element;
}

export default function AdminRoute(props: Props) {
  const { children } = props;

  const navigate = useNavigate();
  const { isLoggedIn, userPermission } = useAuthStore();

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || userPermission !== "ADMIN") {
      setShowAlertModal(true);
    }
    setChecked(true);
  }, [isLoggedIn, userPermission]);

  const handleCloseAlertModal = () => {
    setShowAlertModal(false);
    navigate(MAIN_PATH(), { replace: true });
  };

  if (!checked) return <Loader />;

  return (
    <>
      {isLoggedIn && userPermission === "ADMIN" ? children : <Loader />}
      <AlertModal
        showAlertModal={showAlertModal}
        handleCloseAlertModal={handleCloseAlertModal}
        handleAfterAlert={handleCloseAlertModal}
        alertTitle="접근 불가"
        alertText="관리자만 접근 가능한 페이지입니다."
      />
    </>
  );
}
