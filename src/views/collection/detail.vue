<template>
    <Subpage title="藏品详情" shareable back-to="/collection" @on-share-click="() => onShareClickCallback()">
        <van-skeleton :loading="!productItemData" :row="10">
            <div class="collection-detail" v-if="productItemData">
                <img src="https://mall-1308324841.file.myqcloud.com/productBg3.png" class="product-bg" alt=""
                    :style="{ opacity: bgLoaded ? 1 : 0 }" @load="bgLoaded = true" />
                <ProductViewer :src="productItemData.product?.src!" :backup_img="productItemData.product?.preview_img!"
                    :rotate_mode="0"></ProductViewer>
                <div class="box">
                    <div class="product-item-name">
                        {{ productItemData.product?.name ?? '...' }}
                    </div>
                    <div class="product-item-no">
                        {{ noText ?? '...' }}
                    </div>
                </div>
                <div class="box">
                    <van-image class="avatar" :src="productItemData.product?.publisher?.avatar" round>
                        <template #loading>
                            <ImageLoader></ImageLoader>
                        </template>
                    </van-image>
                    <div class="text">创作者：{{ productItemData.product?.publisher?.name }}</div>
                </div>
                <div class="detail box">
                    <div class="title">藏品故事</div>
                    <div class="content">
                        <van-image class="img" v-for="item in productItemData.product!.details" :src="item">
                            <template #loading>
                                <ImageLoader />
                            </template>
                        </van-image>
                    </div>
                </div>
                <div class="box collection-info">
                    <KeyValueLine key-text="藏品名" :value="productItemData.product?.name ?? '...'" :copy="false" />
                    <KeyValueLine key-text="藏品类别" :value="typeText ?? '...'" :copy="false" />
                    <KeyValueLine key-text="藏品ID" :value="productItemData.product_id ?? '...'" :copy="true" />
                    <KeyValueLine key-text="发行方" :value="'晋元数字'" :copy="false" />
                    <KeyValueLine key-text="创作方" :value="productItemData.product?.publisher?.name ?? '...'"
                        :copy="false" />
                    <KeyValueLine key-text="藏品铸造时间" :value="productOnChainTimeFormat ?? '...'" :copy="false" />
                    <KeyValueLine key-text="拥有者" :value="productItemData.owner?.username ?? '...'" :copy="false" />
                    <KeyValueLine key-text="拥有者钱包地址" :value="productItemData.owner?.bsn_address ?? '...'"
                        :copy="true" />
                    <KeyValueLine key-text="上链状态" :value="onChainStatusText ?? '...'" :copy="true" />
                    <KeyValueLine key-text="藏品系列链上ID" :value="productItemData.nft_class_id ?? '...'" :copy="true" />
                    <KeyValueLine key-text="藏品链上ID" :value="productItemData.nft_id ?? '...'" :copy="true" />
                    <KeyValueLine key-text="藏品链上交易ID" :value="productItemData.operation_id ?? '...'" :copy="true" />
                    <KeyValueLine key-text="交易哈希" :value="productItemData.tx_hash ?? '...'" :copy="true" />
                </div>
            </div>

        </van-skeleton>
    </Subpage>
</template>
<script lang="ts">
export default {
    name: "collection-detail",
};
</script>
<script setup lang='ts'>
import dayjs from 'dayjs';
import { computed, onDeactivated, ref, toRef } from 'vue';
import Subpage from '../../components/Subpage.vue';
import ProductViewer from '../../components/ProductViewer.vue';
import { onMountedOrActivated } from '@vant/use'
import ImageLoader from '../../components/ImageLoader.vue';
import KeyValueLine from '../../components/KeyValueLine.vue';
import { fetchProductItemDetail } from '../../api';
import { onChainStatus, setupProtection, SupportType, TIME_FORMAT } from '../../utils';
import { useAppStore } from '../../stores/app';
import { ImagePreview } from 'vant';
const app = useAppStore()
const bgLoaded = ref(false);
const props = defineProps({
    id: {
        type: String,
        default: '',
    },
})

const id = toRef(props, 'id')
const productItemData = ref<ProductItem>()
onMountedOrActivated(async () => {
    const res = await fetchProductItemDetail(id.value, true)
    if (res) {
        productItemData.value = res;
    }
    if (app.isWx)
        await setupProtection()
})
const noText = computed(() => {
    if (productItemData.value) {
        const len = String(productItemData.value.product?.publish_count).length
        return `#${productItemData.value.no.toString().padStart(len, '0')}`
    }
})
const typeText = computed(() => {
    if (productItemData.value && productItemData.value.product) {
        switch (productItemData.value.product.type) {
            case SupportType.AUDIO:
                return '音频'
            case SupportType.D3:
                return '3D'
            case SupportType.HYBRID:
                return '融合'
            case SupportType.IMAGE:
                return '图像'
            case SupportType.VIDEO:
                return '视频'
        }
    }
})

const onChainStatusText = computed(() => {
    if (productItemData.value) {
        if (productItemData.value.on_chain_status === onChainStatus.FAILED) {
            return "上链暂停"
        } else if (productItemData.value.on_chain_status === onChainStatus.PENDING) {
            return "待上链"
        } else if (productItemData.value.on_chain_status === onChainStatus.PROCESSING) {
            return "正在上链"
        } else if (productItemData.value.on_chain_status === onChainStatus.SUCCESS) {
            return "已上链"
        }
    }
})
const productOnChainTimeFormat = computed(() => {
    if (productItemData.value && productItemData.value.on_chain_timestamp) {
        return dayjs(productItemData.value.on_chain_timestamp).format(TIME_FORMAT)
    }
})

const onShareClickCallback = () => {
    if (productItemData.value) {
        ImagePreview([productItemData.value.product!.poster])
    }
}
onDeactivated(() => {
    productItemData.value = undefined
})
</script>
<style lang="scss" scoped>
.product-bg {
    // object-fit: contain;
    width: 100%;
    max-width: 550px;
    left: 50%;
    transform: translate(-50%);
    position: absolute;
    top: px2rem(-110);
    transition: opacity 0.3s ease-in-out;
    z-index: 0;
}

.collection-detail {
    // position: relative;

    .box {
        position: relative;
        // z-index: 1;
        padding: px2rem(12) px2rem(16);
        box-sizing: border-box;
        border-radius: px2rem(8);
        box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.25);
        background-color: $boxBgColorLight;
        width: 100%;
        margin-bottom: px2rem(20);
        display: flex;
        flex-flow: nowrap column;
        justify-content: space-between;
        align-items: center;

        .product-item-name {
            font-size: px2rem(24);
            font-weight: bold;
            color: $glodTextColor;
            margin-bottom: px2rem(10);
        }

        .product-item-no {
            background: linear-gradient(90.74deg, #D2CEA8 5.75%, #ECE28A 95.56%);
            box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, .25);
            border-radius: px2rem(8);
            text-align: center;
            padding: px2rem(4) px2rem(16);
            min-width: px2rem(84);
            color: black;
            font-size: px2rem(16);
            font-weight: bold;
        }

        .avatar {
            width: px2rem(48);
            height: px2rem(48);
            border: 1px solid white;
            box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.25);
            margin-bottom: px2rem(10);
        }

        .text {
            font-size: px2rem(18);
        }

        &.detail {
            display: flex;
            flex-flow: nowrap column;
            justify-content: flex-start;
            align-items: center;

            .title {
                margin-bottom: px2rem(20);
                color: $glodTextColor;
                position: relative;
                font-size: px2rem(24);
                z-index: 0;
                font-weight: bold;

                &::after {
                    content: "";
                    position: absolute;
                    bottom: px2rem(-6);
                    left: calc(-5%);
                    right: calc(-5%);
                    // background-color: $backgroundColor;
                    height: px2rem(12);
                    z-index: -1;
                    // width: 110%;
                }
            }

            .content {
                // width: 100%;
                flex: 1;
                padding-bottom: px2rem(8);
                box-sizing: border-box;

                .img {
                    margin-bottom: 0;
                    min-height: 100px;
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
    }

    .collection-info {
        font-size: px2rem(14);
    }
}
</style>