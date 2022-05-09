// todo: 调整type内容，保留最需要的
// todo: 根据后端调整
declare type ID = number | string

declare type Tag = {
    text: string,
    mode?: 'light' | 'dark'
}

declare type Product = {
    id: ID,
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
    tags: Tag[],
    sale_timestamp: number,
    stock_count: number,
    limit: number,
}

declare type User = {
    id: ID,
    username: string,
    bsn_address: string,
    phone: string,
    email: string,
    avatar: string,
    real_name: string,
    real_id: string,
    credit: number,
}


declare type OrderStatus = "canceled" | "completed" | "unlinked" | "unpaied"

declare type Order = {
    id: ID,
    buyer_id: ID,
    purchase_item: OrderPurchaseItem,
    order_status: OrderStatus,
    pay_method: "alipay" | "wechat" | "card",
    gen_credits: number,
    create_at: number,
    pay_at: number,
    on_chain_at: number,
}

declare type OrderPurchaseItem = {
    id: ID,
    product: Partial<Product>,
    count: number,
}

declare type BoughtItem = {
    id: ID,
    product: Partial<Product>,
    chain_address: string,
    no: number,
}