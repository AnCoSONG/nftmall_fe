<template>
    <div class="mall">
        <Announcement></Announcement>
        <MallInfo></MallInfo>
        <BannerWrapper></BannerWrapper>
        <MallMain></MallMain>
    </div>
</template>
<script setup lang='ts'>
import Announcement from './subcomponents/Announcement.vue';
import MallInfo from './subcomponents/MallInfo.vue'
import BannerWrapper from './subcomponents/BannerWrapper.vue';
import MallMain from './subcomponents/MallMain.vue';
</script>
<style lang="scss" scoped>
.mall {
    padding: px2rem(17) px2rem(17);
    padding-bottom: 0;
    box-sizing: border-box;
    margin-bottom: px2rem(72);

    
}
</style>