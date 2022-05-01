<template>
    <div class="user">
        <div class="top-controls">
            <div class="setting-control">
                <van-icon name="setting-o" color="#898989" />
            </div>
        </div>
        <UserInfo></UserInfo>
        <UserMain></UserMain>

    </div>
</template>
<script setup lang='ts'>
import UserInfo from './subcomponents/UserInfo.vue';
import UserMain from './subcomponents/UserMain.vue'
// todo: 用户态!!!
</script>
<style lang="scss" scoped>
.user {
    padding: px2rem(17) px2rem(28);
    padding-bottom: 0;
    box-sizing: border-box;
    margin-bottom: px2rem(72);

    .top-controls {
        display: flex;
        flex-flow: nowrap row-reverse;
        font-size: px2rem(28);
        margin-bottom: px2rem(38);
    }
}
</style>