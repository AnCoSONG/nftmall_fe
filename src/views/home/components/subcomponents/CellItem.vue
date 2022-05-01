<template>
<!-- todo: optim this implementation -->
    <div class="cell-btn" @click="() => prop.onClick?prop.onClick():false">
        <div class="icon" v-show="prop.icon != null">
            <van-icon :name="prop.icon"></van-icon>
        </div>
        <div class="text">{{prop.text}}</div>
        <div class="right">
            <van-icon name="arrow"></van-icon>
        </div>
    </div>
</template>
<script setup lang='ts'>
type Prop = {
    text: string,
    icon?: string,
    onClick?: Function
}
const prop = defineProps<Prop>()
</script>
<style lang="scss" scoped>
.cell-btn {
    width: 100%;
    border-radius: px2rem(8);
    padding: px2rem(16) px2rem(16);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-flow: nowrap row;
    color: $normalTextColor;
    box-sizing: border-box;
    background-color: $boxBgColorLight;
    margin-bottom: px2rem(20);
    box-shadow: 0px px2rem(4) px2rem(4) 0px rgba(0, 0, 0, 0.25);

    &:last-child {
        margin-bottom: 0;
    }

    &:active {
        background-color: $boxBgColor;
    }

    .icon {
        font-size: px2rem(20);
        margin-right: px2rem(12);
    }

    .text {
        flex: 1;
        font-size: px2rem(18);
    }

    .right {
        font-size: px2rem(16);
    }
}
</style>