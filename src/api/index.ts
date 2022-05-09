import { useAxios, request } from "../plugins/axios";

export const fetchAnnouncements = async () => {
    // const axios = useAxios();
    const res = await request.get("/v1/notices").catch((err) => {
        console.log(err);
    });
    if (res) {
        return res.data;
    } else {
        return [];
    }
};

export const fetchBanners = async () => {
    const res = await request.get("/v1/banners").catch((err) => {
        console.log(err);
    });
    if (res) {
        return res.data;
    } else {
        return [];
    }
};

export const fetchHotProduct = async () => {
    // const axios = useAxios();
    const res = await request.get("/v1/product").catch((err) => {
        console.log(err);
    });
    if (res) {
        return res.data;
    } else {
        return [];
    }
};

export const postVerification = async (phone: string) => {
    // const axios = useAxios();
    const res = await request
        .post("/v1/auth/sendCode", {
            phone,
        })
        .catch((err) => {
            console.log(err);
        });
    if (res) {
        return res.data;
    } else {
        return { code: 500, msg: "服务器错误" };
    }
};
