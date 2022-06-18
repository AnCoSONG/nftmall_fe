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
                cellGroupBackgroundColor: '#343434',
                cellBackgroundColor: '#343434',
                cellBorderColor: '#4d4d4d',
                cellTextColor: '#ddd',
                cellActiveColor: '#5d5d5d',
                cellIconSize: px2rem(20),
                cellFontSize: px2rem(14),
                cellLineHeight: px2rem(32),
                skeletonRowBackgroundColor: '#343434',
                radioDisabledBackgroundColor: '#666',
                radioDisabledIconColor: '#666',
                imagePlaceholderBackgroundColor: '#272727',
                // stepCircleColor: '#272727',
            },
            announcement: {
                noticeBarBackground: "#343434",
                noticeBarText: "#bbb",
            },
            product_timeline: {
                stepsBackgroundColor: '#272727',
                stepLineColor: '#444',
                stepFinishTextColor: '#ccc',
            }
        };
    },
});
