import { MockMethod } from "vite-plugin-mock";

export default [
    {
        url: "/v1/announcement",
        method: "get",
        timeout: 1000,
        response: {
            code: 200,
            msg: "fetch announcement success",
            data: [
                {
                    text: "数字藏品商城iOS App已上线",
                    link: "https://www.baidu.com",
                },
                {
                    text: "数字藏品商城Android App已上线",
                },
                {
                    text: "数字藏品商城获得国家科技进步奖",
                },
            ],
        },
    },
    {
        url: "/v1/banner",
        method: "get",
        timeout: 500,
        response: {
            code: 200,
            msg: "fetch banner success",
            data: [
                {
                    imgsrc: "https://picsum.photos/400/150?random=1",
                },
                {
                    imgsrc: "https://picsum.photos/400/150?random=2",
                },
                {
                    imgsrc: "https://picsum.photos/400/150?random=3",
                },
            ],
        },
    },
    {
        url: "/v1/product",
        method: "get",
        timeout: 500,
        response: ({ query }) => {
            console.log(query);
            return {
                code: 200,
                msg: "fetch hot product success",
                data: [
                    {
                        id: 0,
                        name: "测试藏品",
                        price: "25.50", // money type
                        preview_img: "https://picsum.photos/400/150?random=1",
                        type: "image",
                        classname: "",
                        tags: ["测试", "测试2", "加长标签"],
                        count: 1000,
                        creator: {
                            avatar: "https://picsum.photos/48/48?random=1",
                            name: "测试创作者",
                        },
                        details: {},
                        sale_timestamp: 1651652960967,
                        stock_count: 1000,
                        limit: 2,
                    },
                    {
                        id: 1,
                        name: "测试藏品",
                        price: "25.50", // money type
                        preview_img: "https://picsum.photos/400/150?random=2",
                        type: "image",
                        classname: "",
                        tags: ["测试", "测试2", "加长标签"],
                        count: 1000,
                        creator: {
                            avatar: "https://picsum.photos/48/48?random=2",
                            name: "测试创作者",
                        },
                        details: {},
                        sale_timestamp: 1651652960967,
                        stock_count: 1000,
                        limit: 2,
                    },
                    {
                        id: 2,
                        name: "测试藏品",
                        price: "25.50", // money type
                        preview_img: "https://picsum.photos/400/150?random=3",
                        type: "image",
                        classname: "",
                        tags: ["测试", "测试2", "加长标签"],
                        count: 1000,
                        creator: {
                            avatar: "https://picsum.photos/48/48?random=3",
                            name: "测试创作者",
                        },
                        details: {},
                        sale_timestamp: 1651652960967,
                        stock_count: 1000,
                        limit: 2,
                    },
                    {
                        id: 3,
                        name: "测试藏品",
                        price: "25.50", // money type
                        preview_img: "https://picsum.photos/400/150?random=4",
                        type: "image",
                        classname: "",
                        tags: ["测试", "测试2", "加长标签"],
                        count: 1000,
                        creator: {
                            avatar: "https://picsum.photos/48/48?random=4",
                            name: "测试创作者",
                        },
                        details: {},
                        sale_timestamp: 1651652960967,
                        stock_count: 1000,
                        limit: 2,
                    },
                    {
                        id: 4,
                        name: "测试藏品",
                        price: "25.50", // money type
                        preview_img: "https://picsum.photos/400/150?random=5",
                        type: "image",
                        classname: "",
                        tags: ["测试", "测试2", "加长标签"],
                        count: 1000,
                        creator: {
                            avatar: "https://picsum.photos/48/48?random=5",
                            name: "测试创作者",
                        },
                        details: {},
                        sale_timestamp: 1651652960967,
                        stock_count: 1000,
                        limit: 2,
                    },
                    {
                        id: 5,
                        name: "测试藏品",
                        price: "25.50", // money type
                        preview_img: "https://picsum.photos/400/150?random=6",
                        type: "image",
                        classname: "",
                        tags: ["测试", "测试2", "加长标签"],
                        count: 1000,
                        creator: {
                            avatar: "https://picsum.photos/48/48?random=6",
                            name: "测试创作者",
                        },
                        details: {},
                        sale_timestamp: 1651652960967,
                        stock_count: 1000,
                        limit: 2,
                    },
                ],
            };
        },
    },
    {
        url: "/v1/verification",
        method: "post",
        timeout: 500,
        response: ({ query }) => {
            return {
                code: 200,
                msg: "request verification success",
            };
        },
    },
    {
        url: "/v1/login",
        method: "post",
        timeout: 500,
        response: {
            code: 200,
            msg: "login success",
            data: {
                id: 1,
                username: "test",
                chain_address: "12ed2ey2ewhdiug12iue37ygdwu12973gs192assdqw",
                phone: "18512855406",
                email: "1197252996@qq.com",
                avatar: "https://picsum.photos/48/48?random=1",
                real_name: "测试用户",
                real_id: "123456789012345678",
                credit: "100",
            },
        },
    },
] as MockMethod[];
