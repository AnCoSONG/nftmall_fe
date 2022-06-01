<template>
    <!-- todo: 待实现 -->
    <Subpage title="订单详情">
        <van-skeleton title avatar :row="10" :loading="!orderDetail">
            <div class="order-detail" v-if="orderDetail">
                <div class="order-detail-card">
                    <div class="product-info">
                        <van-image class="thumbnail" :width="px2rem(100)" height="auto" fit="contain"
                            :src="orderDetail.product_item?.product?.preview_img">
                            <template #loading>
                                <ImageLoader></ImageLoader>
                            </template>
                            </van-image>
                        <div class="name-tag-count">
                            <div class="name">{{ orderDetail.product_item?.product?.name }}</div>
                            <div class="tags">
                                <Tag :data="item" v-for="item in orderDetail.product_item?.product?.tags" />
                            </div>
                            <!-- 目前只能购买一个 -->
                            <div class="count">数量 x1</div>
                        </div>
                    </div>
                    <div class="sum-price">
                        <div class="sum-text">合计</div>
                        <Price money-type="¥" :price="orderDetail.sum_price" :small-size="(px2rem(24) as string)"
                            :integral-size="(px2rem(32) as string)"></Price>
                    </div>
                    <div class="order-info-wrapper">
                        <div class="order-info">
                            <KeyValueLine key-text="订单ID" :value="orderDetail.id" :copy="true" />
                            <KeyValueLine key-text="订单交易号" :value="orderDetail.trade_no" :copy="true" />
                            <KeyValueLine key-text="订单状态" :value="orderStatus ?? '...'" :copy="false" />
                            <KeyValueLine key-text="订单创建时间" :value="orderCreateTimeFormat ?? '...'" :copy="false" />
                            <KeyValueLine key-text="订单支付时间" :value="orderPayTimeFormat ?? '...'" :copy="false" />
                            <KeyValueLine key-text="藏品上链时间" :value="productOnChainTimeFormat ?? '...'" :copy="false" />
                            <KeyValueLine key-text="积分" :value="orderDetail.gen_credit" :copy="false" />
                        </div>
                    </div>
                    <div class="controls">
                        <div class="control" @click="notSupport">发送订单详情至邮箱</div>
                        <div class="control" @click="encounterProblem">遇到问题?</div>
                    </div>
                </div>
            </div>
        </van-skeleton>
    </Subpage>
</template>
<script lang="ts">
export default {
    name: "order-detail",
};
</script>
<script setup lang='ts'>
import { computed, ref, toRef } from 'vue';
import { fetchOrderDetail } from '../../api';
import { onMountedOrActivated } from '@vant/use';
import Subpage from '../../components/Subpage.vue';
import { onChainStatus, px2rem, TIME_FORMAT, notSupport } from '../../utils';
import { Dialog, Toast } from 'vant';
import Tag from '../../components/Tag.vue';
import Price from '../../components/Price.vue';
import ImageLoader from '../../components/ImageLoader.vue';
import KeyValueLine from '../../components/KeyValueLine.vue';
import dayjs from 'dayjs';

const props = defineProps({
    id: {
        type: String,
        default: '',
    },
})
const id = toRef(props, 'id')
const loading = ref(true)
const orderDetail = ref<Order>()
onMountedOrActivated(async () => {
    const res = await fetchOrderDetail(id.value, true)
    if (res) {
        orderDetail.value = res;
    } else {
        Toast({
            type: 'fail',
            message: '订单信息获取失败',
        })
    }
    loading.value = false;
})
const orderStatus = computed(() => {
    // 进入详情页只能是支付完成后，只能显示链状态
    if (orderDetail.value) {
        if (orderDetail.value.product_item?.on_chain_status === onChainStatus.FAILED) {
            return "上链暂停"
        } else if (orderDetail.value.product_item?.on_chain_status === onChainStatus.PENDING) {
            return "待上链"
        } else if (orderDetail.value.product_item?.on_chain_status === onChainStatus.PROCESSING) {
            return "正在上链"
        } else if (orderDetail.value.product_item?.on_chain_status === onChainStatus.SUCCESS) {
            return "已上链"
        }
    }
})

const orderCreateTimeFormat = computed(() => {
    if (orderDetail.value) {
        return dayjs(orderDetail.value.create_date).format(TIME_FORMAT)
    }
})

const orderPayTimeFormat = computed(() => {
    if (orderDetail.value) {
        return dayjs(orderDetail.value.pay_timestamp).format(TIME_FORMAT)
    }
})

const productOnChainTimeFormat = computed(() => {
    if (orderDetail.value && orderDetail.value.product_item && orderDetail.value.product_item.on_chain_timestamp) {
        return dayjs(orderDetail.value.product_item.on_chain_timestamp).format(TIME_FORMAT)
    }
})

const encounterProblem = () => {
    Dialog.alert({
        title: '遇到问题',
        message: '请您至个人页面添加客服微信，并将订单交易号提供给客服。'
    })
}
</script>
<style lang="scss" scoped>
.order-detail {
    padding-top: px2rem(20);

    .order-detail-card {
        border-radius: px2rem(8);
        box-shadow: 0 px2rem(4) px2rem(4) 0 rgba(0, 0, 0, .25);
        background-color: $boxBgColorLight;
        display: flex;
        flex-flow: nowrap column;
        justify-content: flex-start;
        overflow: hidden;

        .product-info {
            padding: px2rem(17);
            box-sizing: border-box;
            display: flex;
            flex-flow: nowrap row;
            justify-content: flex-start;
            align-items: flex-start;
            ;

            .thumbnail {
                min-height: px2rem(60);
                max-width: px2rem(100);
                max-height: px2rem(100);
                margin-right: px2rem(17);
                border-radius: px2rem(6);
                overflow: hidden;
            }

            .name-tag-count {
                font-size: px2rem(18);
                flex: 1;
                display: flex;
                flex-flow: nowrap column;
                justify-content: flex-start;
                align-items: flex-start;

                .name {
                    margin-bottom: px2rem(6);
                }

                .tags {
                    font-size: px2rem(10);
                    display: flex;
                    flex-flow: wrap row;
                    justify-content: flex-start;
                    align-items: center;
                }

                .count {
                    font-size: px2rem(12);
                    color: $greyTextColor;

                }
            }
        }

        .sum-price {
            padding: px2rem(17);
            padding-top: 0;
            width: 100%;
            box-sizing: border-box;
            align-self: flex-end;
            display: flex;
            flex-flow: nowrap row;
            justify-content: flex-end;
            align-items: baseline;

            .sum-text {
                font-size: px2rem(16);
                color: $greyTextColor;
                margin-right: px2rem(8);
            }
        }

        .order-info-wrapper {
            padding: px2rem(17);
            padding-top: 0;
            box-sizing: border-box;

            .order-info {
                border-top: 1px dashed #464646;
                padding-top: px2rem(17);
                box-sizing: border-box;
                font-size: px2rem(14);
                color: $normalTextColor;

                display: flex;
                flex-flow: nowrap column;
                justify-content: flex-start;
                align-items: stretch;

                .info-line {
                    display: flex;
                    flex-flow: nowrap row;
                    justify-content: space-between;
                    align-items: center;

                    .value {
                        max-width: px2rem(200);
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }

                }

            }
        }

        .controls {
            // border-top: 1px solid #464646;
            font-size: px2rem(18);
            color: $normalTextColor;
            

            .control {
                border-top: 1px solid #464646;
                padding: px2rem(17);
                text-align: center;
                font-weight: lighter;
                width: 100%;
                user-select: none;
                box-sizing: border-box;
                

                &:active {
                    background-color: #464646;
                }
            }
        }
    }
}
</style>