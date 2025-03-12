import { create } from "zustand";
import { RecommendatedProductsRequestDto } from "../apis/dto/request/Products";
import { ProductResponseDto } from "../apis/dto/response/Products";
import { fetchRecommendatedProductList } from "../apis/server/Products";

interface RecommendatedProductState {
  data: ProductResponseDto[][];
  fetchData: (requestBody: RecommendatedProductsRequestDto) => Promise<void>;
}

const useRecommendatedProductStore = create<RecommendatedProductState>((set) => ({
  data: [],
  fetchData: async (requestBody: RecommendatedProductsRequestDto) => {
    try {
      const data = await fetchRecommendatedProductList(requestBody);
      set({ data });
    } catch (error) {
      console.error("데이터를 불러오지 못했습니다:", error);
      set({ data: [] });
    }
  },
}));

export default useRecommendatedProductStore;