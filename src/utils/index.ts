import { useRouter } from "vue-router";

const designWidth = 414;
export const px2rem = (px: number) => {
    return (px / designWidth) * 10 + "rem";
};
