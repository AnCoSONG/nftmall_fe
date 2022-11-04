<template>
    <div class="mall outer-box">
        <Announcement></Announcement>
        <MallInfo :info-size="24"></MallInfo>
        <BannerWrapper></BannerWrapper>
        <MallMain></MallMain>
        <AdditionalInfo :only_icp="true"></AdditionalInfo>
    </div>
</template>
<script setup lang='ts'>
import Announcement from './subcomponents/Announcement.vue';
import MallInfo from './subcomponents/MallInfo.vue'
import BannerWrapper from './subcomponents/BannerWrapper.vue';
import MallMain from './subcomponents/MallMain.vue';
import AdditionalInfo from './subcomponents/AdditionalInfo.vue';
</script>
<style lang="scss" scoped>
.mall {
    margin-bottom: px2rem(72);
}
</style>