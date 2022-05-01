<template>
    <div class="banner-wrapper">
        <!-- todo: customize indicator position and shape -->
        <van-swipe :autoplay="3000" indicatorColor="#ddd" class="banner-wrapper-swiper" lazy-render>
            <van-swipe-item v-for="image in app.banner" :key="image.imgsrc">
                <van-image class="banner-img" fit="cover" :src="image.imgsrc" lazy-load>
                    <template v-slot:loading>
                        <div class="loader-wrapper">
                            <van-loading type="spinner" size="20" />
                        </div>
                    </template>
                    <template v-slot:error>加载失败</template>
                </van-image>
            </van-swipe-item>
        </van-swipe>
    </div>
</template>
<script setup lang='ts'>
import { onMountedOrActivated } from '@vant/use';
import { useAppStore } from '../../../../stores/app';
const app = useAppStore()
onMountedOrActivated(async () => {
    await app.loadBanner()
} )
</script>
<style lang="scss" scoped>
.banner-wrapper {
    width: px2rem(380);
    height: px2rem(calc(380 / 8 * 3)); // 通过固定图像高度自动撑起来。
    // border-radius: px2rem(8);

    .banner-wrapper-swiper {
        position: relative;
        // filter: drop-shadow(0 0 px2rem(2) rgba(255, 255, 255, 0.4));
        box-shadow: 0 0 px2rem(10) rgba(0, 0, 0, 0.2);
        min-height: 100%;
        border-radius: px2rem(8);
        background-color: $boxBgColor;

        .banner-img {
            width: px2rem(380);
            height: px2rem(calc(380 / 8 * 3));
            // border-radius: px2rem(8);
            display: block;

            .loader-wrapper {
                display: flex;
                width: 100%;
                height: 100%;
                justify-content: center;
                align-items: center;
                background-color: $boxBgColor;
            }
        }
    }

}
</style>