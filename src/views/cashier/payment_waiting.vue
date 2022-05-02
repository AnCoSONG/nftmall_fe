<template>
<div class="waiting">
    <van-loading vertical size="100" v-if="status==='loading'">请耐心等候，不要返回</van-loading>
    <div class="success" v-else-if="status === 'success'">
        <van-icon class="icon" name="passed"/>
        <div class="text">支付成功</div>
        <div class="desc"> {{countDown.current.value.seconds}} 秒后跳转至订单页面</div>
    </div>
    <div class="failure" v-else>
        <van-icon class="icon" name="close"/>
        <div class="text">支付失败</div>
        <div class="desc"> {{countDown.current.value.seconds}} 秒后跳转至订单页面</div>
    </div>
</div>
</template>
<script lang="ts">
export default {
    name: 'payment_waiting'
}
</script>
<script setup lang='ts'>
import { ref, onMounted, watch} from 'vue';
import { Notify } from 'vant';
import { useCountDown } from '@vant/use';
import { useRouter } from 'vue-router';
const router = useRouter()
const status = ref('loading')
onMounted(() => {
    setTimeout(() => {
        status.value = 'success'
    }, 500)
})

const countDown = useCountDown({
    time: 3 * 1000,
    onFinish: () => {
        if(status.value === 'success') {
            router.replace('/order')
        } else if (status.value === 'failure') {
            router.replace('/order') // 最好能直接到 /order/:id
        } else {
            router.replace('/')
        }
    }
})
watch(status, (newVal) => {
    if(newVal === 'success') {
        // 3秒后跳转至订单页面
        countDown.start()
    } else if(newVal === 'failure') {
        // 3秒后跳转至订单页面
        countDown.start()
    } else {
        // 不变化
    }
})
</script>
<style lang="scss" scoped>
.waiting {
    width: 100%;
    position: relative;
    color: $normalTextColor;
    padding: px2rem(17) px2rem(17);
    padding-top: px2rem(160);
    box-sizing: border-box;

    .icon {
        font-size:px2rem(72);
    }

    .success {
        width: 100%;
        display: flex;
        flex-flow: nowrap column;
        justify-content: center;
        align-items: center;

        .text {
            font-size: px2rem(24);
            margin-top: px2rem(20);
        }

        .desc {
            font-size: px2rem(14);
            color: $greyTextColor;
            margin-top: px2rem(20);
        }
    }
}
</style>