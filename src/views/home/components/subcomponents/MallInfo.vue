<template>
    <div class="mall-info" :style="{marginBottom: px2rem(props.marginBottom)}">
        <img class="logo" :src="logo" :style="{ height: px2rem(props.infoSize) }" />
        <div class="text" :style="{ fontSize: px2rem(props.infoSize) }">
            {{ app.mall_name }}
        </div>
    </div>
</template>
<script setup lang='ts'>
import { useAppStore } from '../../../../stores/app';
import { px2rem } from '../../../../utils';
const app = useAppStore()
const props = defineProps({
    infoSize: {
        type: Number,
        default: 24
    },
    marginBottom: {
        type: Number,
        default: 20
    }
})
const logo = 'https://mall-1308324841.file.myqcloud.com/static/mall_logo_1.png'
</script>
<style lang="scss" scoped>
.mall-info {
    margin-top: px2rem(10);
    // font-family: serif;
    // background-color: #fff;
    margin-bottom: px2rem(20);
    // font-size: px2rem(32);
    color: $normalTextColor;
    display: flex;
    flex-flow: nowrap row;
    // justify-content: center;
    align-items: center;
    filter: drop-shadow(0 0 px2rem(2) rgba(255, 255, 255, 0.4));

    .logo {
        // width: px2rem(32);
        // height: px2rem(32);
        display: block;
        margin-right: px2rem(10);
    }

    .text {
        // display: inline-block;
        color: #ccc;
        font-weight: bold;

    }
}
</style>