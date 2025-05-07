import axiosInstance from "./axios.instance";
import { ResponseDto } from "../dto/response";

export async function apiGet<T>(
    url: string,
    params?: Record<string, any>
): Promise<T> {
    const response = await axiosInstance.get<ResponseDto<T>>(url, { params });
    const { code, message, result } = response.data;

    if (code !== "SU") {
        throw new Error(message);
    }

    return result;
}

export async function apiPost<T, B = any>(url: string, body: B): Promise<T> {
  const response = await axiosInstance.post<ResponseDto<T>>(url, body);
  const { code, message, result } = response.data;

  if (code !== "SU") {
    throw new Error(message);
  }

  return result;
}