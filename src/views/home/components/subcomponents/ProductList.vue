<template>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh()">
        <van-list v-model:loading="loading" :finished="finished" @load="onLoadMore()"
            v-if="list.length > 0">
            <ProductCard :data="item" v-for="(item, index) in list" :is-last="index == list.length - 1"></ProductCard>
            <template #finished>
                <UniversalDivider/>
            </template>
        </van-list>
        <Empty v-else />
    </van-pull-refresh>
</template>
<script setup lang='ts'>
import ProductCard from './ProductCard.vue';
import UniversalDivider from '../../../../components/UniversalDivider.vue';
import Empty from '../../../../components/Empty.vue';
import { ref } from 'vue';
import { onMountedOrActivated } from '@vant/use';
import { fetchProducts } from '../../../../api';
import { computed } from '@vue/reactivity';

const finished = ref(false)
const loading = ref(false)
const refreshing = ref(false)
const limit = 5;
const list = ref<Product[]>([])
const total = ref(0);
const page = computed(() => {
    return Math.floor(list.value.length / limit) + 1;
})
const onRefresh = async () => {
    loading.value = true
    finished.value = false
    refreshing.value = true;
    await onLoadMore()
}
const onLoadMore = async () => {
    if (finished.value) return;
    if (refreshing.value) {
        // 清空列表
        list.value = []
        total.value = 0;
    }
    loading.value = true;
    const data = await fetchProducts(page.value, limit, true);
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
    if (list.value.length >= total.value) {
        finished.value = true;
    }
}

onMountedOrActivated(() => {
    onRefresh()
})

</script>
<style lang="scss" scoped>
</style>