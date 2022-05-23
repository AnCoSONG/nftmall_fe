import { useRouter } from "vue-router";
import { cos, getObjectUrlPromisify } from "../plugins/cos-sdk";

const designWidth = 414;
export const px2rem = (px: number, only_digit = false) => {
    if (only_digit) return (px / designWidth) * 10;
    return (px / designWidth) * 10 + "rem";
};

export const phoneTest = (phone: string) => {
    return /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(
        phone
    );
};

export const realnameTest = (realname: string) => {
    return /^(([a-zA-Z+\.?\·?a-zA-Z+]{2,30}$)|([\u4e00-\u9fa5+\·?\u4e00-\u9fa5+]{2,30}$))/.test(
        realname
    );
};

export const realidTest = (id: string) => {
    return /^(^[1-9]\d{5}[1-9]\d{3}(((0[2])([0|1|2][0-8])|(([0-1][1|4|6|9])([0|1|2][0-9]|[3][0]))|(((0[1|3|5|7|8])|(1[0|2]))(([0|1|2]\d)|3[0-1]))))((\d{4})|\d{3}[Xx])$)$/.test(
        id
    );
};

export const hidePhone = (phone: string) => {
    if (phoneTest(phone)) {
        return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    } else {
        return phone;
    }
};

/**
 * 图像地址原样返回，cos key解析后返回
 * @param src 图像地址或者cos key
 */
export const srcTransform = async (src: string) => {
    if (/(http|https):\/\/([\w.]+\/?)\S*/.test(src)) {
        return src;
    } else {
        // 认为是key
        // cos.getObjectUrl()
        const url = await getObjectUrlPromisify(src);
        if (url) {
            return url;
        } else {
            // todo: 通用图像不存在时的占位符
            return 'https://fakeimg.pl/400x200/?retina=1&text=?&font=noto'
        }
    }
};

export enum PaymentStatus {
    UNPAID = "unpaid",
    PAID = "paid",
    CANCELED = "canceled",
}

export enum SupportType {
    IMAGE = "image",
    VIDEO = "video",
    AUDIO = "audio",
    D3 = "3D",
    HYBRID = "hybrid",
}

export enum DisplayMode {
    LIGHT = "light",
    DARK = "dark",
}

export enum onChainStatus {
    SUCCESS = "success",
    PROCESSING = "processing",
    FAILED = "failed",
    PENDING = "pending",
}
