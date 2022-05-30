<template>
    <Subpage title="藏品详情" shareable>
        <van-skeleton :loading="!productItemData" :row="10">
            <div class="collection-detail" v-if="productItemData">
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
                <div class="box collection-info">
                    <KeyValueLine key-text="藏品名" :value="productItemData.product?.name ?? '...'" :copy="false" />
                    <KeyValueLine key-text="藏品类别" :value="typeText ?? '...'" :copy="false" />
                    <KeyValueLine key-text="藏品ID" :value="productItemData.product_id?? '...'" :copy="true" />
                    <KeyValueLine key-text="发行方" :value="'晋元数字'" :copy="false" />
                    <KeyValueLine key-text="创作方" :value="productItemData.product?.publisher?.name ?? '...'"
                        :copy="false" />
                    <KeyValueLine key-text="拥有者" :value="productItemData.owner?.username ?? '...'" :copy="false" />
                    <KeyValueLine key-text="拥有者钱包地址" :value="productItemData.owner?.bsn_address ?? '...'" :copy="true" />
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
import { computed, onDeactivated, ref, toRef } from 'vue';
import Subpage from '../../components/Subpage.vue';
import ProductViewer from '../../components/ProductViewer.vue';
import { onMountedOrActivated } from '@vant/use'
import ImageLoader from '../../components/ImageLoader.vue';
import KeyValueLine from '../../components/KeyValueLine.vue';
import { fetchProductItemDetail } from '../../api';
import { onChainStatus, SupportType } from '../../utils';
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
})
const noText = computed(() => {
    if (productItemData.value) {
        return `#${productItemData.value.no.toString().padStart(4, '0')}`
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
onDeactivated(() => {
    productItemData.value = undefined
})
</script>
<style lang="scss" scoped>
.collection-detail {
    .box {
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
            padding: px2rem(4) px2rem(8);
            width: px2rem(84);
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
    }

    .collection-info {
        font-size: px2rem(14);
    }
}
</style>