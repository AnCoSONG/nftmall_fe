<template>
    <div class="order-list">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <!-- todo: 自定义 finished text 槽 -->
            <van-list v-model:loading="loading" :finished="finished" finished-text="已显示所有订单" v-if="list.length > 0"
                @load="onLoadMore">
                <OrderItem v-for="item in list" :data="item" @request-refresh="onRefresh"/>
            </van-list>
            <Empty v-else />
        </van-pull-refresh>
    </div>
</template>
<script setup lang='ts'>
import { computed, onDeactivated, ref, toRef } from 'vue';
import OrderItem from './OrderItem.vue'
import Empty from '../../../components/Empty.vue'
import { useUserStore } from '../../../stores/user';
import { onMountedOrActivated } from '@vant/use';
import { fetchOrders } from '../../../api';
type PropType = {
    query: 'all' | "paid" | "unpaid" | "canceled" | "pending" | "failed" | "processing" | "success"
}
const user = useUserStore()
const props = defineProps<PropType>()
const query = toRef(props, 'query')
const refreshing = ref(false); // 表示上拉刷新中
const loading = ref(false); // 表示下拉加载中
const finished = ref(false); // 表示没有更多
const limit = 5;
const total = ref(0);
const page = computed(() => {
    return Math.floor(list.value.length / limit) + 1;
})
const list = ref<Order[]>([])
const onRefresh = async () => {
    loading.value = true
    finished.value = false
    refreshing.value = true;
    await onLoadMore()
}

const onLoadMore = async () => {
    if (refreshing.value) {
        list.value = []
        refreshing.value = false;
    }
    loading.value = true;
    const data = await fetchOrders(page.value, limit, true, query.value);
    console.log(data);
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
onMountedOrActivated(async () => {
    await onRefresh()
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