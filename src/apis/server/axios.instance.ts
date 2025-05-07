import axios from "axios";

const DOMAIN = `${process.env.REACT_APP_API_BASE_URL}`;

const axiosInstance = axios.create({
    baseURL: DOMAIN,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// 요청 인터셉터 (예: 토큰 자동 첨부)
// axiosInstance.interceptors.request.use((config) => {
// const token = localStorage.getItem("accessToken");
// if (token) {
//   config.headers.Authorization = `Bearer ${token}`;
// }
// return config;
// });

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error("Axios Error:", error);
        return Promise.reject(error);
    }
);

export default axiosInstance;