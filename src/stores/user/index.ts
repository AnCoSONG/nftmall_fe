import { defineStore } from "pinia";
import * as api from '../../api'
export const useUserStore = defineStore("user", {
    state: () => {
        return {
            data: {
                chain_address: 'fa4390sdadwq21312asdqwqweq123sab12e1231231'
            } as User,
            isLogin: false,
        };
    },
    actions: {
        login(payload: User) {
            this.data = { ...payload };
            this.isLogin = true;
        },
        logout() {
            this.data = {} as User;
            this.isLogin = false;
        },

        async requestVerification(payload: string ) { 
            const res = await api.postVerification();
            return res;
        }
    },
});