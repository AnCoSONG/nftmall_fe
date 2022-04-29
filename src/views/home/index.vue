<template>
    <div class="home">{{ title }}</div>
</template>
<script setup lang='ts'>
import { useStore } from '../../stores/app';
import { storeToRefs } from 'pinia'
const app = useStore()
const { title } = storeToRefs(app)
</script>
<style lang="scss">
.home {
    height: 2000px;
    overflow: auto;
}
</style>