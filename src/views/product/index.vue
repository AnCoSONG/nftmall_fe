<template>
    <Subpage title="藏品详情" back-to="/">
        <div class="product" v-if="product">
            <div class="product-preview">
                <van-image class="img" src="https://picsum.photos/400/400" :class="{ loop: notSupport }">
                    <template #loading>
                        <van-loading vertical>加载中</van-loading>
                    </template>
                </van-image>
            </div>
            <div class="timeline box" @click="onStepClick">
                <!-- todo: click 显示时间细则 -->
                <van-steps active-color="#E5E798" :active="currentActive" inactive-color="#888">
                    <van-step>藏品上架</van-step>
                    <van-step>抽签开放</van-step>
                    <van-step>抽签结束</van-step>
                    <van-step>开放抢购</van-step>
                </van-steps>
            </div>
            <div class="product-price-limit box">
                <Price :small-size="(px2rem(20) as string)" :integral-size="(px2rem(32) as string)" money-type="¥"
                    :price="product.price" />

                <div class="limit">
                    每人限购 <b color="gold">{{ product.limit }}</b> 份
                </div>
            </div>
            <div class="product-info box">
                <div class="left">
                    <div class="name">{{ product.name }}</div>
                    <div class="tags">
                        <Tag :data="tag" v-for="tag in product.tags"></Tag>
                    </div>
                </div>
                <div class="right">
                    <div class="type">
                        <TypeIcon :type="product.type"></TypeIcon>
                    </div>
                    <!-- <div class="limit"></div> -->
                </div>
            </div>

            <div class="detail box">
                <div class="title">创作者</div>
                <div class="content">
                    <div class="creator">
                        <van-image class="avatar" round :src="product.publisher.avatar"></van-image>
                        <div class="name">{{ product.publisher.name }}</div>
                    </div>
                </div>
            </div>
            <div class="detail box">
                <div class="title">藏品故事</div>
                <div class="content">
                    <!-- todo: 上COS后图像的地址可能需要映射一下 -->
                    <van-image class="img" v-for="item in product.details" :src="item"></van-image>
                </div>
            </div>
            <div class="must-know box">
                <div class="title">购买须知</div>
                <div class="content">
                    数字藏品为虚拟数字商品，而非实物，仅限实名认真为年满14
                    周岁的中国大陆用户购买。数字藏品的版权由发行方或原创者
                    拥有，除另行取得版权拥有者书面同意外，用户不得将数字藏
                    品用于任何商业用途。本商品一经售出，不支持退换。本商品
                    源文件不支持本地下载。请勿对数字藏品进行炒作、场外交易
                    、欺诈，或以任何其他非法方式进行使用。
                </div>
            </div>
            <div class="bottom-bar">
                <div class="counter">
                    <div class="jian operation" @click="operateCount(-1)">
                        -
                    </div>
                    <div class="num">{{ count }}</div>
                    <div class="jia operation" @click="operateCount(1)">+</div>
                </div>
                <!-- todo 状态体现在按钮上 即将 ｜ 倒计时 ｜ 抽签 ｜ 购买 ｜ 已售罄 -->

                <!-- 抽签前 -->
                <div class="pay-btn" :class="{ disabled: !btnClickable }" @click="onBtnClick">
                    <!-- 敬请期待，倒计时 -->
                    <div v-if="isLoading">
                        <van-loading color="#333" size="18" v-if="btnClickable" />
                        <van-loading color="#ddd" size="18" v-else />
                    </div>
                    <div v-show="!isLoading" class="main-text" :class="{ noCountDown: !isCountdown }">
                        {{ statusText }}
                    </div>
                    <div v-if="isCountdown" class="countdown" v-show="!isLoading">
                        {{
                                `${countDownRef.hours
                                    .toString()
                                    .padStart(2, "0")}:${countDownRef.minutes
                                        .toString()
                                        .padStart(2, "0")}:${countDownRef.seconds
                                            .toString()
                                            .padStart(2, "0")}`
                        }}
                    </div>
                </div>
            </div>
        </div>
    </Subpage>
</template>
<script lang="ts">
export default {
    name: "product",
};
</script>
<script setup lang="ts">
import Subpage from "../../components/Subpage.vue";
import Price from "../../components/Price.vue";
import Tag from "../../components/Tag.vue";
import TypeIcon from "../../components/TypeIcon.vue";
import { px2rem } from "../../utils";
import { useRoute, useRouter } from "vue-router";
import {
    computed,
    getCurrentInstance,
    nextTick,
    onDeactivated,
    ref,
    toRef,
    watch,
    watchEffect,
} from "vue";
import { onMountedOrActivated, useCountDown } from "@vant/use";
import {
    fetchProduct,
    fetchIsDraw,
    participateDraw,
    fetchIsLucky,
    fetchIsPaid,
    get_stock_count,
    seckill,
} from "../../api";
import { Notify, Toast } from "vant";
import dayjs from "dayjs";
import { useUserStore } from "../../stores/user";

// 拿到id获取藏品类别信息
const props = defineProps({
    id: {
        type: String,
        default: "",
    },
});
const user = useUserStore();
const id = toRef(props, "id");
const product = ref<Product>();
const route = useRoute();
const router = useRouter();

if (id.value !== "") {
    const data = await fetchProduct(id.value, true);
    console.log(data);
    if (data) {
        product.value = { ...data };
    } else {
        // 404
        router.push("/404");
    }
}

const xRotate = ref(0);
const yRotate = ref(0);
const notSupport = ref(false);

const handler = function (event: DeviceOrientationEvent) {
    // 只能在https或者localhost下使用
    // gamma: 从左到右
    xRotate.value = event.gamma ?? 0;
    // beta: 从前到后的运动
    yRotate.value = event.beta ?? 0;
};
onMountedOrActivated(async () => {
    // 支持陀螺仪就让用户交互来实现藏品头图变化
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", handler, true);
    } else {
        notSupport.value = true;
    }
});

onDeactivated(() => {
    window.removeEventListener("deviceorientation", handler);
});

const onStepClick = () => {
    Toast({
        type: 'text',
        message: '待实现：展示具体时间'
    })
}

const count = ref(1);
const operateCount = (payload: number) => {
    if (product.value) {
        if (count.value + payload < 1) {
            Toast({
                message: "购买数量不能小于1",
                duration: 1500,
                forbidClick: true,
                icon: "warning-o",
                iconSize: "1.6rem",
            });
            return;
        } else if (count.value + payload > product.value.limit) {
            Toast({
                message: `限购 ${product.value.limit} 份`,
                duration: 1500,
                forbidClick: true,
                icon: "warning-o",
                iconSize: "1.6rem",
            });
            return;
        } else {
            count.value += payload;
        }
    }
    return;
    // todo: 3 is limit, change to limit
};

const currentStage = ref<0 | 1 | 2 | 3 | 4 | 5>(0);

const currentActive = computed(() => {
    if (currentStage.value === 0 || currentStage.value === 1) {
        return 0;
    } else if (currentStage.value === 2) {
        return 1;
    } else if (currentStage.value === 3 || currentStage.value === 4) {
        return 2;
    } else if (currentStage.value === 5) {
        return 3;
    }
});

// 倒计时
const countDown = useCountDown({
    time: 0, // time 后端生成
    onFinish: () => {
        isCountdown.value = false;
        // location.reload();
        // fetch next stage data
    },
});
const countDownRef = countDown.current;
const isCountdown = ref(false);
const isLoading = ref(false);
const btnClickable = ref(false); // 购买位按钮是否可点击
const isDrawn = ref(false);
const isLucky = ref(false);
const isBought = ref(false);
const stock_count = ref(0);
const statusText = ref("");

const fetchDraw = async () => {
    isLoading.value = true;
    if (!user.isLogin) {
        Toast({
            message: "请先登录",
            duration: 1500,
            forbidClick: true,
            icon: "warning-o",
            iconSize: "1.6rem",
        });
        isLoading.value = false;
        return;
    }
    const data = await fetchIsDraw(user.data.id, id.value);
    isLoading.value = false;
    isDrawn.value = data;
};

const fetchLucky = async () => {
    isLoading.value = true;
    if (!user.isLogin) {
        Toast({
            message: "请先登录",
            duration: 1500,
            forbidClick: true,
            icon: "warning-o",
            iconSize: "1.6rem",
        });
        isLoading.value = false;
        return;
    }
    const data = await fetchIsLucky(user.data.id, id.value);
    isLoading.value = false;
    isLucky.value = data;
};

const fetchInit = async () => {
    isLoading.value = true;
    if (!user.isLogin) {
        // * Router已提示
        // Toast({
        //     message: "请先登录",
        //     duration: 1500,
        //     forbidClick: true,
        //     icon: "warning-o",
        //     iconSize: "1.6rem",
        // });
        isLoading.value = false;
        const stockRes = await get_stock_count(id.value, 'redis')
        stock_count.value = stockRes;
        return;
    }
    const [drawRes, luckyRes, paidRes, stockRes] = await Promise.all([
        fetchIsDraw(user.data.id, id.value),
        fetchIsLucky(user.data.id, id.value),
        fetchIsPaid(user.data.id, id.value),
        get_stock_count(id.value, 'redis'),
    ]);
    isLoading.value = false;
    isLucky.value = luckyRes;
    isDrawn.value = drawRes;
    isBought.value = paidRes;
    stock_count.value = stockRes;
    // console.log(stock_count.value);
};

await fetchInit();

watchEffect(() => {
    if (!product.value) {
        statusText.value = "请刷新页面";
        return;
    }
    const now = dayjs().valueOf();
    const draw_timestamp = dayjs(product.value.draw_timestamp).valueOf();
    const draw_end_timestamp = dayjs(
        product.value.draw_end_timestamp
    ).valueOf();
    const sale_timestamp = dayjs(product.value.sale_timestamp).valueOf();
    if (draw_timestamp - now >= 24 * 60 * 60 * 1000) {
        currentStage.value = 0;
        btnClickable.value = false;
        statusText.value = "敬请期待";
    } else if (
        draw_timestamp - now >= 0 &&
        draw_timestamp - now < 24 * 60 * 60 * 1000
    ) {
        currentStage.value = 1;
        btnClickable.value = false;
        countDown.reset(draw_timestamp - now);
        countDown.start();
        isCountdown.value = true;
        statusText.value = "待抽签";
    } else if (draw_end_timestamp - now >= 0) {
        currentStage.value = 2;
        countDown.reset(draw_end_timestamp - now);
        countDown.start();
        isCountdown.value = true;
        if (!user.isLogin) {
            btnClickable.value = false;
            statusText.value = '请先登录'
        } else {
            if (isDrawn.value) {
                btnClickable.value = false;
                statusText.value = "已抽签";
            } else {
                btnClickable.value = true;
                statusText.value = "抽签";
            }
        }
    } else if (now - draw_end_timestamp < 1 * 60 * 1000) {
        // 5分钟内优先展示正在结算
        currentStage.value = 3;
        btnClickable.value = false;
        countDown.reset(draw_end_timestamp + 1 * 60 * 1000 - now);
        countDown.start();
        isCountdown.value = true;
        statusText.value = "正在结算"; // 本质上draw_end_timestamp时就应该已完成结算
    } else if (sale_timestamp - now >= 0) {
        currentStage.value = 4;
        if (!user.isLogin) {
            btnClickable.value = true;
            statusText.value = '请先登录'
        } else {
            if (isLucky.value) {
                countDown.reset(sale_timestamp - now);
                countDown.start();
                isCountdown.value = true;
                btnClickable.value = false;
                statusText.value = "即将发售";
            } else {
                btnClickable.value = false;
                statusText.value = "您未中签";
            }
        }
    } else {
        currentStage.value = 5;
        if (user.isLogin && isBought.value) {
            btnClickable.value = false;
            statusText.value = "已购买";
            return;
        }
        if (stock_count.value === 0) {
            btnClickable.value = false;
            statusText.value = '已售罄'
        } else {
            if (!user.isLogin) {
                btnClickable.value = true;
                statusText.value = '请先登录'
            } else {
                if (!isLucky.value) {
                    btnClickable.value = false;
                    statusText.value = "您无购买资格";
                } else {
                    if (isBought.value) {
                        btnClickable.value = false;
                        statusText.value = "已购买";
                    } else {
                        btnClickable.value = true;
                        statusText.value = "购买";
                    }
                }
            }
        }
    }
});

watch(isDrawn, (val) => {
    if (val && currentStage.value === 2) {
        btnClickable.value = false;
        statusText.value = "已抽签";
        if (product.value) {
            const now = dayjs().valueOf()
            const draw_end_timestamp = dayjs(
                product.value.draw_end_timestamp
            ).valueOf();
            countDown.reset(draw_end_timestamp - now);
            countDown.start();
            isCountdown.value = true;
        }
    }
});

const onBtnClick = async () => {
    if (statusText.value === "抽签") {
        const res = await participateDraw(user.data.id, id.value);
        if (!res) {
            Toast({
                message: "抽签失败",
                duration: 1500,
                forbidClick: true,
                icon: "warning-o",
                iconSize: "1.6rem",
            });
            return;
        }
        if (res.code === 0) {
            Toast({
                message: "抽签成功",
                duration: 1500,
                forbidClick: true,
                icon: "success-o",
                iconSize: "1.6rem",
            });
            await fetchDraw();
        } else {
            Toast({
                message: res.message,
                duration: 1500,
                forbidClick: true,
                icon: "warning-o",
                iconSize: "1.6rem",
            });
        }
    } else if (statusText.value === '购买') {
        const res = await seckill(user.data.id, id.value);
        if (res) {
            if (res.order_id) {
                Toast({
                    message: "已下单",
                    duration: 1500,
                    forbidClick: true,
                    icon: "passed",
                    iconSize: "1.6rem",
                });
                // 生成一个1000 - 1500ms的随机数
                const random = Math.floor(Math.random() * (1500 - 1000 + 1)) + 1000;
                setTimeout(() => {
                    router.push({ path: '/cashier', query: { product_id: id.value, order_id: res.order_id } });
                }, random)
            } else {
                Toast({
                    message: res.message,
                    duration: 1500,
                    forbidClick: true,
                    icon: "warning-o",
                    iconSize: "1.6rem",
                    teleport: '#app'
                });
            }
        } else {
            return null;
        }
    } else if (statusText.value === '请先登录') {
        // console.log(route.path)
        router.push({ name: 'login', params: { backTo: route.path } })
    }
};

// 
</script>
<style lang="scss" scoped>
.product {
    width: 100%;
    position: relative;
    display: flex;
    flex-flow: nowrap column;
    align-items: center;
    justify-content: center;
    margin-bottom: px2rem(72);

    .product-preview {
        margin-top: px2rem(50);
        margin-bottom: px2rem(50);
        // overflow: hidden;
        perspective: px2rem(500);
        transform-style: preserve-3d;
        perspective-origin: 50% 50%;

        .img {
            border: 2px solid #ddd;
            width: px2rem(300);
            min-height: px2rem(200);
            border-radius: px2rem(8);
            overflow: hidden;
            box-shadow: 0 px2rem(4) px2rem(20) rgba(210, 215, 112, 0.25);
            // transform: rotate3d(0, 1, 0, -30deg);
            // transform: rotateX(10deg);

            &.loop {
                animation: rotate 6s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
            }
        }

        @keyframes rotate {
            0% {
                transform: rotateY(-15deg) translateZ(0px);
            }

            // 25% {
            //     transform: rotateY(30deg);
            // }

            50% {
                transform: rotateY(15deg) translateZ(-30px);
            }

            // 75% {
            //     transform: rotateY(-30deg) translateZ(100px);
            // }

            100% {
                transform: rotateY(-15deg) translateZ(0px);
            }
        }
    }

    .box {
        padding: px2rem(12) px2rem(16);
        box-sizing: border-box;
        border-radius: px2rem(8);
        box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.25);
        background-color: $boxBgColor;
        width: 100%;
        margin-bottom: px2rem(20);
    }

    .product-price-limit {
        display: flex;
        flex-flow: nowrap row;
        justify-content: space-between;
        align-items: center;

        .limit {
            color: $greyTextColor;
            font-size: px2rem(16);
        }
    }

    .product-info {
        display: flex;
        flex-flow: nowrap row;
        justify-content: flex-start;
        align-items: flex-start;

        .left {
            flex: 1;
            display: flex;
            flex-flow: wrap column;
            justify-content: flex-start;
            align-items: flex-start;
            overflow: hidden;
            margin-right: px2rem(4);

            .name {
                font-size: px2rem(24);
                font-weight: bold;
                margin-bottom: px2rem(8);
                background: linear-gradient(94.63deg,
                        #e8d9a6 14.59%,
                        #dbc782 92.35%);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                text-fill-color: transparent;
            }

            .tags {
                display: flex;
                flex-flow: wrap row;
                justify-content: flex-start;
                align-items: center;
                font-size: px2rem(12);
            }
        }

        .right {
            // align-self: flex-end;
            display: flex;
            flex-flow: nowrap column;
            justify-content: space-between;
            align-items: flex-end;

            .type {
                font-size: px2rem(18);
                color: $greyTextColor;
                padding: px2rem(4);
                box-sizing: border-box;
                background-color: $backgroundColor;
                border-radius: px2rem(4);
                margin-bottom: px2rem(8);
                box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.25);
            }

            .limit {
                font-size: px2rem(12);
                color: $greyTextColor;
            }
        }
    }

    .creator {
        display: flex;
        flex-flow: nowrap row;
        justify-content: center;
        align-items: center;

        .avatar {
            width: px2rem(22);
            height: px2rem(22);
            overflow: hidden;
            margin-right: px2rem(10);
            border: 1px solid #ddd;
        }

        .name {
            font-size: px2rem(16);
        }
    }

    .detail,
    .must-know {
        display: flex;
        flex-flow: nowrap column;
        justify-content: flex-start;
        align-items: center;

        .title {
            margin-bottom: px2rem(20);
            color: $glodTextColor;
            position: relative;
            font-size: px2rem(20);
            z-index: 0;

            &::after {
                content: "";
                position: absolute;
                bottom: px2rem(-6);
                left: calc(-5%);
                right: calc(-5%);
                background-color: #353535;
                height: px2rem(12);
                z-index: -1;
                // width: 110%;
            }
        }
    }

    .detail {
        .content {
            width: 100%;
            padding-bottom: px2rem(8);
            box-sizing: border-box;

            .img {
                margin-bottom: 0;
                display: block;
                overflow: hidden;

                &:first-child {
                    border-top-left-radius: px2rem(8);
                    border-top-right-radius: px2rem(8);
                }

                &:last-child {
                    border-bottom-left-radius: px2rem(8);
                    border-bottom-right-radius: px2rem(8);
                }
            }
        }
    }

    .must-know {
        .content {
            font-size: px2rem(14);
            color: $greyTextColor;
            line-height: px2rem(18);
            padding-bottom: px2rem(8);
            box-sizing: border-box;
        }
    }

    .bottom-bar {
        position: fixed;
        padding: px2rem(10) px2rem(17);
        box-sizing: border-box;
        bottom: 0;
        left: 0;
        width: 100%;
        height: px2rem(60);
        right: 0;
        background-color: black;
        box-shadow: 0 px2rem(-4) px2rem(4) rgba(0, 0, 0, 0.25);

        display: flex;
        flex-flow: nowrap row;
        justify-content: flex-end;
        align-items: center;

        .counter {
            margin-right: px2rem(20);
            display: flex;
            flex-flow: nowrap row;
            justify-content: center;
            align-items: center;
            height: px2rem(40);

            .operation {
                background-color: #353535;
                font-size: px2rem(16);
                height: 100%;
                color: white;
                padding: px2rem(8) px2rem(12);
                font-weight: bold;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .jian {
                border-top-left-radius: px2rem(8);
                border-bottom-left-radius: px2rem(8);
            }

            .jia {
                border-top-right-radius: px2rem(8);
                border-bottom-right-radius: px2rem(8);
            }

            .num {
                height: 100%;
                padding: px2rem(6) px2rem(12);
                // padding: px2rem(16);
                background-color: #c4c4c4;
                color: black;
                font-size: px2rem(18);
                box-sizing: border-box;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                width: px2rem(42);
            }
        }

        .pay-btn {
            // font-weight: bold;
            font-size: px2rem(18);
            background-color: #d8e0a3;
            color: black;
            padding: 0 px2rem(8);
            box-sizing: border-box;
            text-align: center;
            min-width: px2rem(120);
            border-radius: px2rem(8);
            height: 100%;
            display: flex;
            flex-flow: nowrap column;
            align-items: center;
            justify-content: center;

            .main-text {
                font-weight: bold;
                font-size: px2rem(16);
                letter-spacing: px2rem(4);
                text-indent: px2rem(4);
                // flex: 1;

                &.noCountDown {
                    font-size: px2rem(18);
                }
            }

            .countdown {
                font-size: px2rem(12);
            }

            &.disabled {
                .main-text {
                    font-weight: bold;
                }

                background-color: #444;
                color: #c4c4c4;
            }
        }
    }
}
</style>
