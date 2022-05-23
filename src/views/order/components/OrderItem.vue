<template>
    <div class="order-item">
        <div
            class="product-wrapper"
            :class="{ withBottomRadius: data.order_status === 'canceled' }"
        >
            <div class="purchase-info">
                <van-image
                    class="img"
                    :src="data.purchase_item.product.preview_img"
                    fit="cover"
                />
                <div class="info">
                    <div class="title">
                        {{ data.purchase_item.product.name }}
                    </div>
                    <div class="tags">
                        <Tag
                            v-for="item in data.purchase_item.product.tags"
                            :data="item"
                        />
                    </div>
                </div>
                <div class="right">
                    <div class="status" :data-status="data.order_status">
                        {{ statusText }}
                    </div>
                    <div class="count">
                        数量: x{{ data.purchase_item.count }}
                    </div>
                </div>
            </div>
            <Price
                :small-size="(px2rem(20) as string)"
                :integral-size="(px2rem(32) as string)"
                money-type="¥"
                :price="data.purchase_item.product.price!"
            />
        </div>
        <div
            class="controls"
            :class="{ inactive: data.order_status === 'canceled' }"
        >
            <div
                class="btn detail-btn"
                v-if="data.order_status != 'unpaied'"
                @click="router.push(`/order/${data.id}`)"
            >
                详情
            </div>
            <div class="btn pay-btn" v-if="data.order_status === 'unpaied'">
                支付
            </div>
        </div>
        <div
            class="notification"
            :class="{ active: data.order_status === 'unpaied' }"
        >
            <div class="wrapper">
                请于
                {{
                    countDownRef.minutes + ":" + countDownRef.seconds
                }}
                前完成支付
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMountedOrActivated, useCountDown } from "@vant/use";
import { computed, toRef } from "vue";
import { useRouter } from "vue-router";
import { px2rem } from "../../../utils";
import Price from "../../../components/Price.vue";
import Tag from "../../../components/Tag.vue";

type PropType = {
    data: Order;
};
const props = defineProps<PropType>();
const data = toRef(props, "data");
const countDown = useCountDown({
    time: 1000 * 60 * 5, // time 后端生成
});

const statusText = computed(() => {
    if (data.value.order_status === "unpaied") {
        return "待支付";
    } else if (data.value.order_status === "canceled") {
        return "已取消";
    } else if (data.value.order_status === "unlinked") {
        return "待上链";
    } else {
        return "已完成";
    }
});
const countDownRef = countDown.current;
onMountedOrActivated(() => {
    countDown.start();
});

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

                    &[data-status="unpaied"] {
                        color: $lightRedColor;
                    }

                    &[data-status="unlinked"] {
                        color: $successColor;
                    }

                    &[data-status="canceled"] {
                        color: $greyTextColor;
                    }

                    &[data-status="completed"] {
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
        }
    }
}
</style>
