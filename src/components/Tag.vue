<template>
<div class="tag" :data-mode="data.mode!==undefined?data.mode: 'light'">
    {{data.text}}
</div>
</template>
<script setup lang='ts'>
type PropType = {
    data: Tag
}
const prop = defineProps<PropType>()
</script>
<style lang="scss" scoped>
.tag {
    // font-size: px2rem(12);
    margin-right: px2rem(8);
    padding: px2rem(4);
    box-sizing: border-box;
    border-radius: px2rem(2);
    margin-bottom: px2rem(8);
    // background-color: $glodTextColor;

    &[data-mode="light"] {
        background: linear-gradient(94.63deg, #E8D9A6 14.59%, #DBC782 92.35%);
        color: black;
    }

    &[data-mode="dark"] {
        background: linear-gradient(90.23deg, #49432B 6.42%, #3A3523 99.92%);
        color: $glodTextColor;
    }
}
</style>