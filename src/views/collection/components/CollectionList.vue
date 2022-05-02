<template>
    <div class="collection-list">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <!-- todo: 自定义 finished text 槽 -->
            <van-list class="grid" v-model:loading="loading" :finished="finished" finished-text="已显示所有订单" v-if="list.length > 0"
                @load="onLoadMore">
                <CollectionItem v-for="item in list" :data="item" />
            </van-list>
            <Empty v-else />
        </van-pull-refresh>
    </div>
</template>
<script setup lang='ts'>
import CollectionItem from './CollectionItem.vue';
import Empty from '../../../components/Empty.vue';
import { ref } from 'vue';

const refreshing = ref(false)
const finished = ref(false)
const loading = ref(false)
const list = ref<BoughtItem[]>([])

const onRefresh = async () => {
    loading.value = true
    finished.value = false
    onLoadMore()
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
                id: 0,
                product: {
                    id: 1,
                    name: '测试商品',
                    preview_img: 'https://img.yzcdn.cn/vant/apple-1.jpg',
                    type: 'image',
                    creator: {
                        name: '创作者',
                        avatar: 'https://img.yzcdn.cn/vant/apple-1.jpg'
                    }
                },
                chain_address: '12321gd219gf21ge9df192gge29e91ge91',
                no: 213,
            })
        }
        loading.value = false;
        finished.value = true;
        console.log('load more', list.value)
    }, 500)
}
</script>
<style lang="scss" scoped>
.collection-list {
    width: 100%;
    position: relative;
    margin-top: px2rem(20);

    .grid {
        // display: grid;
        // grid-template-columns: 1fr 1fr;
        // grid-column-gap: px2rem(24);
    }
}
</style>