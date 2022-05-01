<template>
    <div class="product-card">
        <div class="img-wrapper">
            <van-image :src="props.preview_img" class="img" @load="loaded=true">
                <template v-slot:loading>
                    <div class="loader-wrapper">
                        <van-loading type="spinner" size="20" />
                    </div>
                </template>
                <template v-slot:error>加载失败</template>
            </van-image>
            <div class="product-status" v-show="loaded">
                {{statusText}}
            </div>
            <div class="product-type" v-show="loaded">
                {{props.type}}
            </div>
            <div class="product-creator" v-show="loaded">
                <van-image :src="props.creator.avatar" round class="product-creator-img"></van-image>
                <div class="product-creator-name">
                    {{props.creator.name}}
                </div>
            </div>
        </div>
        <div class="desc">
            <div class="info">
                <div class="title">{{ props.name }}</div>
                <div class="tags">
                    <div class="tag" v-for="tag in props.tags">{{ tag }}</div>
                </div>
            </div>
            <div class="price">
                <span class="money-type">¥&nbsp;</span>
                <span class="money-integral">{{ props.price.split('.')[0] }}</span>
                <span class="money-fractional">.{{ props.price.split('.')[1] }}</span>
            </div>
        </div>
    </div>
</template>
<script setup lang='ts'>
import { computed } from '@vue/reactivity';
import { ref } from 'vue';

type Product = {
    id: number | string,
    name: string,
    preview_img: string,
    type: "image" | "audio" | "video" | "hybrid" | "3d" | "other",
    classname: string,
    count: number,
    creator: {
        avatar: string,
        name: string,
    }
    details: Object,
    price: string,
    tags: string[],
    sale_timestamp: number,
    stock_count: number,
    limit: number,
}
const props = defineProps<Product>()

const loaded = ref(false)

const statusText = computed(() => {
    if (props.stock_count === 0) {
        return '已售罄'
    }
    const diff = props.sale_timestamp - Date.now()
    if (diff < 0) {
        return '热销中'
    } else if (diff > 24 * 60 * 60 * 1000){
        return '即将开售';
    } else {
        return '待发售'
    }
})
</script>
<style lang="scss" scoped>
.product-card {
    width: 100%;
    background-color: $boxBgColorLight;
    border-radius: px2rem(8);
    overflow: hidden;
    margin-bottom: px2rem(36);

    &:last-child {
        margin-bottom: 0;
    }
    

    .img-wrapper {
        position: relative;
        min-height: 100px;

        .img {
            width: 100%;
            height: 100%;
            // height: auto;
            display: block;
            // border-radius: px2rem(8);
            // overflow: hidden;
        }

        .loader-wrapper {
            height: 100%;
            width: 100%;
            display: flex;
            flex-flow: nowrap column;
            align-items: center;
            justify-content: center;
        }
        
        .product-status {
            position:absolute;
            top: px2rem(10);
            left: px2rem(16);
            font-size: px2rem(12);
            background-color: rgba(0, 0, 0, 0.5);
            padding: px2rem(6) px2rem(8);
            box-sizing: border-box;
            color:$normalTextColor;
            border-radius: px2rem(4);
            backdrop-filter: blur(px2rem(4));
            -webkit-backdrop-filter: blur(px2rem(4));
        }

        .product-type {
            position:absolute;
            top: px2rem(10);
            right: px2rem(16);
            font-size: px2rem(10);
            background-color: rgba(0, 0, 0, .5);
            padding: px2rem(6) px2rem(8);
            box-sizing: border-box;
            color:$normalTextColor;

            border-radius: px2rem(4);
            backdrop-filter: blur(px2rem(4));
            -webkit-backdrop-filter: blur(px2rem(4));
        }

        .product-creator {
            position: absolute;
            bottom: px2rem(10);
            right: px2rem(16);
            font-size: px2rem(10);
            background-color: rgba(0, 0, 0, .5);
            padding: px2rem(6) px2rem(8);
            box-sizing: border-box;
            color:$normalTextColor;

            border-radius: px2rem(4);
            backdrop-filter: blur(px2rem(4));
            -webkit-backdrop-filter: blur(px2rem(4));
            display: flex;
            flex-flow: nowrap row;
            justify-content: center;
            align-items: center;

            .product-creator-img {
                width: px2rem(14);
                height: px2rem(14);
                margin-right: px2rem(6);
                // border-radius: px2rem(12);
            }

            .product-creator-name {
                font-size: px2rem(10);
            }
        }
    }

    .desc {
        padding: px2rem(12);
        display: flex;
        flex-flow: nowrap row;

        .info {
            flex: 1;
            display: flex;
            flex-flow: nowrap column;
            justify-content: flex-start;
            align-items: flex-start;

            .title {
                font-size: px2rem(24);
                color: $glodTextColor;
                font-weight: bold;
            }

            .tags {
                margin-top: px2rem(12);
                font-size: px2rem(12);
                display: flex;
                flex-flow: nowrap row;
                justify-content: flex-start;
                align-items: center;

                .tag {
                    margin-right: px2rem(8);
                    padding: px2rem(2);
                    border-radius: px2rem(2);
                    // background-color: $glodTextColor;
                    background: linear-gradient(94.63deg, #E8D9A6 14.59%, #DBC782 92.35%);
                    color: black;
                    // color: $normalTextColor;
                }
            }
        }

        .price {
            align-self: flex-end;
            color: $glodTextColor;
            font-weight: bolder;
            vertical-align: text-bottom;
            display: flex;
            flex-flow: nowrap row;
            align-items: baseline;
            

            .money-type,
            .money-fractional {
                font-size: px2rem(24);
                // display: inline-block;
            }

            .money-integral {
                font-size: px2rem(32);
                // display: inline-block;
            }
        }
    }
}
</style>