<template>
    <!-- todo: 优化list逻辑：如果是刷新就清空数据覆盖新数据，如果是加载更多就push进去 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh()">
        <van-list v-model:loading="loading" :finished="finished" @load="onLoadMore()" v-if="list.length > 0">
            <ProductCard :data="item" v-for="(item, index) in list" :is-last="index == list.length - 1"></ProductCard>
            <template #finished>
                <UniversalDivider />
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
import { computed, inject, ref } from 'vue';
import { px2rem } from '../../../../utils';
import { onMountedOrActivated } from '@vant/use';
import { fetchHotProducts } from '../../../../api/index';
import { useUserStore } from '../../../../stores/user';
onMountedOrActivated(() => {
    onRefresh();
})
const user = useUserStore()
const list = ref<Product[]>([])
const loading = ref(false);
const refreshing = ref(false);
const finished = ref(false);
const limit = 5;
const total = ref(0);
const page = computed(() => {
    return Math.floor(list.value.length / limit) + 1;
})

/**
 * todo 根据生产环境情况完善刷新
 */
// refresh
const onRefresh = async () => {
    refreshing.value = true;
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
        list.value = []
        total.value = 0
    }
    loading.value = true;
    /**
     * todo: 后端调整，返回hot数据
     */
    const data = await fetchHotProducts(true, page.value, limit, user.data.role && user.data.role === 'official' ? 'all' : 'user');
    if (data) {
        for (const item of data.data) {
            list.value.push(item)
        }
        total.value = data.total;
    } else {
        list.value = [];
        total.value = 0;
    }
    refreshing.value = false;
    loading.value = false;
    if (list.value.length >= 10 || list.value.length >= total.value) {
        finished.value = true;
    }
}
</script>
<style lang="scss" scoped>
</style>