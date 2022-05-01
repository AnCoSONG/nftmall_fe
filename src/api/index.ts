import { useAxios, service } from "../plugins/axios";

export const fetchAnnouncements = async () => {
    const axios = useAxios();
    const res = await axios.get("/v1/announcement").catch((err) => {
        console.log(err);
    });
    if (res) {
        return res.data;
    } else {
        return [];
    }
};

export const fetchBanners = async () => {
    const axios = useAxios();
    const res = await axios.get("/v1/banner").catch((err) => {
        console.log(err);
    });
    if (res) {
        return res.data;
    } else {
        return [];
    }
};

export const fetchHotProduct = async () => {
    const axios = useAxios();
    const res = await axios.get("/v1/product").catch((err) => {
        console.log(err);
    });
    if (res) {
        return res.data;
    } else {
        return [];
    }
};

export const postVerification = async () => {
    const axios = useAxios();
    const res = await axios.post("/v1/verification").catch((err) => {
        console.log(err);
    });
    if (res) {
        return res.data;
    } else {
        return { code: 500, msg: "服务器错误" };
    }
};
