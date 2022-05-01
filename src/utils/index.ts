import { useRouter } from "vue-router";

const designWidth = 414;
export const px2rem = (px: number, only_digit = false) => {
    if (only_digit) return (px / designWidth) * 10;
    return (px / designWidth) * 10 + "rem";
};


export const phoneTest = (phone: string) => {
    return /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(phone);
}