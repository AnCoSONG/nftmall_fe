<template>
    <Subpage title="藏品详情" shareable back-to="/collection" @on-share-click="() => onShareClickCallback()">
        <van-skeleton :loading="!productItemData" :row="10">
            <img src="https://mall-1308324841.file.myqcloud.com/productBg5.png" class="product-bg" alt=""
                :style="{ opacity: bgLoaded ? 1 : 0 }" @load="bgLoaded = true" />
            <div class="collection-detail" v-if="productItemData">
                <ProductViewer :src="is3DSrc ? productItemData.product!.src : productItemData.product!.preview_src"
                    :backup_img="productItemData.product?.preview_img!" :rotate_mode="0"></ProductViewer>
                <div class="box">
                    <div class="product-item-name">
                        {{ productItemData.product?.name ?? '...' }}
                    </div>
                    <div class="product-item-no">
                        {{ noText ?? '...' }}
                    </div>
                    <div class="product-item-btn" @click="onBtnClick" v-if="!is3DSrc">查看原始资源</div>
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
                    <KeyValueLine key-text="上链状态" :value="onChainStatusText ?? '...'" :copy="false" />
                    <KeyValueLine key-text="藏品系列链上ID" :value="productItemData.nft_class_id ?? '...'" :copy="true" />
                    <KeyValueLine key-text="藏品链上ID" :value="productItemData.nft_id ?? '...'" :copy="true" />
                    <KeyValueLine key-text="藏品链上交易ID" :value="productItemData.operation_id ?? '...'" :copy="true" />
                    <KeyValueLine key-text="交易哈希" :value="productItemData.tx_hash ?? '...'" :copy="true" />
                </div>
                <div class="box must-know">
                    <div class="title">权益须知</div>
                    <div class="content" v-html="cleanPrevillageMustKnowHtml"></div>
                </div>
            </div>
            <van-overlay class="player" :show="isPlayerVisible" :z-index="100">
                <div class="player-wrapper" style="width: 100%; height: 100%;">
                    <video ref="videoPlayer" id="video-player" controls style="width: 80%;" preload="metadata"
                        controlslist="nodownload" :src="playerSrc" v-if="isVideo">
                    </video>
                    <audio ref="audioPlayer" :src="playerSrc" v-if="isAudio" id="audio-player" style="width: 80%;"
                        controls preload="metadata" controlslist="nodownload"></audio>
                    <div class="btn" @click="isPlayerVisible = false">关闭</div>
                </div>
            </van-overlay>

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
import DOMPurify from 'dompurify';
import { computed, onDeactivated, ref, toRef, watch } from 'vue';
import Subpage from '../../components/Subpage.vue';
import ProductViewer from '../../components/ProductViewer.vue';
import { onMountedOrActivated } from '@vant/use'
import ImageLoader from '../../components/ImageLoader.vue';
import KeyValueLine from '../../components/KeyValueLine.vue';
import { fetchDoc, fetchProductItemDetail } from '../../api';
import { extract_suffix, onChainStatus, setupProtection, SupportType, TIME_FORMAT, px2rem } from '../../utils';
import { useAppStore } from '../../stores/app';
import { ImagePreview } from 'vant';
import { authSrc } from '../../plugins/cos-sdk';
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
const previllageMustKnow = ref("")
const cleanPrevillageMustKnowHtml = computed(() => {
    return DOMPurify.sanitize(previllageMustKnow.value)
})
onMountedOrActivated(async () => {
    const [res, previllageMustKnowRes] = await Promise.all([
        fetchProductItemDetail(id.value, true),
        fetchDoc('权益须知')
    ])
    if (res) {
        productItemData.value = res;
    }
    if (previllageMustKnowRes) {
        previllageMustKnow.value = previllageMustKnowRes.content
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

const is3DSrc = computed(() => {
    if (productItemData.value && productItemData.value.product) {
        if (['glb', 'gltf'].indexOf(extract_suffix(productItemData.value.product.src)) !== -1) {
            return true
        } else {
            return false
        }
    }
})

const onShareClickCallback = () => {
    if (productItemData.value) {
        ImagePreview([productItemData.value.product!.poster])
    }
}

const isImage = computed((suffix: string) => {
    if (productItemData.value && productItemData.value.product) {
        const suffix = extract_suffix(productItemData.value.product.src)
        return ['apng', 'avif', 'bmp', 'gif', 'ico', 'cur', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'tif', 'tiff', 'webp'].indexOf(suffix.toLowerCase()) !== -1
    } else {
        return false;
    }
})

const isVideo = computed(() => {
    if (productItemData.value && productItemData.value.product) {
        const suffix = extract_suffix(productItemData.value.product.src)
        return ['mp4', 'avi', 'mkv', 'hevc', 'wmv', 'mov', 'asf', 'flv', 'rmvb', 'rm', '3gb', 'vob', 'mpeg', 'm4v', 'webm'].indexOf(suffix.toLowerCase()) !== -1
    }
    return false
})

const isAudio = computed(() => {
    if (productItemData.value && productItemData.value.product) {
        const suffix = extract_suffix(productItemData.value.product.src)
        return ['mp3', 'flac', 'wav', 'm4a'].indexOf(suffix.toLowerCase()) !== -1
    }
    return false
})

const isPlayerVisible = ref(false)
const playerSrc = ref("")
const videoPlayer = ref()
const audioPlayer = ref()

watch(isPlayerVisible, (newVal) => {
    if (newVal) {
        // 显示
        playerSrc.value = authSrc(productItemData.value!.product!.src)
    } else {
        // 隐藏
        videoPlayer.value?.pause()
        audioPlayer.value?.pause()
    }
})

const onBtnClick = () => {
    if (isImage.value) {
        ImagePreview([productItemData.value!.product!.src])
    } else {
        isPlayerVisible.value = true
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
    top: px2rem(-60);
    transition: opacity 0.3s ease-in-out;
    z-index: 0;
}

.collection-detail {
    // position: relative;
    width: 100%;
    position: relative;
    display: flex;
    flex-flow: nowrap column;
    align-items: center;
    justify-content: center;
    margin-bottom: px2rem(72);

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

        .product-item-btn {
            margin-top: px2rem(10);

            // background: linear-gradient(90.23deg, #49432B 6.42%, #3A3523 99.92%);
            color: $glodTextColor;
            background-color: $boxBgColor;
            font-size: px2rem(14);
            padding: px2rem(8);
            box-sizing: border-box;
            border-radius: px2rem(8);
            box-shadow: inset 0 px2rem(4) px2rem(4) rgba(0, 0, 0, .25);
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

        &.detail,
        &.must-know {
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
                    background-color: #272727;

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

        &.must-know {

            .title {
                margin-bottom: 0;
            }

            .content {
                font-size: px2rem(14);
                color: $greyTextColor;
                line-height: px2rem(18);
                // text-indent: 2em;
                word-break: break-all;
            }
        }
    }

    .collection-info {
        font-size: px2rem(14);
    }
}

.player-wrapper {
    display: flex;
    flex-flow: nowrap column;
    justify-content: center;
    align-items: center;

    #video-player {
        border-radius: px2rem(8);
        overflow: hidden;
        box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.25);

    }

    .btn {
        font-size: px2rem(16);
        color: $normalTextColor;
        background-color: $boxBgColorLight;
        padding: px2rem(8) px2rem(16);
        margin-top: px2rem(34);
        box-sizing: border-box;
        border-radius: px2rem(8);
        box-shadow: inset 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.25);


    }
}
</style>