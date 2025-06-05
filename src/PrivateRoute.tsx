import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./stores";
import { Loader } from "./components/Gif";
import { AlertModal } from "./components/Modals";
import { MAIN_PATH } from "./constants/url";

interface Props {
  children: JSX.Element;
}

export default function PrivateRoute(props: Props) {
  const { children } = props;

  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowAlertModal(true);
    }
    setChecked(true);
  }, [isLoggedIn]);

  const handleCloseAlertModal = () => {
    setShowAlertModal(false);
    navigate(MAIN_PATH(), { replace: true });
  };

  if (!checked) return <Loader />;

  return (
    <>
      {isLoggedIn ? children : <Loader />}
      <AlertModal
        showAlertModal={showAlertModal}
        handleCloseAlertModal={handleCloseAlertModal}
        handleAfterAlert={handleCloseAlertModal}
        alertTitle="로그인 필요"
        alertText="로그인이 필요한 페이지입니다."
      />
    </>
  );
}
