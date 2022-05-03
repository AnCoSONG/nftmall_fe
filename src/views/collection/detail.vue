<template>
    <Subpage title="藏品详情" shareable>
        藏品详情 {{id}}
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
</style>