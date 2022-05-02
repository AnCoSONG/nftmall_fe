<template>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh()">
        <van-list v-model:loading="loading" :finished="finished" finished-text="已加载全部内容" @load="onLoadMore()"
            v-if="list.length > 0">
            <ProductCard :data="item" v-for="item in list"></ProductCard>
        </van-list>
        <Empty v-else />
    </van-pull-refresh>
</template>
<script setup lang='ts'>
import ProductCard from './ProductCard.vue';
import Empty from '../../../../components/Empty.vue';
import { ref } from 'vue';
import { onMountedOrActivated } from '@vant/use';

const finished = ref(false)
const loading = ref(false)
const refreshing = ref(false)
const list = ref<Product[]>([])
const onRefresh = async () => {
    loading.value = true
    finished.value = false
    await onLoadMore()
}
const onLoadMore = async () => {
    setTimeout(() => {
        if (refreshing.value) {
            list.value = []
            refreshing.value = false;
        }
        for (let i = 0; i < 12; i++) {
            // 模拟添加数据
            list.value.push({
                id: 1,
                name: "测试商品",
                preview_img: "https://img.yzcdn.cn/vant/apple-1.jpg",
                type: "image",
                classname: "",
                count: 1,
                creator: {
                    avatar: "https://img.yzcdn.cn/vant/apple-1.jpg",
                    name: "创作者",
                },
                details: {},
                price: "10.50",
                tags: [{
                    text: '测试',
                    mode: 'dark',
                }, {
                    text: '测试',
                    mode: 'light'
                }],
                sale_timestamp: Date.now() + 1000 * 60 * 5,
                stock_count: 800,
                limit: 1,
            })
        }
        if (list.value.length > 40) {
            finished.value = true;
        }
        loading.value = false;
        // finished.value = true;
        console.log('load more', list.value)
    }, 500)
}

onMountedOrActivated(() => {
    onRefresh()
})

</script>
<style lang="scss" scoped>
</style>