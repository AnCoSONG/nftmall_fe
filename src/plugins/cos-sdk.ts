import COS from "cos-js-sdk-v5";
import { App, inject } from "vue";

const cosSymbol = Symbol();
export const cos = new COS({
    SecretId: import.meta.env.VITE_COS_SECRET_ID,
    SecretKey: import.meta.env.VITE_COS_SECRET_KEY,
});

const Bucket = "mall-1308324841";
const Region = "ap-beijing";

const isKeyExistPromise = (key: string) => {
    return new Promise((resolve, reject) => {
        cos.headObject(
            {
                Bucket,
                Region,
                Key: key,
            },
            (err, data) => {
                if (data) {
                    resolve(true);
                } else if (err?.code == "404") {
                    resolve(false);
                } else if (err?.code == "403") {
                    reject(err.code);
                } else {
                    reject(err);
                }
            }
        );
    });
};

export const getObjectUrlPromisify = async (
    key: string
): Promise<null | string> => {
    const isExist = await isKeyExistPromise(key).catch((err) => {
        console.error(err);
        return false;
    });
    if (!isExist) {
        return null;
    } else {
        return new Promise((resolve, reject) => {
            cos.getObjectUrl(
                {
                    Bucket,
                    Region,
                    Key: key,
                },
                (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data.Url);
                    }
                }
            );
        });
    }
};

export const putObjectPromisify = async (key: string, file: File) => {
    return new Promise((resolve, reject) => {
        cos.putObject(
            {
                Bucket,
                Region,
                Key: `avatar/${key}`,
                StorageClass: "STANDARD",
                Body: file,
            },
            function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            }
        );
    });
};

export const cdnTransform = (key: string) => {
    return `https://mall-1308324841.file.myqcloud.com/${key}`;
};

import MD5 from "crypto-js/md5";
import { randStr } from "../utils";

export const authSrc = (originalStr: string) => {
    const url = new URL(originalStr);
    const path = url.pathname;
    const origin = url.origin

    const secret =
        Math.random() > 0.5
            ? import.meta.env.VITE_CDN_MAIN_SECRET
            : import.meta.env.VITE_CDN_BACKUP_SECRET;
    const param = import.meta.env.VITE_CDN_PARAMETER;
    const now = Date.now();
    const now_ms = Math.floor(now / 1000);
    const rand_str = randStr(Math.floor((Math.random() * 4 + 4))) // 生成 8 - 16 位随机数

    const md5sign = MD5(`${path}-${now_ms}-${rand_str}-${0}-${secret}`).toString();
    return `${origin}${path}?${param}=${now_ms}-${rand_str}-0-${md5sign}`
};

export const vueCos = (app: App) => {
    app.provide(cosSymbol, cos);
};

export const useCos = (): COS => {
    const cos = inject<COS>(cosSymbol);
    if (!cos)
        throw new Error("The cos injection is not registered successfully.");
    return cos;
};
