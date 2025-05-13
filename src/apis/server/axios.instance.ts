import axios from "axios";
import ApiError from "./api.error";

const DOMAIN = `${process.env.REACT_APP_API_BASE_URL}`;

const axiosInstance = axios.create({
    baseURL: DOMAIN,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const responseData = error.response?.data;

        if (responseData?.code && responseData?.message) {
            return Promise.reject(new ApiError(responseData.code, responseData.message));
        }

        console.error("Axios Error:", error);
        return Promise.reject(error);
    }
);

export default axiosInstance;