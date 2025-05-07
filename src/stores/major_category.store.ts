import { create } from "zustand";
import { MajorCategoryResponseDto } from "../apis/dto/response/Products";
import { fetchMajorCategoryList } from "../apis/server/Products";

interface MajorCategoryState {
    data: MajorCategoryResponseDto[];
    loading: boolean;
    error: string | null;
    fetchData: () => Promise<void>;
}

const useMajorCategoryStore = create<MajorCategoryState>((set) => ({
    data: [],
    loading: false,
    error: null,
    fetchData: async () => {
        set({ loading: true, error: null });
        try {
            const data = await fetchMajorCategoryList();
            set({ data, loading: false });
        } catch (err: any) {
            set({
                error: err.message || "알 수 없는 오류",
                data: [],
                loading: false,
            });
        }
    },
}));

export default useMajorCategoryStore;
