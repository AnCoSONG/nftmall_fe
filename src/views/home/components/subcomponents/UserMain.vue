<template>
    <div class="user-main">
        <CellItem icon="search" right-icon="arrow" text="文昌链浏览器" @click="openBSN"></CellItem>
        <CellItem icon="bill-o" right-icon="arrow" text="我的订单" @click="routeTo('order')"></CellItem>
        <CellItem icon="gem-o" right-icon="arrow" text="我的藏品" @click="routeTo('collection')"></CellItem>
        <CellItem icon="send-gift-o" right-icon="arrow" text="我的转赠" @click="routeTo('transfer')"></CellItem>
        <!-- <CellItem icon="send-gift-o" right-icon="arrow"  text="我的转赠"></CellItem> -->
        <CellItem icon="service-o" right-icon="arrow" text="联系客服" @click="router.push({path: '/doc', query: { t: '联系客服'}})"></CellItem>
        <CellItem icon="info-o" right-icon="arrow" text="常见问题"
            @click="router.push({ path: '/doc', query: { t: '常见问题' } })"></CellItem>
        <!-- <van-dialog class="dialog" v-model:show="showService">
            <template #title>
                <div class="title">请添加客服微信</div>
            </template>
            <van-image src="https://picsum.photos/300/300?random=1" class="img">
                <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                </template>
            </van-image>
        </van-dialog> -->
    </div>
</template>
<script setup lang='ts'>
import CellItem from 'comps/CellItem.vue';
import { Dialog } from 'vant'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const showService = ref(false);

const routeTo = (path: string) => {
    router.push(path)
}

const openBSN = () => {
    Dialog.confirm({
        title: '提示',
        message: '即将前往BSN文昌链浏览器, 您可在该页面完成您藏品权利的验证。点击”确定“继续。'
    }).then(() => {
        window.location.href = 'https://explorer.wenchang.bianjie.ai/' // todo: 待修改为正式链
    }).catch(() => {
        // do nothing
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
        font-weight: bold;
    }

    .img {
        width: 100%;
        height: auto;
        min-height: 100px;
        display: block;
    }
}
</style>