import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap-grid.css";
import "bootstrap/dist/css/bootstrap-reboot.css";
import "bootstrap/dist/css/bootstrap-reboot.min.css";
import "./assets/css/style.css";
import "./assets/css/responsive.css";
import "./assets/css/jquery.mCustomScrollbar.min.css";
import AuthInitializer from "./AuthInitializer";
import AppInitializer from "./AppInitializer";
import PrivateRoute from "./PrivateRoute";
import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import { MAIN_PATH, PLAIN_PATH, LIST_PATH, DETAIL_PATH } from "./constants/url";
import Main from "./views/Main";
import { useAuthStore } from "./stores";
import ProductList from "./views/Product/ProductList";
import ProuctDetail from "./views/Product/ProductDetail";
import SignUp from "./views/Auth/SignUp";
import { fetchLogout, fetchRefresh } from "./apis/server/Auth";
import { logoutUser, refreshToken } from "./utils/auth";
import { Loader } from "./components/Gif";
import { AlertModal, LogInModal } from "./components/Modals";
import OAuthSuccess from "./OAuthSuccess";
import MyProfile from "./views/Auth/MyProfile";
import Cart from "./views/Order/Cart";
import Order from "./views/Order/Order";
import Payment from "./views/Order/Payment";
import OrderGroup from "./views/Order/OrderGroup";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertText, setAlertText] = useState<string>("");

  const [showLogInModal, setShowLogInModal] = useState<boolean>(false);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const accessTokenExpiresAt = useAuthStore((state) => state.accessTokenExpiresAt);

  const handelLogout = async () => {
    try {
      setIsLoading(true);
      await fetchLogout();
    } finally {
      logoutUser();
      setIsLoading(false);
    }
  };

  const handleShowAlertModal = (title: string, text: string) => {
    setAlertTitle(title);
    setAlertText(text);
    setShowAlertModal(true);
  };

  const handleCloseAlertModal = () => setShowAlertModal(false);

  const handleShowLoginModal = () => setShowLogInModal(true);

  const handleCloseLogInModal = () => setShowLogInModal(false);

  useEffect(() => {
    if (!isLoggedIn || !accessTokenExpiresAt) return;

    const now = Date.now();
    const timeUntilRefresh = accessTokenExpiresAt - now - 2 * 60 * 1000;

    const requestRefresh = async () => {
      try {
        const result = await fetchRefresh();
        try {
          refreshToken(result.accessTokenExpiresAt, result.userPermission, result.authMethod);
        } catch (e) {
          console.error("스토어 갱신 실패", e);
          handleShowAlertModal("갱신 오류", "토큰 갱신 중 오류가 발생했습니다.");
          handelLogout();
        }
        console.log("갱신성공", result);
      } catch (e) {
        handleShowAlertModal("세션만료", "세션이 만료되었습니다. 로그아웃합니다.");
        handelLogout();
      }
    };

    if (timeUntilRefresh <= 0) {
      requestRefresh();
      return;
    }

    const timeoutId = setTimeout(() => {
      requestRefresh(); // 2분 전에 갱신 시도
    }, timeUntilRefresh);

    return () => clearTimeout(timeoutId);
  }, [isLoggedIn, accessTokenExpiresAt]);

  return (
    <AuthInitializer>
      <AppInitializer>
        <Routes>
          <Route
            element={
              <Layout handelLogout={handelLogout} handleShowLoginModal={handleShowLoginModal} />
            }
          >
            <Route path={MAIN_PATH()} element={<Main />} />
            <Route path={LIST_PATH("product", ":majorCategoryId")} element={<ProductList />} />
            <Route
              path={DETAIL_PATH("product", ":productId")}
              element={<ProuctDetail handleShowLoginModal={handleShowLoginModal} />}
            />
            <Route path={PLAIN_PATH("sign_up", null)} element={<SignUp />} />
            <Route path={PLAIN_PATH("oauth2/success", null)} element={<OAuthSuccess />} />
            <Route
              path={PLAIN_PATH("profile", null)}
              element={
                <PrivateRoute>
                  <MyProfile />
                </PrivateRoute>
              }
            />
            <Route
              path={LIST_PATH("order", null)}
              element={
                <PrivateRoute>
                  <OrderGroup />
                </PrivateRoute>
              }
            />
            <Route
              path={PLAIN_PATH("cart", null)}
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              }
            />
            <Route
              path={DETAIL_PATH("order", ":paymentId")}
              element={
                <PrivateRoute>
                  <Order />
                </PrivateRoute>
              }
            />
            <Route
              path={DETAIL_PATH("payment", ":paymentId")}
              element={
                <PrivateRoute>
                  <Payment />
                </PrivateRoute>
              }
            />
          </Route>
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
        {isLoading && <Loader />}
        <AlertModal
          showAlertModal={showAlertModal}
          handleCloseAlertModal={handleCloseAlertModal}
          handleAfterAlert={handleCloseAlertModal}
          alertTitle={alertTitle}
          alertText={alertText}
        />
        <LogInModal showLogInModal={showLogInModal} handleCloseLogInModal={handleCloseLogInModal} />
      </AppInitializer>
    </AuthInitializer>
  );
}

export default App;
