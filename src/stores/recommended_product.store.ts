import { create } from "zustand";
import { ProductResponseDto } from "../apis/dto/response/Products";
import { fetchRecommendedProductList } from "../apis/server/Products";
import { chunkArray } from "../utils/array";

interface RecommendedProductState {
  data: ProductResponseDto[][];
  error: string | null;
  fetchData: () => Promise<void>;
}

const useRecommendedProductStore = create<RecommendedProductState>((set) => ({
  data: [],
  error: null,
  fetchData: async () => {
    set({ error: null });
    try {
      const rawData = await fetchRecommendedProductList();
      const data = chunkArray(rawData, 4);
      set({ data });
    } catch (err: any) {
      set({
        error: err.message || "알 수 없는 오류",
        data: [],
      });
      throw err;
    }
  },
}));

export default useRecommendedProductStore;
