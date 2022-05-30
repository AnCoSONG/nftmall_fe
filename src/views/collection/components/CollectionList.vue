<template>
    <div class="collection-list">
        <div class="total">
            共 {{ total }} 件藏品
        </div>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <!-- todo: 自定义 finished text 槽 -->
            <van-list class="grid" v-model:loading="loading" :finished="finished" finished-text="已显示所有藏品"
                v-if="list.length > 0" @load="onLoadMore">
                <CollectionItem v-for="item in list" :data="item" />
            </van-list>
            <Empty v-else />
        </van-pull-refresh>
    </div>
</template>
<script setup lang='ts'>
import CollectionItem from './CollectionItem.vue';
import Empty from '../../../components/Empty.vue';
import { computed, ref } from 'vue';
import { onChainStatus } from '../../../utils';
import { useUserStore } from '../../../stores/user';
import { fetchProductItems } from '../../../api';
import { onMountedOrActivated } from '@vant/use';

const user = useUserStore()
const refreshing = ref(false)
const finished = ref(false)
const loading = ref(false)
const limit = 10;
const total = ref(0);
const page = computed(() => {
    return Math.floor(list.value.length / limit) + 1;
})
const list = ref<ProductItem[]>([])

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
    const data = await fetchProductItems(user.data.id, page.value, limit, true)
    console.log('藏品', data)
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
.collection-list {
    width: 100%;
    position: relative;
    margin-top: px2rem(20);

    .total {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: px2rem(12);
        color: $greyTextColor;
        margin-bottom: px2rem(30);
    }

    .grid {
        // display: grid;
        // grid-template-columns: 1fr 1fr;
        // grid-column-gap: px2rem(24);
    }
}
</style>