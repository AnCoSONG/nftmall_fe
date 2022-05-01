// todo: 调整type内容，保留最需要的
declare type Product = {
    id: number | string,
    name: string,
    preview_img: string,
    type: "image" | "audio" | "video" | "hybrid" | "3d" | "other",
    classname: string,
    count: number,
    creator: {
        avatar: string,
        name: string,
    }
    details: Object,
    price: string
    tags: string[],
    sale_timestamp: number,
    stock_count: number,
    limit: number,
}

declare type User = {
    id: number | string,
    username: string,
    chain_address: string,
    phone: string,
    email: string,
    avatar: string,
    real_name: string,
    real_id: string,
    credit: number,
}