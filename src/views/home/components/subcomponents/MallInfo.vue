<template>
    <div class="mall-info">
        <img class="logo" :src="logo"/>
        <div class="text">
            {{ app.mall_name }}
        </div>
    </div>
</template>
<script setup lang='ts'>
import { useAppStore } from '../../../../stores/app';
import logo from "../../../../assets/logo-ddd.png";
const app = useAppStore()
</script>
<style lang="scss" scoped>
.mall-info {
    margin-top: px2rem(10);
    // font-family: serif;
    // background-color: #fff;
    margin-bottom: px2rem(20);
    font-size: px2rem(24);
    color: $normalTextColor;
    display: flex;
    flex-flow: nowrap row;
    // justify-content: center;
    align-items: center;
    filter: drop-shadow(0 0 px2rem(2) rgba(255, 255, 255, 0.4));

    .logo {
        // width: px2rem(32);
        height: px2rem(24);
        display: block;
        margin-right: px2rem(10);
    }

    .text {
        // display: inline-block;
        
    }
}
</style>