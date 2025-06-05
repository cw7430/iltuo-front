export const MAIN_PATH = () => "/";
export const PLAIN_PATH = (basePath: string, id?: number | string | null) =>
  `/${basePath}${id != null ? `/${id}` : ""}`;
export const LIST_PATH = (basePath: string, id: number | string | null) =>
  `/${basePath}/list${id != null ? `/${id}` : ""}`;
export const DETAIL_PATH = (basePath: string, id: number | string) => `/${basePath}/detail/${id}`;
export const API_PATH = `${process.env.REACT_APP_API_BASE_URL}`;