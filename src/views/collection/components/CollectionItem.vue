<template>
    <div class="item" @click="router.push(`/collection/${data.id}`)">
        <van-image :src="data.product.preview_img" class="img"></van-image>
        <div class="info">
            <div class="creator">
                <van-image :src="data.product.creator?.avatar" class="avatar" round></van-image>
                <div class="creator-name">{{ data.product.creator?.name }}</div>
            </div>
            <div class="product-name">
                {{ data.product.name }}
            </div>
            <div class="no">
                {{ noText }}
            </div>
        </div>
    </div>
</template>
<script setup lang='ts'>
import { computed } from '@vue/reactivity';
import { toRef } from 'vue';
import {useRouter} from 'vue-router'
const router = useRouter()

type PropType = {
    data: BoughtItem
}

const props = defineProps<PropType>()
const data = toRef(props, 'data')

const noText = computed(() => {
    return `#${data.value.no.toString().padStart(4, '0')}`
})
</script>
<style lang="scss" scoped>
.item {
    width: px2rem(175);
    display: inline-block;
    margin-right: px2rem(24);
    // height: 200px;
    // width: 100%;
    background-color: $boxBgColorLight;
    border-radius: px2rem(8);
    overflow: hidden;
    box-shadow: 0 px2rem(4) px2rem(4) 0 rgba(0, 0, 0, 0.25);
    margin-bottom: px2rem(20);

    &:nth-child(2n) {
        margin-right: 0;
    }

    .img {
        width: 100%;
        border-radius: px2rem(8);
        overflow: hidden;
    }

    .info {
        display: flex;
        flex-flow: nowrap column;
        justify-content: center;
        align-items: center;

        .creator {
            display: flex;
            flex-flow: nowrap column;
            justify-content: center;
            align-items: center;
            margin-top: px2rem(-30);
            margin-bottom: px2rem(8);

            .avatar {
                width: px2rem(30);
                height: px2rem(30);
                border: 1px solid white;
                box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.25);
                margin-bottom: px2rem(8);
            }

            .creator-name {
                font-size: px2rem(12);
            }

        }

        .product-name {
            font-size: px2rem(18);
            font-weight: bold;
            color: $glodTextColor;
            margin-bottom: px2rem(10);
        }

        .no {
            background: linear-gradient(90.74deg, #D2CEA8 5.75%, #ECE28A 95.56%);
            box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, .25);
            border-radius: px2rem(8);
            text-align: center;
            padding: px2rem(2);
            width: px2rem(85);
            color: black;
            font-size: px2rem(12);
            margin-bottom: px2rem(12);
            font-weight: bold;
        }
    }
}
</style>