import axios from "axios";
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";


const authInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");

  if (token) {
    // Check if token already starts with "Bearer " to avoid duplication
    const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    config.headers.Authorization = authHeader;
  }

  return config;
};

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

axiosInstance.interceptors.request.use(authInterceptor);

export const axiosMutator = <T>(config: AxiosRequestConfig) => {
  return axiosInstance<T>(config);
};
