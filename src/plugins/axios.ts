import { App, inject } from "vue";
import axios, { AxiosInstance } from "axios";
import { Notify } from "vant";
// import Cookies from "js-cookie";

export type Response<D = any> = {
    data: D;
    statusCode: number;
    code: number;
    message: string;
    auth?: number;
};

export const axiosSymbol = Symbol();
// console.log(import.meta.env)
export const request = axios.create({
    baseURL: <string>import.meta.env.VITE_API_URL,
    timeout: 30000, // 请求超时时间
    withCredentials: true,
});
//todo: add interceptor
// Add a request interceptor
request.interceptors.request.use(
    function (req) {
        // Do something before request is sent
        return req;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
request.interceptors.response.use(
    function (response) {
        // console.log(response.config.url, response);
        return response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    }
);

export const vueAxios = (app: App) => {
    app.provide(axiosSymbol, request);
};
export const useAxios = (): AxiosInstance => {
    const request = inject<AxiosInstance>(axiosSymbol);
    if (!request)
        throw new Error("The axios injection is not registered successfully.");
    return request;
};
