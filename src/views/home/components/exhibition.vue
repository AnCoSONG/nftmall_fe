<template>
    <div class="exhibition outer-box">
        <div class="title">您的个人展馆</div>
        <div class="btn" @click="onCreateExhibition">创建个人展馆</div>
    </div>
</template>
<script setup lang='ts'>
import { Dialog } from 'vant';

const onCreateExhibition = () => {
    Dialog.alert({
        title: '提示',
        message: '暂未开放，敬请期待'
    });
}
</script>
<style lang="scss" scoped>
.exhibition {
    
    margin-bottom: px2rem(72);
    width: 100%;

    .title {
        font-size: px2rem(20);
        color: $normalTextColor;
        margin-bottom: px2rem(24);
    }

    .btn {
        // position: absolute;
        width: 100%;
        height: px2rem(58);
        // font-weight: bold;
        // background: linear-gradient(90.71deg, rgba(255, 228, 135, 0.67) 6.07%, rgba(227, 199, 100, 0.67) 93.97%, rgba(234, 205, 107, 0.67) 93.97%);
        background: linear-gradient(94.63deg, #E8D9A6 14.59%, #DBC782 92.35%);

        border-radius: px2rem(8);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: px2rem(20);
        color: black;
        box-shadow: 0px px2rem(2) px2rem(4) 0px rgba(0, 0, 0, 0.25);
    }
}
</style>