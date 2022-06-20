<template>
<van-empty :image-size="px2rem(80)" :description="props.description ?? '这里空空如也'" image="https://cdn.jsdelivr.net/npm/@vant/assets/custom-empty-image.png">
</van-empty>
</template>
<script setup lang='ts'>
import { px2rem } from '../utils';
type PropType = {
    description: string
}
const props = defineProps<PropType>()
</script>
<style lang="scss" scoped>

</style>