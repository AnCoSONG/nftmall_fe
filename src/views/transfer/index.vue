<template>
    <Subpage title="我的转赠" back-to="/user">
        <GoldBtn class="launch-btn" @click="router.push('/transfer/apply')">发起转赠</GoldBtn>
        <TransferList></TransferList>
    </Subpage>
</template>
<script setup lang='ts'>
import { useRouter } from 'vue-router';
import GoldBtn from '../../components/GoldBtn.vue';
import Subpage from '../../components/Subpage.vue';
import TransferList from './components/TransferList.vue';
const router = useRouter();
</script>
<style lang="scss" scoped>
.launch-btn {
    // margin-bottom: px2rem(17);
    // width: 95%;
}
</style>