<template>
    <div class="additional-info">
        <van-divider v-if="!props.only_icp" class="custom">基于&nbsp;<a href="https://wenchang.bianjie.ai/" target="_blank" style="color: #666; text-decoration: underline;">BSN文昌链</a> </van-divider>
        <div class="icp" @click="openGXB">晋ICP备2022004760号-1</div>
    </div>
</template>
<script setup lang='ts'>
import { openGXB } from '../../../../utils';

const props = defineProps({
    only_icp: {
        type: Boolean,
        default: false,
    }
})
</script>
<style lang="scss" scoped>
.additional-info {
    margin: px2rem(20) 0;
    font-size: px2rem(12);
    width: 100%;
    display: flex;
    flex-flow: nowrap column;
    color: #666;
    align-items: center;
    justify-content: center;

    .custom {
        width: 70%;
        color: #666;
        border-color: #666;
    }

    .icp {
        font-size: px2rem(12);
        cursor: pointer;
    }
}
</style>