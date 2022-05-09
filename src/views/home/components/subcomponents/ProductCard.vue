<template>
    <div class="product-card" @click="router.push(`/product/${props.data.id}`)">
        <div class="img-wrapper">
            <van-image :src="props.data.preview_img" class="img" @load="loaded=true">
                <template v-slot:loading>
                    <div class="loader-wrapper">
                        <van-loading type="spinner" size="20" />
                    </div>
                </template>
                <template v-slot:error>加载失败</template>
            </van-image>
            <!-- todo: 优化实现细节 -->
            <div class="product-status" v-show="loaded">
                {{statusText}}
            </div>
            <div class="product-type" v-show="loaded">
                {{props.data.type}}
            </div>
            <div class="product-creator" v-show="loaded">
                <van-image :src="props.data.publisher.avatar || 'https://avatars.dicebear.com/api/pixel-art/random.svg'" round class="product-creator-img"></van-image>
                <div class="product-creator-name">
                    {{props.data.publisher.name}}
                </div>
            </div>
        </div>
        <div class="desc">
            <div class="info">
                <div class="title">{{ props.data.name }}</div>
                <div class="tags">
                    <Tag v-for="tag in props.data.tags" :data="tag"/>
                </div>
            </div>
            <div class="price">
                <span class="money-type">¥&nbsp;</span>
                <span class="money-integral">{{ props.data.price.split('.')[0] }}</span>
                <span class="money-fractional">.{{ props.data.price.split('.')[1] }}</span>
            </div>
        </div>
    </div>
</template>
<script setup lang='ts'>
import { computed } from '@vue/reactivity';
import { ref } from 'vue';
import Tag from '../../../../components/Tag.vue';
import { useRouter } from 'vue-router';
const router = useRouter();

// type Product = {
//     id: number | string,
//     name: string,
//     preview_img: string,
//     type: "image" | "audio" | "video" | "hybrid" | "3d" | "other",
//     classname: string,
//     count: number,
//     creator: {
//         avatar: string,
//         name: string,
//     }
//     details: Object,
//     price: string,
//     tags: string[],
//     sale_timestamp: number,
//     stock_count: number,
//     limit: number,
// }

type PropType = {
    data: Product
}
const props = defineProps<PropType>()
console.log(props.data)
const loaded = ref(false)

const statusText = computed(() => {
    if (props.data.stock_count === 0) {
        return '已售罄'
    }
    const diff = props.data.sale_timestamp - Date.now()
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
    background-color: $boxBgColor;
    border-radius: px2rem(8);
    overflow: hidden;
    margin-bottom: px2rem(36);
    box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, .25);

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
                flex-flow: wrap row;
                justify-content: flex-start;
                align-items: center;
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