<template>
    <div class="additional-info">
        <van-divider class="custom">基于&nbsp;<a href="https://wenchang.bianjie.ai/" target="_blank" style="color: #666; text-decoration: underline;">BSN文昌链</a> </van-divider>
        <div class="icp">晋ICP备2022004760号</div>
    </div>
</template>
<script setup lang='ts'>

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
    }
}
</style>