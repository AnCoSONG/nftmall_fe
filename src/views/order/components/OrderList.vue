<template>
    <div class="order-list">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <!-- todo: 自定义 finished text 槽 -->
            <van-list v-model:loading="loading" :finished="finished" finished-text="已显示所有订单" v-if="list.length > 0"
                @load="onLoadMore">
                <OrderItem v-for="item in list" :data="item" />
            </van-list>
            <Empty v-else />
        </van-pull-refresh>
    </div>
</template>
<script setup lang='ts'>
import { onDeactivated, ref } from 'vue';
import OrderItem from './OrderItem.vue'
import Empty from '../../../components/Empty.vue'
import { onMountedOrActivated } from '@vant/use';
type PropType = {
    query: 'all' | 'unlinked' | 'canceled' | 'unpaied'
}

const props = defineProps<PropType>()

const refreshing = ref(false); // 表示上拉刷新中
const loading = ref(false); // 表示下拉加载中
const finished = ref(false); // 表示没有更多

const list = ref<Order[]>([])
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
        for (let i = 0; i < 10; i++) {
            list.value.push({
                id: 0,
                buyer_id: 0,
                purchase_item: {
                    id: 0,
                    product: {
                        id: 1,
                        name: '测试商品',
                        preview_img: 'https://img.yzcdn.cn/vant/apple-1.jpg',
                        price: '100.00',
                        tags: [
                        {
                            text: '测试标签',
                            mode: 'dark'
                        },
                        {
                            text: '测试标签'
                        },
                        {
                            text: '测试标签',
                            mode: 'light'
                        },
                        {
                            text: '测试标签',
                            mode: 'light'
                        },
                        {
                            text: '测试标签',
                            mode: 'light'
                        },
                        ],
                    },
                    count: 1,
                },
                order_status: ["canceled", "completed", "unlinked", "unpaied"][Math.floor(Math.random() * 4)] as OrderStatus,
                pay_method: "wechat",
                gen_credits: 0.50,
                create_at: Date.now() - 1000 * 60 * 6,
                pay_at: Date.now() - 1000 * 60 * 4.6,
                on_chain_at: Date.now() - 1000 * 60 * 3.5,
            })
        }
        loading.value = false;
        finished.value = true;
        console.log('load more', list.value)
    }, 500)
}
onMountedOrActivated(() => {
    refreshing.value = true;
    onRefresh()
})

onDeactivated(() => {
    refreshing.value = false
    loading.value = false
    finished.value = false
})
</script>
<style lang="scss" scoped>
.order-list {
    padding-top: px2rem(12);
    box-sizing: border-box;
    position: relative;
    width: 100%;


}
</style>