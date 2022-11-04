<template>
    <div class="gold-btn" :class="{disabled }">
        <slot></slot>
    </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
    disabled?: boolean
}>(), {
    disabled: false
})
</script>
<style lang="scss" scoped>
.gold-btn {
    // position: absolute;
    width: 100%;
    margin: 0 auto;
    // height: px2rem(8);
    padding: px2rem(14) 0;
    // font-weight: bold;
    // background: linear-gradient(90.71deg, rgba(255, 228, 135, 0.67) 6.07%, rgba(227, 199, 100, 0.67) 93.97%, rgba(234, 205, 107, 0.67) 93.97%);
    background: linear-gradient(94.63deg, #e8d9a6 14.59%, #dbc782 92.35%);
    letter-spacing: 2px;
    // font-weight: bold;
    border-radius: px2rem(8);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: px2rem(20);
    color: black;
    box-shadow: 0px px2rem(2) px2rem(4) 0px rgba(0, 0, 0, 0.25);

    &.disabled {
        // 背景颜色采用深色渐变
        background: linear-gradient(94.63deg, #2f2f2f 14.59%, #34322e 92.35%);
        color: #888;
    }
}
</style>
