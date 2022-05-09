import { defineStore } from "pinia";
import { Notify } from "vant";
import * as api from "../../api";
export const useUserStore = defineStore("user", {
    state: () => {
        return {
            data: {
                bsn_address: "fa4390sdadwq21312asdqwqweq123sab12e1231231",
            } as User,
            isLogin: false,
            firstBack: true,
        };
    },
    actions: {
        login(payload: User) {
            this.data = { ...payload };
            this.isLogin = true;
            this.firstBack = false;
        },
        logout() {
            this.data = {} as User;
            this.isLogin = false;
        },

        async requestVerification(phone: string) {
            const res = await api.postVerification(phone);
            return res;
        },
    },
});
