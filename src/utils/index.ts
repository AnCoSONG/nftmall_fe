import { useRouter } from "vue-router";

const designWidth = 414;
export const px2rem = (px: number, only_digit = false) => {
    if (only_digit) return (px / designWidth) * 10;
    return (px / designWidth) * 10 + "rem";
};


export const phoneTest = (phone: string) => {
    return /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(phone);
}

export const realnameTest = (realname: string) => {
    return /^(([a-zA-Z+\.?\·?a-zA-Z+]{2,30}$)|([\u4e00-\u9fa5+\·?\u4e00-\u9fa5+]{2,30}$))/.test(realname);
}

export const realidTest = (id: string) => {
    return /^(^[1-9]\d{5}[1-9]\d{3}(((0[2])([0|1|2][0-8])|(([0-1][1|4|6|9])([0|1|2][0-9]|[3][0]))|(((0[1|3|5|7|8])|(1[0|2]))(([0|1|2]\d)|3[0-1]))))((\d{4})|\d{3}[Xx])$)$/.test(id);
}