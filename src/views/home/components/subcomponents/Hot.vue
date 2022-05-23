<template>
<!-- todo: 优化list逻辑：如果是刷新就清空数据覆盖新数据，如果是加载更多就push进去 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh()">
        <van-list v-model:loading="loading" :finished="finished" @load="onLoadMore()"
            v-if="productList.length > 0">
            <ProductCard :data="item" v-for="(item,index) in productList" :is-last="index == productList.length - 1"></ProductCard>
            <template #finished>
                <UniversalDivider/>
            </template>
        </van-list>
        <Empty v-else />
    </van-pull-refresh>
</template>
<script setup lang='ts'>
import ProductCard from './ProductCard.vue';
import Empty from '../../../../components/Empty.vue';
import UniversalDivider from '../../../../components/UniversalDivider.vue';
import { useAppStore } from '../../../../stores/app';
import { useAxios } from "../../../../plugins/axios"
import { inject, ref } from 'vue';
import { px2rem } from '../../../../utils';
import { onMountedOrActivated } from '@vant/use';
import { fetchRecommandProducts} from '../../../../api/index';
const axios = useAxios()
const productList = ref<Product[]>([])
onMountedOrActivated(() => {
    onRefresh();
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
    /**
     * todo: 后端调整，返回hot数据
     */
    const data = await fetchRecommandProducts(true);
    if (data) {
        productList.value = [...data];
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