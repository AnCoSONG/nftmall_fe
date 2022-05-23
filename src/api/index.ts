import { Notify, Toast } from "vant";
import { request, Response } from "../plugins/axios";

/**
 * 获取首页的公告
 * @returns 公告数组 or []
 */
export const fetchNotices = async () => {
    const res = await request
        .get<Response<Notice[]>>("/notices")
        .catch((err) => {
            console.error(err);
            Notify({
                message: "获取公告失败",
                type: "danger",
            });
        });
    if (res) {
        return res.data.data;
    } else {
        // error return
        return [];
    }
};

/**
 * 获取Banner数据
 * @returns Banner[] or []
 */
export const fetchBanners = async () => {
    const res = await request
        .get<Response<Banner[]>>("/banners")
        .catch((err) => {
            console.error(err);
            Notify({
                message: "获取banner失败",
                type: "danger",
            });
        });
    if (res) {
        return res.data.data;
    } else {
        return [];
    }
};

/**
 * 获取热门商品
 * @returns 商品数组
 */
export const fetchRecommandProducts = async (with_relation: boolean) => {
    const res = await request
        .get<Response<Product[]>>("/products", {
            params: { with_relation },
        })
        .catch((err) => {
            console.error(err);
            Notify({
                message: "获取首页推荐商品失败",
                type: "danger",
            });
        });
    console.log("fetch rec", res);
    if (res) {
        return res.data.data;
    } else {
        return [];
    }
};

/**
 * 与下拉刷新配合使用，
 * @param page 从1开始，第n页
 * @param limit 每页多少个，> 1
 * @returns 该页对应的商品数组 & 商品总数
 */
export const fetchProducts = async (
    page: number,
    limit: number,
    with_relation: boolean
) => {
    const res = await request
        .get<
            Response<{
                data: Product[];
                total: number;
                page: number;
                limit: number;
            }>
        >("/products/list", {
            params: { with_relation: with_relation, page: page, limit: limit },
        })
        .catch((err) => {
            console.error(err);
            Notify({
                message: "获取商品列表失败",
                type: "danger",
            });
        });
    console.log("fetch pro", res);
    if (res) {
        return { total: res.data.data.total, data: res.data.data.data };
    } else {
        return { data: [], total: 0 };
    }
};

export const fetchProduct = async (id: string, with_relation = false) => {
    const res = await request
        .get<Response<Product>>("/products/" + id, {
            params: { with_relation: with_relation },
        })
        .catch((err) => {
            console.error(err);
            Notify({
                message: "获取商品失败",
                type: "danger",
            });
        });
    if (res) {
        return res.data.data;
    } else {
        return null;
    }
};

/**
 * 发送验证码
 * @param phone 手机号，默认为已通过手机号正则验证
 * @returns
 */
export const sendCode = async (phone: string) => {
    const res = await request
        .post<Response>("/auth/sendCode", {
            phone,
        })
        .catch((err) => {
            console.error(err);
            Notify({
                message: "发送验证码失败",
                type: "danger",
            });
        });
    if (res) {
        return res.data.code;
    } else {
        return 400;
    }
};

/**
 * 登录
 * @param phone 手机号，默认为已通过手机号正则验证
 * @param code 验证码
 */
export const login = async (phone: string, code: string) => {
    const res = await request
        .post<Response<User>>("/auth/login", {
            phone,
            code,
        })
        .catch((err) => {
            console.error(err.response.data);
            const errorMessage = err.response.data.message;
            if (errorMessage === "code does not exist") {
                Notify({
                    message: "请发送验证码，并在5分钟内填写",
                    type: "danger",
                });
            } else if (errorMessage === "code does not match") {
                Notify({
                    message: "请输入正确的验证码",
                    type: "danger",
                });
            } else {
                Notify({
                    message: "登录失败:" + errorMessage,
                    type: "danger",
                });
            }
        });
    if (res) {
        return res.data.data;
    }
    return null;
};

/**
 * 登出
 * 让服务器删除cookie并清空redis登录态
 */
export const logout = async (id: number) => {
    const res = await request
        .post<Response>("/auth/logout", {
            id,
        })
        .catch((err) => {
            console.error(err);
            Notify({
                message: "登出失败",
                type: "danger",
            });
            return null;
        });
    if (res) {
        return res.data.code;
    } else {
        return 400;
    }
};
/**
 * 获取用户信息
 * 通过获取用户信息来验证用户是否已经登录
 * @returns 用户信息
 */
export const fetchUserInfo = async () => {
    const res = await request
        .get<Response<User>>("/auth/fetchUserInfo")
        .catch((err) => {
            console.error(err);
            // Notify({
            //     message: "请注意，您已离线",
            //     type: "warning",
            // });
            return null;
        });
    if (res) {
        return res.data.data;
    } else {
        return null;
    }
};

export const idCheck = async (id: number, name: string, id_card: string) => {
    const res = await request
        .post<Response<{ code: number; message: string }>>(
            "/collectors/idcheck",
            {
                id,
                name,
                id_card,
            }
        )
        .catch((err) => {
            console.error(err);
            return null;
        });
    if (res) {
        if (res.data.data.code === 0) {
            return true;
        } else {
            Notify({
                message: res.data.data.message,
                type: "danger",
            });
            return false;
        }
    } else {
        Notify({
            message: "身份证验证失败",
            type: "danger",
        });
        return false;
    }
};

export const get_stock_count = async (
    product_id: string,
    db?: "redis" | "mysql"
) => {
    const res = await request
        .get<Response<{ stock_count: number }>>(`/affair/stock/${product_id}`, {
            params: {
                db: db,
            },
        })
        .catch((err) => {
            console.error(err);
            return null;
        });
    if (res) {
        return res.data.data.stock_count;
    } else {
        return 0;
    }
};

export const fetchIsDraw = async (collector_id: number, product_id: string) => {
    const res = await request
        .post(`/collectors/isdraw`, {
            collector_id,
            product_id,
        })
        .catch((err) => {
            console.error(err);
            return null;
        });
    if (res) {
        return res.data.data === 1;
    } else {
        return false;
    }
};

export const fetchIsLucky = async (
    collector_id: number,
    product_id: string
) => {
    const res = await request
        .post(`/collectors/islucky`, {
            collector_id,
            product_id,
        })
        .catch((err) => {
            console.error(err);
            return null;
        });
    if (res) {
        return res.data.data === 1;
    } else {
        return false;
    }
};

export const fetchIsPaid = async (collector_id: number, product_id: string) => {
    const res = await request
        .post(`/order/ispaid`, {
            collector_id,
            product_id,
        })
        .catch((err) => {
            console.error(err);
            return null;
        });
    if (res) {
        return res.data.data;
    } else {
        return false;
    }
};

export const participateDraw = async (
    collector_id: number,
    product_id: string
) => {
    const res = await request
        .post<Response<{ code: number; message: string }>>("/affair/draw", {
            collector_id,
            product_id,
        })
        .catch((err) => {
            console.error(err);
            return null;
        });
    if (res) {
        return res.data.data;
    } else {
        return null;
    }
};

export const seckill = async (collector_id: number, product_id: string) => {
    const res = await request
        .post<Response<{ code: number; message: string; order_id?: string }>>(
            `/affair/seckill`,
            {
                collector_id,
                product_id,
            }
        )
        .catch((err) => {
            console.error(err);
            Notify({
                message: err.response.data.message,
                type: "danger",
            });
            return null;
        });
    if (res) {
        return res.data.data;
    } else {
        return null;
    }
};

// todo: Order数据结构
export const fetchOrderDetail = async (
    order_id: string,
    with_relation = false
) => {
    const res = await request
        .get<Response<Order>>(`/orders/${order_id}`, {
            params: { with_relation },
        })
        .catch((err) => {
            console.error(err);
            return null;
        });
    if (res) {
        return res.data.data;
    } else {
        return null;
    }
};

export const fetchOrders = async (
    page: number,
    limit: number,
    with_relation = true,
    query = "all"
) => {
    const res = await request
        .get<
            Response<{
                data: Order[];
                total: number;
                page: number;
                limit: number;
            }>
        >(`/orders/list`, {
            params: {
                page,
                limit,
                with_relation,
                query,
            },
        })
        .catch((err) => {
            Toast({
                type: "fail",
                message: err.response.data.message,
            });
            console.error(err);
            return null;
        });
    if (res) {
        return res.data.data;
    } else {
        return null;
    }
};

export const fetchProductItemDetail = async (
    product_item_id: string,
    with_relation = true
) => {
    const res = await request.get<Response<ProductItem>>(`/product-items/${product_item_id}`, {
        params: { with_relation },
    }).catch(err => {
        Toast({
            type: 'fail',
            message: err.response.data.message
        })
        return null;
    })
    if (res) {
        return res.data.data;
    } else {
        return null;
    }
};
