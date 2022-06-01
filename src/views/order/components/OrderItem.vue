<template>
    <div class="order-item">
        <div class="product-wrapper" :class="{ withBottomRadius: order_status === 'canceled' }">
            <div class="purchase-info">
                <van-image class="img" :src="data.product_item?.product?.preview_img" fit="cover">
                    <template #loading>
                        <ImageLoader></ImageLoader>
                    </template>
                </van-image>
                <div class="info">
                    <div class="title">
                        {{ data.product_item?.product?.name }}
                    </div>
                    <div class="tags">
                        <Tag v-for="item in data.product_item?.product?.tags" :data="item" />
                    </div>
                </div>
                <div class="right">
                    <div class="status" :data-status="order_status">
                        {{ statusText }}
                    </div>
                    <div class="count">
                        <!-- 数量 -->
                        数量: x1
                    </div>
                </div>
            </div>
            <Price :small-size="(px2rem(20) as string)" :integral-size="(px2rem(32) as string)" money-type="¥"
                :price="data.sum_price" />
        </div>
        <div class="controls" :class="{ inactive: order_status === 'canceled' }">
            <div class="btn detail-btn"
                v-if="order_status != 'unpaid' && order_status != 'error' && order_status != 'canceled'"
                @click="router.push(`/order/${data.id}`)">
                详情
            </div>
            <div class="btn pay-btn" v-if="order_status === 'unpaid'" @click="onPayBtnClick">
                支付
            </div>
            <div class="btn cancel-btn" v-if="order_status === 'unpaid'" @click="onCancelBtnClick">
                取消
            </div>
        </div>
        <div class="notification" :class="{ active: order_status === 'unpaid' }">
            <div class="wrapper">
                请于 {{
                        countDownRef.minutes.toString().padStart(2, '0') + ':' + countDownRef.seconds.toString().padStart(2,
                            '0')
                }} 前完成支付
                <!-- <van-count-down :time="lastTime" ref="thisCountDown" @change="onChange" :auto-start="true">
                    <template #default="timedata">
                        <div class="text">请于 {{ timedata.minutes.toString().padStart(2, '0') }}:{{
                                timedata.seconds.toString().padStart(2, '0')
                        }} 前完成支付</div>
                    </template>
                </van-count-down> -->
            </div>

        </div>
    </div>
</template>
<script setup lang="ts">
import { onMountedOrActivated, useCountDown } from "@vant/use";
import { computed, ref, toRef, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { onChainStatus, PaymentStatus, px2rem } from "../../../utils";
import Price from "../../../components/Price.vue";
import Tag from "../../../components/Tag.vue";
import dayjs from "dayjs";
import ImageLoader from "../../../components/ImageLoader.vue";
import { cancelOrder, fetchProductItemDetail } from "../../../api";
import { CountDownInstance, Dialog, Toast } from 'vant'

type PropType = {
    data: Order;
};
const props = defineProps<PropType>();
const emit = defineEmits(['needRefresh'])
const data = toRef(props, "data");
const beginFlag = ref(false);
const countDown = useCountDown({
    time: 1000 * 60 * 5, // time 后端生成
    onFinish: () => {
        console.log('in finish')
        if (data.value.payment_status === PaymentStatus.UNPAID) {
            data.value.payment_status = PaymentStatus.CANCELED;
            Toast({
                type: 'fail',
                message: '订单超时，已取消'
            })
        }
        // if (beginFlag.value) {
        //     console.log('finish')
        // } else {
        //     console.log('ignore')
        //     beginFlag.value = true;
        // }
        // Toast({
        //     message: 'finish'
        // })
    },
    onChange: (current) => {
        // console.log(current)
    }
});
const countDownRef = countDown.current;
onMountedOrActivated(() => {
    if (data.value.payment_status === 'unpaid') {
        countDown.reset(dayjs(data.value.create_date).valueOf() + 10 * 60 * 1000 - dayjs().valueOf())
        countDown.start();
    }
});
const order_status = computed(() => {
    if (data.value.payment_status === PaymentStatus.UNPAID) {
        return "unpaid"
    } else if (data.value.payment_status === PaymentStatus.CANCELED) {
        return "canceled";
    } else {
        if (!data.value.product_item) {
            return "error";
        }
        if (data.value.product_item.on_chain_status === onChainStatus.PENDING) {
            return "pending"
        } else if (data.value.product_item.on_chain_status === onChainStatus.FAILED) {
            return "retrying"
        } else if (data.value.product_item.on_chain_status === onChainStatus.PROCESSING) {
            return "processing";
        } else if (data.value.product_item.on_chain_status === onChainStatus.SUCCESS) {
            return "success"
        }
    }
})
const statusText = computed(() => {
    if (data.value.payment_status === PaymentStatus.UNPAID) {
        return "待支付";
    } else if (data.value.payment_status === PaymentStatus.CANCELED) {
        return "已取消";
    } else {
        if (!data.value.product_item) {
            return "错误"
        }
        if (data.value.product_item.on_chain_status === onChainStatus.PENDING) {
            return "待上链";
        } else if (data.value.product_item.on_chain_status === onChainStatus.FAILED) {
            return "上链暂停"
        } else if (data.value.product_item.on_chain_status === onChainStatus.PROCESSING) {
            return "正在上链"
        } else if (data.value.product_item.on_chain_status === onChainStatus.SUCCESS) {
            return "已上链"
        }
    }
});
// const lastTime = ref(99999999)

// watchEffect(() => {
//     lastTime.value = dayjs(data.value.create_date).valueOf() + 10 * 60 * 1000 - dayjs().valueOf()
// })

if (!data.value.product_item) {
    const product_item_data = await fetchProductItemDetail(data.value.backup_product_item_id!, true)
    if (product_item_data) {
        data.value.product_item = product_item_data;
    }
}

const onPayBtnClick = () => {
    if (data.value.product_item) {
        router.push({ path: '/cashier', query: { product_id: data.value.product_item.product_id, order_id: data.value.id } })
    } else {
        Toast({
            type: 'fail',
            message: '参数错误'
        })
    }
}

const onCancelBtnClick = () => {
    if (data.value.product_item) {
        Dialog.confirm({
            title: '确定取消？',
            message: '取消后您可以再前往藏品页面购买,但也可能会因为售罄无法购买。',
            cancelButtonText: '再想想'
        }).then(async () => {
            // 请求取消接口
            const res = await cancelOrder(data.value.id)
            if (res) {
                Toast({
                    type: 'success',
                    message: '取消成功',
                    duration: 750
                })
                // 
                setTimeout(() => {
                    emit('needRefresh')
                }, 500)
            }
        }).catch(() => {
            // 什么都不发生
        })
    } else {
        Toast({
            type: 'fail',
            message: '参数错误'
        })
    }
}

const router = useRouter();
</script>
<style lang="scss" scoped>
.order-item {
    position: relative;
    width: 100%;
    margin-bottom: px2rem(30);

    .product-wrapper {
        border-top-left-radius: px2rem(8);
        border-top-right-radius: px2rem(8);
        padding: px2rem(16) px2rem(16);
        box-sizing: border-box;
        display: flex;
        flex-flow: nowrap column;
        background-color: $boxBgColor;
        box-shadow: 0 px2rem(4) px2rem(4) 0 rgba(0, 0, 0, 0.25);

        .purchase-info {
            display: flex;
            flex-flow: nowrap row;
            justify-content: flex-start;
            align-items: flex-start;
            // height: max-content;

            &.withBottomRadius {
                border-bottom-left-radius: px2rem(8);
                border-bottom-right-radius: px2rem(8);
            }

            .img {
                width: px2rem(84);
                height: px2rem(84);
                border-radius: px2rem(4);
                overflow: hidden;
            }

            .info {
                margin: 0 px2rem(16);
                flex: 1;
                display: flex;
                flex-flow: nowrap column;
                justify-content: flex-start;
                align-items: flex-start;

                .title {
                    font-size: px2rem(20);
                    font-weight: bold;
                    margin-bottom: px2rem(12);
                }

                .tags {
                    display: flex;
                    flex-flow: row wrap;
                    justify-content: flex-start;
                    align-items: center;
                    margin-bottom: px2rem(8);

                    .tag {
                        font-size: px2rem(10);
                    }
                }
            }

            .right {
                display: flex;
                flex-flow: nowrap column;
                justify-content: flex-start;
                align-items: flex-end;

                .status {
                    font-size: px2rem(16);

                    &[data-status="unpaid"],
                    &[data-status="retring"] {
                        color: $lightRedColor;
                    }

                    &[data-status="pending"],
                    &[data-status="processing"] {
                        color: $successColor;
                    }

                    &[data-status="canceled"] {
                        color: $greyTextColor;
                    }

                    &[data-status="success"] {
                        color: $glodTextColor;
                    }
                }

                .count {
                    margin-top: px2rem(12);
                    color: $greyTextColor;
                    font-size: px2rem(12);
                }
            }
        }

        .price {
            // text-align: right;
            display: flex;
            flex-flow: nowrap row;
            align-items: baseline;
            justify-content: flex-end;
            font-weight: bold;

            .money-type {
                font-size: px2rem(20);
            }

            .integral {
                font-size: px2rem(32);
            }

            .fractional {
                font-size: px2rem(20);
            }
        }
    }

    .controls {
        border-top: 1px dashed #3d3d3d;
        padding: px2rem(12) px2rem(16);
        box-sizing: border-box;
        font-size: px2rem(16);
        display: flex;
        flex-flow: nowrap row-reverse;
        justify-content: flex-start;
        align-items: center;
        background-color: $boxBgColor;
        border-bottom-right-radius: px2rem(8);
        border-bottom-left-radius: px2rem(8);
        box-shadow: 0 px2rem(4) px2rem(4) 0 rgba(0, 0, 0, 0.25);

        &.inactive {
            border-top: none;
            display: none;
        }

        .btn {
            padding: px2rem(8) px2rem(16);
            border-radius: px2rem(4);
            box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.25);
            margin-left: px2rem(12);

            &.pay-btn {
                background-color: $lightRedColor;
            }

            &.detail-btn {
                background-color: #3471da;
            }
        }
    }

    .notification {
        width: 100%;
        padding: px2rem(10) px2rem(57);
        box-sizing: border-box;
        display: none;

        &.active {
            display: block;
        }

        .wrapper {
            text-align: center;
            padding: px2rem(4);
            box-sizing: border-box;
            border-radius: px2rem(4);
            background-color: $lightRedColor;
            color: $normalTextColor;
            font-size: px2rem(16);

            .text {
                color: $normalTextColor;
                font-size: px2rem(16);
            }
        }
    }
}
</style>
