import COS from "cos-js-sdk-v5";
import { App, inject } from "vue";

const cosSymbol = Symbol();
export const cos = new COS({
    SecretId: import.meta.env.VUE_APP_COS_SECRET_ID,
    SecretKey: import.meta.env.VUE_APP_COS_SECRET_KEY,
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

export const cdnTransform = (key: string) => {
    return `https://mall-1308324841.file.myqcloud.com/${key}`
}

export const vueCos = (app: App) => {
    app.provide(cosSymbol, cos);
};

export const useCos = (): COS => {
    const cos = inject<COS>(cosSymbol);
    if (!cos)
        throw new Error("The cos injection is not registered successfully.");
    return cos;
};
