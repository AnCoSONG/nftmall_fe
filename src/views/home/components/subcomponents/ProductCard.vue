<template>
    <div
        class="product-card"
        @click="router.push(`/product/${props.data.id}`)"
        :data-last="props.isLast === true"
    >
        <div class="img-wrapper">
            <van-image
                :src="props.data.preview_img"
                class="img"
                @load="loaded = true"
            >
                <template v-slot:loading>
                    <ImageLoader></ImageLoader>
                </template>
                <template v-slot:error>加载失败</template>
            </van-image>
            <!-- todo: 发售状态组件 -->
            <div class="product-status" v-show="loaded">
                {{ props.data.attribute === 'gift'?'🎁 赠品':statusText }}
                <span v-if="isCountdown">
                    &nbsp;{{
                        `${countDownRef.hours
                            .toString()
                            .padStart(2, "0")}:${countDownRef.minutes
                            .toString()
                            .padStart(2, "0")}:${countDownRef.seconds
                            .toString()
                            .padStart(2, "0")}`
                    }}</span
                >
            </div>
            <!-- todo: 图像类型组件 -->
            <div class="product-type" v-show="loaded">
                <TypeIcon :type="props.data.type"></TypeIcon>
            </div>
            <div class="product-creator" v-show="loaded">
                <van-image
                    :src="
                        props.data.publisher?.avatar ??
                        'https://avatars.dicebear.com/api/pixel-art/random.svg'
                    "
                    round
                    class="product-creator-img"
                >
                    <template #loading>
                        <ImageLoader/>
                    </template>
                </van-image>
                <div class="product-creator-name">
                    {{ props.data.publisher?.name }}
                </div>
            </div>
        </div>
        <div class="desc">
            <div class="info">
                <!-- 最多展示两行 -->
                <div class="title van-multi-ellipsis--l2">
                    {{ props.data.name }}
                </div>
                <div class="tags">
                    <Tag v-for="tag in props.data.tags" :data="tag" />
                </div>
            </div>
            <Price
                :small-size="(px2rem(20) as string)"
                :integral-size="(px2rem(32) as string)"
                money-type="¥"
                :price="props.data.price"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ComputedRef } from "@vue/reactivity";
import { ref } from "vue";
import Tag from "../../../../components/Tag.vue";
import TypeIcon from "../../../../components/TypeIcon.vue";
import { useRouter } from "vue-router";
import { px2rem } from "../../../../utils";
import Price from "../../../../components/Price.vue";
import dayjs from "dayjs";
import { CurrentTime, useCountDown } from "@vant/use";
import ImageLoader from "../../../../components/ImageLoader.vue";
import { get_stock_count } from "../../../../api";
const router = useRouter();

type PropType = {
    data: Product;
    isLast: boolean;
};
const props = defineProps<PropType>();
const loaded = ref(false);
const countDown = useCountDown({
    time: 0, // time 后端生成
    onFinish: () => {
        isCountdown.value = false;
    },
});
const countDownRef = countDown.current;
const isCountdown = ref(false);
const stock_count = ref(0);
// 加载
const stock_count_res = await get_stock_count(props.data.id as string, "redis");
// console.log(stock_count_res);
stock_count.value = stock_count_res;

// todo: statusText优化
const statusText = computed(() => {
    if (props.data.stock_count === 0 || props.data.is_soldout) {
        return "🪧 已售罄";
    }
    const now = dayjs().valueOf();
    const draw_timestamp = dayjs(props.data.draw_timestamp).valueOf();
    const draw_end_timestamp = dayjs(props.data.draw_end_timestamp).valueOf();
    const sale_timestamp = dayjs(props.data.sale_timestamp).valueOf();

    if (now < draw_timestamp) {
        if (draw_timestamp - now > 24 * 60 * 60 * 1000) {
            return "🌟 敬请期待";
        } else {
            isCountdown.value = true;
            countDown.reset(draw_timestamp - now);
            countDown.start();
            return "⌛️ 待抽签";
        }
    } else if (now < draw_end_timestamp) {
        // 抽签已开始但还为结束
        isCountdown.value = true;
        countDown.reset(draw_end_timestamp - now);
        countDown.start();
        return "🎲 抽签中";
    } else if (now < sale_timestamp) {
        // 抽签已结束但还为开售，可以查看抽签结果
        isCountdown.value = true;
        countDown.reset(sale_timestamp - now);
        countDown.start();
        return "📢 抢购马上开始";
    } else {
        // 已开售：已售罄 ｜ 火热抢购中
        if (stock_count.value > 10) {
            return "🔥 火热抢购中";
        } else if (stock_count.value > 0) {
            return "❕ 库存紧张";
        } else {
            return "🪧 已售罄";
        }
    }
});
</script>
<style lang="scss" scoped>
.product-card {
    width: 100%;
    background-color: $boxBgColor;
    border-radius: px2rem(8);
    overflow: hidden;
    margin-bottom: px2rem(36);
    box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.25);

    &[data-last="true"] {
        margin-bottom: px2rem(18);
    }

    .img-wrapper {
        position: relative;
        min-height: 150px;

        .img {
            width: 100%;
            height: 100%;
            background-color: $boxBgColor;
            min-height: 150px;
            // height: auto;
            display: block;
            // border-radius: px2rem(8);
            // overflow: hidden;
        }

        .product-status {
            position: absolute;
            top: px2rem(10);
            left: px2rem(16);
            font-size: px2rem(12);
            background-color: rgba(0, 0, 0, 0.5);
            padding: px2rem(6) px2rem(8);
            box-sizing: border-box;
            color: $normalTextColor;
            border-radius: px2rem(4);
            backdrop-filter: blur(px2rem(4));
            -webkit-backdrop-filter: blur(px2rem(4));
        }

        .product-type {
            position: absolute;
            top: px2rem(10);
            right: px2rem(16);
            font-size: px2rem(16);
            background-color: rgba(0, 0, 0, 0.5);
            padding: px2rem(4) px2rem(6);
            box-sizing: border-box;
            color: $normalTextColor;

            border-radius: px2rem(4);
            backdrop-filter: blur(px2rem(4));
            -webkit-backdrop-filter: blur(px2rem(4));
        }

        .product-creator {
            position: absolute;
            bottom: px2rem(10);
            right: px2rem(16);
            font-size: px2rem(10);
            background-color: rgba(0, 0, 0, 0.5);
            padding: px2rem(6) px2rem(8);
            box-sizing: border-box;
            color: $normalTextColor;

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
            overflow: hidden;

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
