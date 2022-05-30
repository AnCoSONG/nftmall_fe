import { defineStore } from "pinia";
import { Notify } from "vant";
import * as api from "../../api";
export const useUserStore = defineStore("user", {
    state: () => {
        return {
            data: {} as User,
            isLogin: false,
            firstBack: true,
            firstInHome: true,
        };
    },
    actions: {
        /**
         * 初始化用户状态
         */
        initState() {
            this.data = {} as User;
            this.isLogin = false;
            sessionStorage.removeItem("id");
        },
        /**
         * 登录
         * @param phone 手机号
         * @param code 验证码
         * @returns {Promise<boolean>} true表示登录成功，false表示登录失败
         */
        async login(phone: string, code: string): Promise<boolean> {
            const data = await api.login(phone, code);
            if (data) {
                this.data = { ...data };
                this.isLogin = true;
                sessionStorage.setItem("id", data.id.toString());
                return true;
            } else {
                this.initState();
                return false;
            }
        },
        /**
         * 登出
         * @returns {Promise<boolean>} true表示登出成功，false表示登出失败
         */
        async logout(): Promise<boolean> {
            const data = await api.logout(Number(this.data.id));
            if (data === 200) {
                this.initState();
                return true;
            } else {
                return false;
            }
        },

        /**
         * 获取用户信息
         * @returns {Promise<boolean>} true表示已登录，false表示已失败
         */
        async fetchUserInfo(): Promise<boolean> {
            const data = await api.fetchUserInfo();
            if (data) {
                this.data = { ...data };
                this.isLogin = true;
                sessionStorage.setItem("id", data.id.toString());
                return true;
            } else {
                if (this.firstInHome) {
                    Notify({
                        message: "您已离线",
                        type: "danger",
                        duration: 2000,
                    });
                    this.firstInHome = false;
                }
                this.initState();
                return false;
            }
        },
    },
});
