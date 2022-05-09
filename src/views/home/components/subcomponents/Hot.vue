<template>
<!-- todo: 优化list逻辑：如果是刷新就清空数据覆盖新数据，如果是加载更多就push进去 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh()">
        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoadMore()"
            v-if="productList.length > 0">
            <ProductCard :data="item" v-for="item in productList"></ProductCard>
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
import { fetchRecommandProducts} from '../../../../api/index';
const axios = useAxios()
const productList = ref<Product[]>([])
onMountedOrActivated(async () => {
    const data = await fetchRecommandProducts()
    if (data.code === 200) {
        productList.value = [...data.data]
    }
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
        productList.value = []
        
    }
    loading.value = true;
    const res = await fetchRecommandProducts()
    console.log(res)
    if (res) {
        productList.value = [...res.data]
    } else {
        productList.value = []
    }
    refreshing.value = false;
    loading.value = false;
    finished.value = true;
}
</script>
<style lang="scss" scoped>
</style>