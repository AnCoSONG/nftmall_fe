<template>
    <div class="banner-wrapper">
        <!-- todo: customize indicator position and shape -->
        <van-swipe
            :autoplay="3000"
            indicatorColor="#ddd"
            class="banner-wrapper-swiper"
            lazy-render
        >
            <van-swipe-item
                v-for="image in banners"
                :key="image.src"
                @click="image.link && openNewUrl(image.link)"
            >
                <van-image
                    class="banner-img"
                    fit="cover"
                    :src="image.src"
                    lazy-load
                >
                    <template v-slot:loading>
                        <ImageLoader/>
                    </template>
                    <template v-slot:error>加载失败</template>
                </van-image>
            </van-swipe-item>
        </van-swipe>
    </div>
</template>
<script setup lang="ts">
import { onMountedOrActivated } from "@vant/use";
import { ref } from "vue";
import { fetchBanners } from "../../../../api";
import ImageLoader from "../../../../components/ImageLoader.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const banners = ref<Banner[]>([]);
const data = await fetchBanners();
banners.value = [...data];
// onMountedOrActivated(async () => {});

// 打开新页面或者路由至指定页面
const openNewUrl = (url: string) => {
    url = url.trim()
    if (url[0] !== "/") {
        window.open(url, "_blank");
    } else {
        router.push(url);
    }
};
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
        }
    }
}
</style>
