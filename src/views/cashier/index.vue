<template>
    <Subpage title="收银台">
        <van-skeleton title :row="5" :loading="loading || !product || !order">
            <div class="cashier">
                <div class="order">
                    <van-image class="img" :src="product?.preview_img">
                        <template #loading>
                            <ImageLoader />
                        </template>
                    </van-image>
                    <div class="info">
                        <div class="title">{{ product?.name ?? '加载中' }}</div>
                        <div class="count">数量 x1</div>
                    </div>
                    <div class="right">
                        <Price :small-size="(px2rem(20) as string)" :integral-size="(px2rem(32) as string)"
                            money-type="¥" :price="product?.price ?? '0.00'" />
                    </div>
                </div>
                <div class="pay">
                    <div class="hint">选择支付手段</div>
                    <van-radio-group v-model="order!.pay_method" class="payments">
                        <van-cell-group inset style="width: 100%; margin: 0">
                            <van-cell size="large" title="微信支付" icon="wechat-pay" clickable
                                @click="changePayMethod('weixin')">
                                <template #right-icon>
                                    <van-radio name="weixin" shape="square" checked-color="#41aa21"></van-radio>
                                </template>
                            </van-cell>
                            <van-cell size="large" title="支付宝" icon="alipay" clickable
                                @click="changePayMethod('alipay')">
                                <template #right-icon>
                                    <van-radio disabled name="alipay" shape="square" checked-color="#41aa21">
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
                    <Price :small-size="(px2rem(20) as string)" :integral-size="(px2rem(32) as string)" money-type="¥"
                        :price="order?.sum_price ?? '0.00'" />
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
import { Dialog, Notify, Toast } from "vant";
import ImageLoader from "../../components/ImageLoader.vue";
import { useRouter } from "vue-router";
import Subpage from "../../components/Subpage.vue";
import { px2rem, redirectForOpenid } from "../../utils";
import Price from "../../components/Price.vue";
import { fetchOrderDetail, fetchProduct, requestPay } from "../../api";
import { useAppStore } from "../../stores/app";
import { useUserStore } from "../../stores/user";
const router = useRouter();
const app = useAppStore();
const user = useUserStore();
// 支付相关的功能
// 接受订单号，完成支付
const loading = ref(false);
const props = defineProps({
    order_id: {
        type: String,
        default: "",
    },
    product_id: {
        type: String,
        default: "",
    }
})
const order = ref<Order>();
const product = ref<Product>();
const order_id = toRef(props, "order_id");
const product_id = toRef(props, "product_id")
// if (app.isWx && app.openid === '') {
//     // 如果是微信且用户没有Openid，重定向
//     redirectForOpenid()
// }
onMountedOrActivated(async () => {
    //todo: 进来先检查订单是否支付过，支付过就不允许继续支付，直接跳转回首页
    loading.value = true;
    const [orderRes, productRes] = await Promise.all([fetchOrderDetail(order_id.value, false), fetchProduct(product_id.value, false)])
    if (orderRes) {
        order.value = orderRes
    } else {
        Toast({
            type: 'fail',
            message: '订单信息获取失败',
        })
    }
    if (productRes) {
        product.value = productRes;
    } else {
        Toast({
            type: 'fail',
            message: '藏品信息获取失败'
        })
    }
    loading.value = false;
});

const changePayMethod = (pay_method: SupportPayment) => {
    if (pay_method == 'alipay') {
        Toast({ type: "fail", message: "暂不支持支付宝支付" });
    } else {
        if (order.value) {
            order.value.pay_method = pay_method
        } else {
            Toast({
                type: 'fail',
                message: '订单不存在'
            })
        }
    }
}

const jspay = (payload: WeixinJSBridge.WxBridgeInvoke) => {
    return new Promise((resolve, reject) => {
        WeixinJSBridge.invoke('getBrandWCPayRequest', payload, (res: { err_msg: string }) => {
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                // 使用以上方式判断前端返回,微信团队郑重提示：
                //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                resolve('success')
            } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
                resolve('cancel');
            } else {
                reject(res.err_msg)
            }
        })
    })
}

// todo: 待验证逻辑
const pay = async () => {
    // 检查wxbridge，向后端请求下单，拿到订单ID调起微信支付
    // 接着进入等待页面
    // 等待页面请求后端检查订单状态
    //      成功则路由至订单页面，显示最新状态
    //      失败则路由至支付失败页面，支付失败页面会在几秒后路由至订单页面要求用户进行支付
    if (!app.isWx) {
        Toast({
            type: 'fail',
            message: '当前仅支持在微信浏览器内完成支付！'
        })
        return;
    }
    if (!order.value) {
        Toast({
            type: 'fail',
            message: '加载失败'
        })
        return;
    }
    const toastInstance = Toast.loading({
        forbidClick: true,
        message: '请稍等...',
        duration: 0
    })
    if (!user.data.wx_openid) {
        toastInstance.clear()
        Dialog.confirm({
            title: '提示',
            message: '因微信限制，您需要先完成微信绑定才能使用微信支付。请放心，您购买的藏品将为您保留10分钟。',
            confirmButtonText: '前往绑定',
            cancelButtonText: '稍后绑定'
        }).then(() => {
            router.replace('/account')
        }).catch(() => {
            router.replace('/order')
        })
        return;
    }
    // console.log(app.openid)
    const res = await requestPay(order.value.id, 'jsapi', user.data.wx_openid)
    if (res) {
        // 下单成功
        // h5 支付 跳转至 h5_url
        if (res.h5_url) {
            window.open(res.h5_url, '_blank') // 打开新页面deeplink唤起微信
        } else {
            const jspay_res = await jspay({ appId: res.appId, timeStamp: res.timeStamp, nonceStr: res.nonceStr, package: res.package, signType: res.signType, paySign: res.paySign }).catch(err => {
                console.error(err);
                toastInstance.message = '支付失败';
                setTimeout(() => {
                    toastInstance.clear()
                }, 1000)
            })
            if (jspay_res == 'success') {
                setTimeout(() => {
                    toastInstance.clear()
                    // 用户完成支付
                    router.replace({ path: '/payment_waiting', query: { order_id: order.value?.id, trade_no: order.value?.trade_no } })
                }, 500)
            } else if (jspay_res == 'cancel') {
                // 用户取消支付
                toastInstance.message = '您已取消支付';
                setTimeout(() => {
                    toastInstance.clear()
                    router.replace('/order')
                }, 500)
            }
        }
        // setTimeout(() => {
        //     router.push("/payment_waiting");
        // }, 500);
    } else {
        router.replace('/') //回到首页
    }

};
</script>
<style lang="scss" scoped>
.cashier {
    width: 100%;
    margin-top: px2rem(10);
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
