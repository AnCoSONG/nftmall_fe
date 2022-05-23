<template>
    <Subpage title="收银台">
        <van-skeleton title :row="5" :loading="loading">
            <div class="cashier">
                <div class="order">
                    <van-image
                        class="img"
                        src="https://picsum.photos/150/150"
                    ></van-image>
                    <div class="info">
                        <div class="title">数字藏品测试名称</div>
                        <div class="count">数量 x1</div>
                    </div>
                    <div class="right">
                        <Price
                            :small-size="(px2rem(20) as string)"
                            :integral-size="(px2rem(32) as string)"
                            money-type="¥"
                            :price="'25.50'"
                        />
                    </div>
                </div>
                <div class="pay">
                    <div class="hint">选择支付手段</div>
                    <van-radio-group v-model="pay_method" class="payments">
                        <van-cell-group inset style="width: 100%; margin: 0">
                            <van-cell
                                size="large"
                                title="微信支付"
                                icon="wechat-pay"
                                clickable
                                @click="pay_method = 'wechat'"
                            >
                                <template #right-icon>
                                    <van-radio
                                        name="wechat"
                                        shape="square"
                                        checked-color="#41aa21"
                                    ></van-radio>
                                </template>
                            </van-cell>
                            <van-cell
                                size="large"
                                title="支付宝"
                                icon="alipay"
                                clickable
                                @click="notsupport()"
                            >
                                <template #right-icon>
                                    <van-radio
                                        disabled
                                        name="alipay"
                                        shape="square"
                                        checked-color="#41aa21"
                                    >
                                    </van-radio>
                                </template>
                            </van-cell>
                        </van-cell-group>
                    </van-radio-group>
                </div>
            </div>
            <div class="bottom-bar">
                <div class="total">
                    <div class="hint">合计</div>
                    <div class="money-type">¥</div>
                    <div class="integral">25</div>
                    <div class="fractional">.50</div>
                </div>
                <div class="pay-btn" @click="pay">支付</div>
            </div>
        </van-skeleton>
    </Subpage>
</template>
<script lang="ts">
export default {
    name: "cashier",
};
</script>
<script setup lang="ts">
import { ref, toRef } from "vue";
import { onMountedOrActivated } from "@vant/use";
import { Notify } from "vant";
import { useRouter } from "vue-router";
import Subpage from "../../components/Subpage.vue";
import { px2rem } from "../../utils";
import Price from "../../components/Price.vue";
const router = useRouter();
// 支付相关的功能
// 接受订单号，完成支付
const loading = ref(false);
const props = defineProps({
    id: {
        type: String,
        default: "",
    },
})
const id = toRef(props, "id");
onMountedOrActivated(() => {
    //todo: 进来先检查订单是否支付过，支付过就不允许继续支付，直接跳转回首页
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
    }, 1000);
});

const pay_method = ref("wechat");

const notsupport = () => {
    Notify({ type: "danger", message: "暂不支持支付宝支付" });
};

const pay = async () => {
    // 检查wxbridge，向后端请求下单，拿到订单ID调起微信支付
    // 接着进入等待页面
    // 等待页面请求后端检查订单状态
    //      成功则路由至订单页面，显示最新状态
    //      失败则路由至支付失败页面，支付失败页面会在几秒后路由至订单页面要求用户进行支付

    setTimeout(() => {
        router.push("/payment_waiting");
    }, 500);
};
</script>
<style lang="scss" scoped>
.cashier {
    width: 100%;
    position: relative;

    .order {
        width: 100%;
        display: flex;
        flex-flow: nowrap row;
        justify-content: flex-start;
        align-items: flex-start;
        padding: px2rem(16);
        box-sizing: border-box;
        background-color: $boxBgColorLight;
        border-radius: px2rem(8);
        box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.25);

        .img {
            width: px2rem(72);
            height: auto;
            border-radius: px2rem(4);
            // margin-right: px2rem(16);
            overflow: hidden;
        }

        .info {
            display: flex;
            flex-flow: wrap column;
            justify-content: flex-start;
            align-items: flex-start;
            // font-size: px2rem(16);
            flex: 1;
            margin-left: px2rem(12);
            margin-right: px2rem(12);

            .title {
                font-size: px2rem(18);
                color: $normalTextColor;
                margin-bottom: px2rem(8);
            }

            .count {
                font-size: px2rem(14);
                color: $greyTextColor;
            }
        }

        .right {
            align-self: flex-end;

            .price {
                display: flex;
                flex-flow: nowrap row;
                align-items: baseline;
                justify-content: flex-end;
                font-weight: bold;

                .money-type {
                    font-size: px2rem(20);
                    color: $normalTextColor;
                }

                .integral {
                    font-size: px2rem(28);
                    color: $normalTextColor;
                    // margin-right: px2rem(8);
                }

                .fractional {
                    font-size: px2rem(20);
                    color: $normalTextColor;
                }
            }
        }
    }

    .pay {
        margin-top: px2rem(40);
        display: flex;
        flex-flow: nowrap column;
        justify-content: flex-start;
        align-items: center;
        width: 100%;

        .hint {
            font-size: px2rem(14);
            color: $greyTextColor;
            margin-bottom: px2rem(20);
        }

        .payments {
            // border-radius: px2rem(8);
            width: 100%;
        }
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
    align-items: flex-end;

    .total {
        display: flex;
        flex-flow: nowrap row;
        justify-content: flex-start;
        align-items: baseline;
        font-weight: bold;
        margin-right: px2rem(16);

        .hint {
            font-size: px2rem(14);
            color: $greyTextColor;
            font-weight: normal;
            // margin-bottom: px2rem(20);
            margin-right: px2rem(8);
        }

        .money-type {
            font-size: px2rem(20);
            color: $glodTextColor;
        }

        .integral {
            font-size: px2rem(28);
            color: $glodTextColor;
        }

        .fractional {
            font-size: px2rem(20);
            color: $glodTextColor;
        }
    }

    .pay-btn {
        font-weight: bold;
        box-sizing: border-box;
        font-size: px2rem(18);
        background-color: #d8e0a3;
        color: black;
        padding: px2rem(8) 0;
        text-align: center;
        width: px2rem(120);
        border-radius: px2rem(8);
    }
}
</style>
