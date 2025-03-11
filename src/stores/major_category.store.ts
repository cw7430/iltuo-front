import { create } from 'zustand';
import { MajorCategoryResponseDto } from '../apis/dto/response/Products';
import { fetchMajorCategoryList } from '../apis/server/Products';

interface MajorCategoryState {
    data: MajorCategoryResponseDto[];
    fetchData: () => Promise<void>;
}

const useMajorCategoryStore = create<MajorCategoryState>((set) => ({
    data: [],
    fetchData: async () => {
        try {
          const data = await fetchMajorCategoryList();
          if (data) {
            set({ data: data });
          }
        } catch (error) {
          console.error('Failed to fetch categories:', error);
        }
      },
}));

export default useMajorCategoryStore;