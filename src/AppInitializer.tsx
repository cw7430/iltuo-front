import { useState, useEffect, useCallback } from "react";
import { useMajorCategoryStore, useRecommendedProductStore } from "./stores";
import InitFailed from "./InitFailed";
import { Loader } from "./components/Gif";

interface Props {
  children: React.ReactNode;
}

export default function AppInitializer (props: Props) {

  const { children } = props;

  const fetchMajor = useMajorCategoryStore((state) => state.fetchData);
  const fetchRecommended = useRecommendedProductStore((state) => state.fetchData);

  const [ready, setReady] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const init = useCallback(async () => {
    setError(false);
    try {
      await Promise.all([fetchMajor(), fetchRecommended()]);
      setReady(true);
    } catch (e) {
      console.error("초기화 실패:", e);
      setError(true);
    }
  }, [fetchMajor, fetchRecommended]);

  useEffect(() => {
    init();
  }, [init]);

  if (error) return <InitFailed retry={init} />;
  if (!ready) return <Loader />;

  return <>{children}</>;
};