import { useRouter } from "vue-router";
import { cos, getObjectUrlPromisify } from "../plugins/cos-sdk";
import AES from "crypto-js/aes";
import ECB from "crypto-js/mode-ecb";
import Pkcs7 from "crypto-js/pad-pkcs7";
import CryptoJS from "crypto-js";
import { Toast } from "vant";

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

export const hash = (text: string) => {
    return CryptoJS.MD5(text);
};

export const randomCode = () => {
    return CryptoJS.lib.WordArray.random(16).toString();
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
            return "https://fakeimg.pl/400x200/?retina=1&text=?&font=noto";
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

export const encrypt = (data: string) => {
    // console.log(AES, Utf8, Pkcs7)
    return AES.encrypt(data, "8992c282-ddff-11ec-9d64-0242ac120002", {
        mode: ECB,
        padding: Pkcs7,
    }).toString();
};

export const onCopySuccess = () => {
    Toast({
        type: "success",
        message: "复制成功",
    });
};

export const onCopyError = () => {
    Toast({
        type: "fail",
        message: "复制失败",
    });
};

export const TIME_FORMAT = "YYYY MM.DD HH:mm:ss";

export const notSupport = () => {
    Toast({
        type: "fail",
        message: "目前暂不支持，后续会尽快更新完善",
    });
};

export const getQuerys = (e: string) => {
    if (!e) return {};
    let t: Record<string, string> = {},
        r = [],
        n = "",
        a = "";
    try {
        let i: string[] = [];
        if (
            (e.indexOf("?") >= 0 &&
                (i = e.substring(e.indexOf("?") + 1, e.length).split("&")),
            i.length > 0)
        )
            for (let o in i)
                (n = (r = i[o].split("="))[0]), (a = r[1]), (t[n] = a);
    } catch (s) {
        t = {};
    }
    return t;
};

import wx from "weixin-js-sdk";
import { fetchSignature } from "../api";
export const setupSharing = async (
    title: string,
    desc: string,
    imgUrl: string,
    link: string
) => {
    const r = await fetchSignature(window.location.toString());
    if (r) {
        wx.config({
            debug: false, // 开启调试模式,调用的所有 api 的返回值会在客户端 alert 出来，若要查看传入的参数，可以在 pc 端打开，参数信息会通过 log 打出，仅在 pc 端时才会打印。
            appId: r.appId, // 必填，公众号的唯一标识
            timestamp: r.timestamp, // 必填，生成签名的时间戳
            nonceStr: r.nonceStr, // 必填，生成签名的随机串
            signature: r.signature, // 必填，签名
            jsApiList: [
                "updateAppMessageShareData",
                "updateTimelineShareData",
                "onMenuShareAppMessage",
                "onMenuShareTimeline",
                "onMenuShareQQ",
                "onMenuShareQZone",
            ], // 必填，需要使用的 JS 接口列表
        });
        wx.ready(() => {
            wx.onMenuShareTimeline({
                title, // 分享标题
                link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
                imgUrl, // 分享图标
                success: function () {
                    // 用户点击了分享后执行的回调函数
                    Toast({
                        type: "success",
                        message: "分享成功!",
                    });
                },
            });
            wx.onMenuShareAppMessage({
                title,
                desc,
                link,
                imgUrl,
                success: function () {
                    Toast({
                        type: "success",
                        message: "分享成功!",
                    });
                },
            });
        });
    }
};

//* 设置保护
export const setupProtection = async () => {
    const r = await fetchSignature(window.location.toString());
    if (r) {
        wx.config({
            debug: false, // 开启调试模式,调用的所有 api 的返回值会在客户端 alert 出来，若要查看传入的参数，可以在 pc 端打开，参数信息会通过 log 打出，仅在 pc 端时才会打印。
            appId: r.appId, // 必填，公众号的唯一标识
            timestamp: r.timestamp, // 必填，生成签名的时间戳
            nonceStr: r.nonceStr, // 必填，生成签名的随机串
            signature: r.signature, // 必填，签名
            jsApiList: [
                "hideAllNonBaseMenuItem"
            ], // 必填，需要使用的 JS 接口列表
        });
        wx.ready(() => {
            wx.hideAllNonBaseMenuItem()
        })
    }
}
