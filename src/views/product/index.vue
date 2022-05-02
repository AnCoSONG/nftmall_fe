<template>
    <Subpage title="藏品详情">
        <div class="product">
            <div class="product-preview">
                <van-image class="img" src="https://picsum.photos/400/400" :class="{ loop: notSupport }">
                    <template #loading>
                        <van-loading vertical>加载中</van-loading>
                    </template>
                </van-image>
            </div>
            <div class="product-price-status box">
                <Price :small-size="(px2rem(20) as string)" :integral-size="(px2rem(32) as string)" money-type="¥"
                    :price="'25.50'" />
                <div class="status">已售罄</div>
            </div>
            <div class="product-info box">
                <div class="left">
                    <div class="name">数字藏品名称</div>
                    <div class="tags">
                        <Tag :data="{ text: '测试' }"></Tag>
                    </div>
                </div>
                <div class="right">
                    <div class="type">
                        图像
                    </div>
                    <div class="limit">限购 2 份</div>
                </div>
            </div>
            <div class="creator box">
                <van-image class="avatar" round src="https://picsum.photos/24/24"></van-image>
                <div class="name">创作者</div>
            </div>

            <div class="detail box">
                <div class="title">藏品故事</div>
                <div class="content">
                    <van-image class="img" v-for="item in 4" :src="`https://picsum.photos/400/500`"></van-image>
                </div>
            </div>

            <div class="must-know box">
                <div class="title">
                    购买须知
                </div>
                <div class="content">
                    数字藏品为虚拟数字商品，而非实物，仅限实名认真为年满14
                    周岁的中国大陆用户购买。数字藏品的版权由发行方或原创者
                    拥有，除另行取得版权拥有者书面同意外，用户不得将数字藏
                    品用于任何商业用途。本商品一经售出，不支持退换。本商品
                    源文件不支持本地下载。请勿对数字藏品进行炒作、场外交易
                    、欺诈，或以任何其他非法方式进行使用。
                </div>
            </div>
            <div class="bottom-bar">
                <div class="counter">
                    <div class="jian operation" @click="operateCount(-1)">-</div>
                    <div class="num">{{ count }}</div>
                    <div class="jia operation" @click="operateCount(1)">+</div>
                </div>
                <!-- todo 加入 即将开售 ｜ 抽签 ｜ 已售罄 -->
                <div class="pay-btn" @click="buy">购买</div>
            </div>
        </div>
    </Subpage>
</template>
<script lang="ts">
export default {
    name: 'product'
}
</script>
<script setup lang='ts'>
import Subpage from '../../components/Subpage.vue';
import Price from '../../components/Price.vue';
import Tag from '../../components/Tag.vue';
import { px2rem } from '../../utils';
import { useRoute, useRouter } from 'vue-router';
import { nextTick, onDeactivated, ref } from 'vue';
import { onMountedOrActivated } from '@vant/use';
const route = useRoute()
const router = useRouter()

const xRotate = ref(0)
const yRotate = ref(0)
const notSupport = ref(false)

const handler = function (event: DeviceOrientationEvent) {
    // 只能在https或者localhost下使用
    // gamma: 从左到右
    xRotate.value = event.gamma ?? 0;
    // beta: 从前到后的运动
    yRotate.value = event.beta ?? 0;
}
onMountedOrActivated(() => {
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", handler, true);
    } else {
        notSupport.value = true
    }
})

onDeactivated(() => {
    window.removeEventListener('deviceorientation', handler)
})


const count = ref(1)
const operateCount = (payload: number) => {
    // todo: 3 is limit, change to limit
    if (count.value + payload < 1 || count.value + payload > 3) {
        return
    }
    count.value = count.value + payload
}


const buy = async () => {
    // 创建订单，创建好后跳转至收银台
    setTimeout(() => {
        router.push(`/cashier/0`) // 需要带请求得到的订单id
    }, 500)
}
</script>
<style lang="scss" scoped>
.product {
    width: 100%;
    position: relative;
    display: flex;
    flex-flow: nowrap column;
    align-items: center;
    justify-content: center;
    margin-bottom: px2rem(72);

    .product-preview {
        margin-top: px2rem(50);
        margin-bottom: px2rem(50);
        // overflow: hidden;
        perspective: px2rem(500);
        transform-style: preserve-3d;
        perspective-origin: 50% 50%;

        .img {
            border: 2px solid #ddd;
            width: px2rem(300);
            min-height: px2rem(200);
            border-radius: px2rem(8);
            overflow: hidden;
            box-shadow: 0 px2rem(4) px2rem(20) rgba(210, 215, 112, 0.25);
            // transform: rotate3d(0, 1, 0, -30deg);
            // transform: rotateX(10deg);

            &.loop {
                animation: rotate 6s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
            }
        }

        @keyframes rotate {
            0% {
                transform: rotateY(-15deg) translateZ(0px);
            }

            // 25% {
            //     transform: rotateY(30deg);
            // }

            50% {
                transform: rotateY(15deg) translateZ(-30px);
            }

            // 75% {
            //     transform: rotateY(-30deg) translateZ(100px);
            // }

            100% {
                transform: rotateY(-15deg) translateZ(0px);
            }
        }
    }

    .box {
        padding: px2rem(12) px2rem(16);
        box-sizing: border-box;
        border-radius: px2rem(8);
        box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, .25);
        background-color: $boxBgColor;
        width: 100%;
        margin-bottom: px2rem(20);
    }

    .product-price-status {
        display: flex;
        flex-flow: nowrap row;
        justify-content: space-between;
        align-items: center;

        .status {
            color: $greyTextColor;
            font-size: px2rem(16);
        }
    }

    .product-info {
        display: flex;
        flex-flow: nowrap row;
        justify-content: flex-start;
        align-items: flex-start;

        .left {
            flex: 1;
            display: flex;
            flex-flow: wrap column;
            justify-content: flex-start;
            align-items: flex-start;

            .name {
                font-size: px2rem(24);
                font-weight: bold;
                margin-bottom: px2rem(8);
                background: linear-gradient(94.63deg, #E8D9A6 14.59%, #DBC782 92.35%);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                text-fill-color: transparent;
            }

            .tags {
                display: flex;
                flex-flow: wrap row;
                justify-content: flex-start;
                align-items: center;
                font-size: px2rem(12);
            }
        }

        .right {
            // align-self: flex-end;
            display: flex;
            flex-flow: nowrap column;
            justify-content: space-between;
            align-items: flex-end;

            .type {
                font-size: px2rem(14);
                color: $greyTextColor;
                padding: px2rem(4);
                box-sizing: border-box;
                background-color: $backgroundColor;
                border-radius: px2rem(4);
                margin-bottom: px2rem(8);
                box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, .25);

            }

            .limit {
                font-size: px2rem(12);
                color: $greyTextColor;
            }
        }
    }

    .creator {
        display: flex;
        flex-flow: nowrap row;
        justify-content: center;
        align-items: center;

        .avatar {
            width: px2rem(24);
            height: px2rem(24);
            overflow: hidden;
            margin-right: px2rem(10);
            border: 1px solid #ddd;
        }

        .name {
            font-size: px2rem(18);
        }
    }

    .detail, .must-know {
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

            &::after {
                content: "";
                position: absolute;
                bottom: px2rem(-6);
                left: calc(-5%);
                right: calc(-5%);
                background-color: #353535;
                height: px2rem(12);
                z-index: -1;
                // width: 110%;
            }
        }
    }

    .detail {
        .content {
            width: 100%;
            padding-bottom: px2rem(8);
            box-sizing: border-box;

            .img {
                margin-bottom: 0;
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

    .must-know {
        .content {
            font-size: px2rem(14);
            color: $greyTextColor;
            line-height: px2rem(18);
            padding-bottom: px2rem(8);
            box-sizing: border-box;
        }
    }

    .bottom-bar {
        position: fixed;
        padding: px2rem(10) px2rem(17);
        box-sizing: border-box;
        bottom: 0;
        left: 0;
        width: 100%;
        height: px2rem(60);
        right: 0;
        background-color: black;
        box-shadow: 0 px2rem(-4) px2rem(4) rgba(0, 0, 0, 0.25);

        display: flex;
        flex-flow: nowrap row;
        justify-content: flex-end;
        align-items: center;

        .counter {
            margin-right: px2rem(20);
            display: flex;
            flex-flow: nowrap row;
            justify-content: center;
            align-items: center;
            height: px2rem(40);

            .operation {
                background-color: #353535;
                font-size: px2rem(16);
                height: 100%;
                color: white;
                padding: px2rem(8) px2rem(12);
                font-weight: bold;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .jian {
                border-top-left-radius: px2rem(8);
                border-bottom-left-radius: px2rem(8);
            }

            .jia {
                border-top-right-radius: px2rem(8);
                border-bottom-right-radius: px2rem(8);
            }

            .num {
                height: 100%;
                padding: px2rem(6) px2rem(12);
                // padding: px2rem(16);
                background-color: #c4c4c4;
                color: black;
                font-size: px2rem(18);
                box-sizing: border-box;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                width: px2rem(42);
            }

        }

        .pay-btn {
            font-weight: bold;
            box-sizing: border-box;
            font-size: px2rem(18);
            background-color: #D8E0A3;
            color: black;
            padding: px2rem(8) 0;
            text-align: center;
            width: px2rem(120);
            border-radius: px2rem(8);
        }
    }
}
</style>