<template>
    <div class="mall-main">
        <!-- tab tag -->
        <!-- hot | product list | something else -->
        <van-tabs v-model:active="active" shrink sticky swipeable lazy-renderer background="#202020" color="#dcdda9" title-active-color="#dcdda9"
            title-inactive-color="#949494">
            <van-tab title="热门推荐" class="mall-main-tab">
                <Hot></Hot>
            </van-tab>
            <van-tab title="藏品列表" class="mall-main-tab">
                <ProductList></ProductList>
            </van-tab>
        </van-tabs>
    </div>
</template>
<script setup lang='ts'>
import { ref } from 'vue';
import { useAppStore } from '../../../../stores/app';
import Hot from './Hot.vue';
import ProductList from './ProductList.vue';
const app = useAppStore()
const active = ref(0);
</script>
<style lang="scss">
.mall-main {
    margin-top: px2rem(12);

    .mall-main-tab {
        padding-top: px2rem(12);
        box-sizing: border-box;
    }
}

.mall-main .van-tab--line {
    &.van-tab--active {
        .van-tab__text {
            font-size: px2rem(18)
        }
    }
    .van-tab__text {
        font-size: px2rem(14)
    }
}
.mall-main .van-tab--active {
    .van-tab__text {
        font-size: px2rem(18);
    }
}

.mall-main .van-tabs--line .van-tabs__wrap{
    // make tabs height higher
    height: px2rem(54)!important;
}
</style>