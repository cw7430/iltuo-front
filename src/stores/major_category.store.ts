import { create } from "zustand";
import { MajorCategoryResponseDto } from "../apis/dto/response/Products";
import { fetchMajorCategoryList } from "../apis/server/Products";

interface MajorCategoryState {
  data: MajorCategoryResponseDto[];
  error: string | null;
  fetchData: () => Promise<void>;
}

const useMajorCategoryStore = create<MajorCategoryState>((set) => ({
  data: [],
  error: null,
  fetchData: async () => {
    set({ error: null });
    try {
      const data = await fetchMajorCategoryList();
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

export default useMajorCategoryStore;
