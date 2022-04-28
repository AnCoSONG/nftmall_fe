<template>
    <div class="text">{{ title }}</div>
</template>
<script setup lang='ts'>
import { useStore } from '../../stores/app';
import { storeToRefs } from 'pinia'
const app = useStore()
const { title } = storeToRefs(app)
</script>
<style lang="scss">
.text {
    font-size: px2rem(24);
}
</style>