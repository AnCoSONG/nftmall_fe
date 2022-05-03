<template>
<!-- todo: 待实现 -->
<Subpage title="订单详情">
    <div class="order-detail">
        订单详情 {{id}}
    </div>
</Subpage>
</template>
<script setup lang='ts'>
import { toRef } from 'vue';
import Subpage from '../../components/Subpage.vue';

const props = defineProps({
    id: {
        type: String,
        default: '',
    },
})
const id = toRef(props, 'id')
</script>
<style lang="scss" scoped>
// .order-detail {

// }
</style>