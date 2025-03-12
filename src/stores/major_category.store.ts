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
      set({ data });
    } catch (error) {
      console.error('데이터를 불러오지 못했습니다:', error);
      set({ data: [] }); // 오류 발생 시 빈 배열 설정
    }
  },
}));


export default useMajorCategoryStore;