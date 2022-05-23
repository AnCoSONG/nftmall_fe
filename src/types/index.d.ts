// todo: 调整type内容，保留最需要的
// todo: 根据后端调整
declare type ID = number | string

declare type SupportType = "image" | "audio" | "video" | "hybrid" | "3d" | "other";
declare type Tag = {
    name: string,
    mode?: 'light' | 'dark'
}

declare type Genre = {
    id: ID,
    name: string,
}

declare type Publisher = {
    id: string,
    name: string,
    avatar: string,
    works?: Product[],
}

declare type Product = {
    id: string,
    name: string,
    preview_img: string,
    src: string,
    description: string,
    type: SupportType,
    genres: Genre[],
    publish_count: number,
    stock_count: number,
    publisher_id: ID,
    publisher: Publisher,
    items?: ProductItem[],
    details: string[],
    price: string,
    limit: number,
    tags: Tag[],
    sale_timestamp: string;
    draw_timestamp: string;
    draw_end_timestamp: string;
}

declare type ProductItem = {
    id: string,
    no: number,
    product: Product,
    bsn_address: string,
}

declare type User = {
    id: number,
    username: string,
    bsn_address: string,
    phone: string,
    email: string,
    avatar: string,
    real_name: string,
    real_id: string,
    credit: string,
}


declare type OrderStatus = "canceled" | "completed" | "unlinked" | "unpaied"

//todo: 根据后端调整
declare type Order = {
    id: string,
    buyer_id: number,
    product_item_id: string,
    order_status: OrderStatus,
    pay_method: "alipay" | "wechat" | "card",
    gen_credits: number,
    create_at: number,
    pay_at: number,
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

declare type Notice = {
    id: ID,
    text: string,
    link?: string,
}

declare type Banner = {
    id: ID,
    src: string,
    link?: string,
}