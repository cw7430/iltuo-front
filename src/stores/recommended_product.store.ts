import { create } from "zustand";
import { RecommendedProductsRequestDto } from "../apis/dto/request/Products";
import { ProductResponseDto } from "../apis/dto/response/Products";
import { fetchRecommendedProductList } from "../apis/server/Products";

interface RecommendedProductState {
  data: ProductResponseDto[][];
  fetchData: (requestBody: RecommendedProductsRequestDto) => Promise<void>;
}

const useRecommendedProductStore = create<RecommendedProductState>((set) => ({
  data: [],
  fetchData: async (requestBody: RecommendedProductsRequestDto) => {
    try {
      const data = await fetchRecommendedProductList(requestBody);
      set({ data });
    } catch (error) {
      console.error("데이터를 불러오지 못했습니다:", error);
      set({ data: [] });
    }
  },
}));

export default useRecommendedProductStore;