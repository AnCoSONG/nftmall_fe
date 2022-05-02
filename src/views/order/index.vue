<template>
    <Subpage :title="title" back-to="/user">
        <!-- Van Tab 全部 | 待支付 | 已支付 | 已取消 -->
        <van-tabs class="box" title-inactive-color="#949494" swipeable lazy-renderer background="#202020" color="#ddd" title-active-color="#ddd">
            <van-tab title="全部">
                <OrderList query="all"></OrderList>
            </van-tab>
            <van-tab title="待支付">
                <OrderList query="unpaied"></OrderList>
            </van-tab>
            <van-tab title="待上链">
                <OrderList query="unlinked"></OrderList>
            </van-tab>
            <van-tab title="已取消">
                <OrderList query="canceled"></OrderList>
            </van-tab>
            </van-tabs>

    </Subpage>
</template>
<script setup lang='ts'>
import { ref } from 'vue';
import Subpage from '../../components/Subpage.vue';
import OrderList from './components/OrderList.vue';
const title = ref('订单详情')
</script>
<style lang="scss" scoped>
.box {
    width: 100%;
    margin-bottom: px2rem(72);
}
</style>