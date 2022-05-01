<template>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh()">
        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoadMore()"
            v-if="app.hot.length > 0">
            <ProductCard :id="item.id" :name="item.name" :preview_img="item.preview_img" :count="item.count"
                :type="item.type" :price="item.price" :tags="item.tags" :stock_count="item.stock_count"
                :limit="item.limit" :creator="item.creator" :sale_timestamp="item.sale_timestamp"
                :classname="item.classname" :details="item.details" v-for="item in app.hot"></ProductCard>
        </van-list>
        <van-empty v-else :image-size="px2rem(80)" description="这里空空如也" image="https://cdn.jsdelivr.net/npm/@vant/assets/custom-empty-image.png">
        </van-empty>
    </van-pull-refresh>
</template>
<script setup lang='ts'>
import ProductCard from './ProductCard.vue';
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
    const res = await axios.get('/v1/product')
    if (res) {
        app.setHotProduct(res.data.data)
    } else {
        app.setHotProduct([])
    }
    loading.value = false;
    refreshing.value = false;
}

/**
 * todo: 根据生产环境情况完善加载更多
 */
const onLoadMore = async () => {
    if (finished.value) return;
    loading.value = true;
    const res = await axios.get('/v1/product')
    if (res) {
        app.setHotProduct(res.data.data)
    } else {
        app.setHotProduct([])
    }
    loading.value = false;
    finished.value = true;
}
</script>
<style lang="scss" scoped>
</style>