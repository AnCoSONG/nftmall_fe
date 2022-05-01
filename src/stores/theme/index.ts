import { defineStore } from "pinia";
import { px2rem } from "../../utils";

export const useThemeStore = defineStore("theme", {
    state: () => {
        return {
            componentVars: {
                overlayBackgroundColor: "#202020",
                // tabsNavBackgroundColor: "#202020",
                passwordInputBackgroundColor: '#343434',
                passwordInputTextColor: '#fff',
                passwordInputCursorColor: '#fff',
                passwordInputDotColor: '#fff',
                passwordInputBorderRadius: px2rem(8),
            },
            announcement: {
                noticeBarBackground: "#343434",
                // noticeBarText: "#E5D7D7",
            },
        };
    },
});
