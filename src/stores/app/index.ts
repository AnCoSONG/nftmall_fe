import { AxiosInstance } from "axios";
import { defineStore } from "pinia";
import * as api from "../../api";
export const useAppStore = defineStore("app", {
    state: () => {
        return {
            title: "晋元数字",
            mall_name: "晋元数字馆",
            isWx: false,
            openid: '',
        };
    },
    actions: {
        // async loadAnnouncement() {
        //     const res = await api.fetchAnnouncements();
        //     console.log(res);
        //     this.announcement = [...res.data];
        // },
        // async loadBanner() {
        //     const res = await api.fetchBanners();
        //     console.log(res);
        //     this.banner = [...res.data];
        // },
        // async loadHotProduct() {
        //     const res = await api.fetchHotProduct();
        //     console.log(res)
        //     this.hot = [...res.data];
        // },
        // setHotProduct(payload: Product[]) {
        //     this.hot = [...payload];
        // }
    },
});
