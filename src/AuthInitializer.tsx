import { useEffect, useState } from "react";
import { useAuthStore } from "./stores";
import { fetchLogout, fetchRefresh } from "./apis/server/Auth";
import { logoutUser, refreshToken } from "./utils/auth";
import { Loader } from "./components/Gif";

interface Props {
  children: React.ReactNode;
}

export default function AuthInitializer(props: Props) {
  const { children } = props;

  const [ready, setReady] = useState<boolean>(false);

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const handleLogout = async () => {
    await fetchLogout();
    logoutUser();
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setReady(true); // 바로 준비 완료
      return;
    }

    const init = async () => {
      try {
        const result = await fetchRefresh();
        refreshToken(result.accessTokenExpiresAt, result.userPermission, result.authMethod);
        console.log("로그인유지", result);
      } catch (e) {
        handleLogout();
      } finally {
        setReady(true);
      }
    };

    init();
  }, [isLoggedIn]);

  if (!ready) return <Loader />;

  return <>{children}</>;
}
