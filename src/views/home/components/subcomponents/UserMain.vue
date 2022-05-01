<template>
    <div class="user-main">
        <CellItem icon="bill-o" text="我的订单"></CellItem>
        <CellItem icon="gem-o" text="我的藏品"></CellItem>
        <CellItem icon="send-gift-o" text="我的转赠"></CellItem>
        <CellItem icon="service-o" text="联系客服" @click="showService = true"></CellItem>
        <CellItem icon="info-o" text="关于商城" @click="showAbout"></CellItem>
        <van-dialog class="dialog" v-model:show="showService">
            <template #title>
                <div class="title">请添加客服微信</div>
            </template>
            <van-image src="https://picsum.photos/300/300?random=1" class="img">
                <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                </template>
            </van-image>
        </van-dialog>
    </div>
</template>
<script setup lang='ts'>
import CellItem from './CellItem.vue';
import { Dialog } from 'vant'
import { ref } from 'vue';
const showService = ref(false);

const showAbout = () => {
    Dialog({
        title: '关于晋元数字藏品商城',
        message: '这是本商城的介绍文案'
    })
}
</script>
<style lang="scss" scoped>
.user-main {
    position: relative;
    width: 100%;
}

.dialog {
    .title {
        color: black !important;
        ;
    }

    .img {
        width: 100%;
        height: auto;
        min-height: 100px;
        display: block;
    }
}
</style>