<template>
    <div class="announcement" v-if="app.announcement.length !== 0">
        <van-notice-bar class="notice-bar" left-icon="volume-o" :scrollable="false"
            :background="theme.noticeBarBackground" :color="theme.noticeBarText">
            <van-swipe vertical class="notice-swipe" :autoplay="3000" :show-indicators="false">
                <van-swipe-item v-for="item in app.announcement" :key="item.text">{{ item.text }}</van-swipe-item>
            </van-swipe>
        </van-notice-bar>
    </div>
</template>
<script setup lang='ts'>
import { useThemeStore } from '../../../../stores/theme';
import { useAppStore } from '../../../../stores/app';
import { onMountedOrActivated } from '@vant/use';
const theme = useThemeStore().announcement;
const app = useAppStore();
onMountedOrActivated(async () => {
    await app.loadAnnouncement();
})
</script>
<style lang="scss" scoped>
.announcement {
    font-size: px2rem(13);
    padding-bottom: px2rem(10);
    // padding: 10px;

    .notice-bar {
        border-radius: px2rem(8);

        .notice-swipe {
            line-height: px2rem(16);
            height: px2rem(16);
        }

    }

}
</style>