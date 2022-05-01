import { App, inject } from "vue";
import axios, { AxiosInstance } from "axios";
export const axiosSymbol = Symbol();
// console.log(import.meta.env)
export const service = axios.create({
  // baseURL: <string>import.meta.env.VITE_API_URL,
  timeout: 30000, // 请求超时时间
});
//todo: add interceptor
// Add a request interceptor
service.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
service.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
export const vueAxios = (app: App) => {
  app.provide(axiosSymbol, service);
};
export const useAxios = (): AxiosInstance => {
  const service = inject<AxiosInstance>(axiosSymbol);
  if (!service)
    throw new Error("The axios service is not registered successfully.");
  return service;
};

