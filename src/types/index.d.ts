// todo: 调整type内容，保留最需要的
// todo: 根据后端调整
declare type Tag = {
    name: string;
    mode?: DisplayMode;
};

declare type SupportPayment = "weixin" | "alipay";
declare type PaymentStatus = "unpaid" | "paid" | "canceled"
declare type onChainStatus = "success" | "processing" | "failed" | "pending"

declare type Genre = {
    id: number;
    name: string;
};

declare type Publisher = {
    id: string;
    name: string;
    avatar: string;
    works?: Product[];
};

declare type Product = {
    id: string;
    name: string;
    preview_img: string; // 首页藏品卡片预览资源
    preview_src: string; // 藏品预览资源（购买页、详情页）
    src: string; // 藏品真实资源
    description: string;
    type: SupportType;
    genres: Genre[];
    publish_count: number;
    stock_count: number;
    publisher_id: ID;
    publisher?: Publisher;
    items?: ProductItem[];
    details: string[];
    price: string;
    limit: number;
    tags: Tag[];
    nft_class_id?: string;
    operation_id?: string;
    tx_hash?: string;
    sale_timestamp: string;
    draw_timestamp: string;
    draw_end_timestamp: string;
    create_date: string;
};

declare type ProductItem = {
    id: string;
    no: number;
    product_id: string;
    product?: Product;
    owner_id?: number;
    owner?: User;
    nft_id?: string; // 链上ID 上链后才有 前端先 根据订单支付时间来判断是否已支付，根据nft_id来判断是否已上链
    nft_class_id?: string;
    operation_id?: string;
    tx_hash?: string;
    on_chain_status: onChainStatus;
    on_chain_timestamp?: string;
};

declare type User = {
    id: number;
    username: string;
    bsn_address?: string;
    phone: string;
    email: string;
    avatar: string;
    real_name?: string;
    real_id?: string;
    is_verified: boolean;
    credit: number;
};

//todo: 根据后端调整
declare type Order = {
    id: string;
    trade_no: string;
    buyer_id: number;
    buyer?: User;
    product_item_id?: string;
    product_item?: ProductItem;
    backup_product_item_id?: string;
    pay_timestamp?: Date;
    sum_price: string;
    gen_credit: number;
    out_payment_id?: string | null; // 外部订单号，比如微信支付订单号
    pay_method: SupportPayment;
    payment_status: PaymentStatus;
    create_date: string;
};

declare type Notice = {
    id: ID;
    text: string;
    link?: string;
};

declare type Banner = {
    id: ID;
    src: string;
    link?: string;
};


