<template>
<!-- todo: 优化list逻辑：如果是刷新就清空数据覆盖新数据，如果是加载更多就push进去 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh()">
        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoadMore()"
            v-if="app.hot.length > 0">
            <ProductCard :data="item" v-for="item in app.hot"></ProductCard>
        </van-list>
        <Empty v-else />
    </van-pull-refresh>
</template>
<script setup lang='ts'>
import ProductCard from './ProductCard.vue';
import Empty from '../../../../components/Empty.vue';
import { useAppStore } from '../../../../stores/app';
import { useAxios } from "../../../../plugins/axios"
import { inject, ref } from 'vue';
import { px2rem } from '../../../../utils';
import { onMountedOrActivated } from '@vant/use';
const axios = useAxios()
const app = useAppStore()
onMountedOrActivated(async () => {
    await app.loadHotProduct()
})

const loading = ref(false);
const refreshing = ref(false);
const finished = ref(false);


/**
 * todo 根据生产环境情况完善刷新
 */
// refresh
const onRefresh = async () => {
    finished.value = false;
    loading.value = true;
    await onLoadMore()
}

/**
 * todo: 根据生产环境情况完善加载更多
 */
const onLoadMore = async () => {
    
    if (finished.value) return;
    if (refreshing.value) {
        // 清空列表
        app.setHotProduct([])
        
    }
    loading.value = true;
    const res = await axios.get('/v1/product')
    if (res) {
        app.setHotProduct(res.data.data)
    } else {
        app.setHotProduct([])
    }
    refreshing.value = false;
    loading.value = false;
    finished.value = true;
}
</script>
<style lang="scss" scoped>
</style>