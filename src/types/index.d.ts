// todo: 调整type内容，保留最需要的
// todo: 根据后端调整
declare type ID = number | string

declare type Tag = {
    name: string,
    mode?: 'light' | 'dark'
}

declare type Genre = {
    id: ID,
    name: string,
}

declare type Publisher = {
    id: ID,
    name: string,
    avatar: string,
    works?: Product[],
}

declare type Product = {
    id: ID,
    name: string,
    preview_img: string,
    src: string,
    description: string,
    type: "image" | "audio" | "video" | "hybrid" | "3d" | "other",
    genres: Genre[],
    publish_count: number,
    stock_count: number,
    publisher_id: ID,
    publisher: Publisher,
    items?: ProductItem[],
    details: string,
    price: string, // todo: number
    limit: number,
    tags: Tag[],
    sale_timestamp: number;
}

declare type ProductItem = {
    id: ID,
    no: number,
    product: Product,
    bsn_address: string,
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