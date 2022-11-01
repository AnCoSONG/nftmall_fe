<template>
    <div class="transfer-list">
        <div class="total">
            共 {{ total }} 次转赠
        </div>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功">
            <van-list
                v-if="list.length > 0"
                v-model:loading="loading"
                :finished="finished"
                finished-text="已显示所有转赠记录"
                @load="onLoadMore"
            >
                <TransferItem v-for="item in list" :data="item" :key="item.id" />
            </van-list>
            <Empty v-else />
        </van-pull-refresh>
    </div>
</template>
<script setup lang='ts'>
import TransferItem from './TransferItem.vue';
import { onMountedOrActivated } from '@vant/use';
import { computed } from '@vue/reactivity';
import { ref } from 'vue';
import { fetchTransferItems } from '../../../api';
import Empty from '../../../components/Empty.vue';

const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const limit = 10;
const total = ref(0);
const page = computed(() => {
    return Math.floor(list.value.length / limit) + 1;
})
const list = ref<TransferItem[]>([])

const onRefresh = async () => {
    refreshing.value = true;
    loading.value = true
    finished.value = false
    await onLoadMore()
}

const onLoadMore = async () => {
    if (refreshing.value) {
        list.value = []
        refreshing.value = false;
    }
    loading.value = true
    const data = await fetchTransferItems(page.value, limit)
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
    refreshing.value = true;
    await onRefresh()
})
</script>
<style lang="scss" scoped>
.transfer-list {
    width: 100%;
    position: relative;
    margin-top: px2rem(20);

    .total {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: px2rem(12);
        color: $greyTextColor;
        margin-bottom: px2rem(20);
    }
}
</style>