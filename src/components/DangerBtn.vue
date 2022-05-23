<template>
    <div class="danger-btn">
        <van-icon
            class="icon"
            :name="prop.icon"
            v-show="prop.icon != null"
        ></van-icon>
        <div class="text" v-if="!loading">
             {{ prop.text }}
        </div>
        <van-loading v-else color="#ddd" size="18px">加载中...</van-loading>
    </div>
</template>
<script setup lang="ts">
type PropType = {
    text: string;
    icon?: string;
    loading?: boolean;
};
const prop = defineProps<PropType>();
console.log(prop.loading)
</script>
<style lang="scss" scoped>
.danger-btn {
    margin-top: px2rem(40);
    background-color: $dangerColor;
    padding: px2rem(16) 0;
    font-size: px2rem(18);
    color: $normalTextColor;
    width: 100%;
    border-radius: px2rem(8);
    text-align: center;
    box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.25);
    display: flex;
    flex-flow: nowrap row;
    align-items: center;
    justify-content: center;

    .icon {
        margin-right: px2rem(12);
    }
}
</style>
