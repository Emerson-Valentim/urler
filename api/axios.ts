import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";


const authInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
