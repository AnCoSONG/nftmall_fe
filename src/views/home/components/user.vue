<template>
    <div class="user outer-box">
        <div class="top-controls">
            <div class="setting-control" @click="router.push('/setting')">
                <van-icon name="setting-o" color="#898989" />
            </div>
        </div>
        <UserInfo></UserInfo>
        <UserMain></UserMain>

    </div>
</template>
<script setup lang='ts'>
import { useRouter } from 'vue-router';
import UserInfo from './subcomponents/UserInfo.vue';
import UserMain from './subcomponents/UserMain.vue'
const router = useRouter()
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