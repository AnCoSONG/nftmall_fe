<template>
    <div class="waiting">
        <van-loading vertical size="100" v-if="status === 'loading'">请耐心等候，不要返回</van-loading>
        <div class="success" v-else-if="status === 'success'">
            <van-icon class="icon" name="passed" />
            <div class="text">支付成功</div>
            <div class="desc"> {{ countDown.current.value.seconds }} 秒后跳转至订单页面</div>
        </div>
        <div class="failure" v-else>
            <van-icon class="icon" name="close" />
            <div class="text">支付失败</div>
            <div class="desc"> {{ countDown.current.value.seconds }} 秒后跳转至订单页面</div>
        </div>
    </div>
</template>
<script lang="ts">
export default {
    name: 'payment_waiting'
}
</script>
<script setup lang='ts'>
import { ref, onMounted, watch, toRef } from 'vue';
import { Notify } from 'vant';
import { useCountDown, onMountedOrActivated } from '@vant/use';
import { useRouter } from 'vue-router';
import { fetchPaymentStatus, queryPayment } from '../../api';
import { PaymentStatus } from '../../utils';
const router = useRouter()
const status = ref('loading')
// onMounted(() => {
//     setTimeout(() => {
//         status.value = 'success'
//     }, 500)
// })
type PropType = {
    order_id: string;
    trade_no: string;
}
const props = defineProps<PropType>();

const order_id = toRef(props, 'order_id');
const trade_no = toRef(props, 'trade_no');
onMountedOrActivated(async () => {
    for (let i = 0; i < 3; i++) {
        const paymentStatus = await fetchPaymentStatus(order_id.value);
        if (paymentStatus === PaymentStatus.PAID) {
            status.value = 'success'
            return;
        }
    }
    // 如果3次都没有拉取到
    const queryRes = await queryPayment(trade_no.value);
    if (queryRes) {
        if (queryRes.code === 0 || queryRes.code === 1) {
            status.value = 'success';
        } else {
            status.value = 'failure'
        }
    } else {
        status.value = 'failure';
    }
})

const countDown = useCountDown({
    time: 3 * 1000,
    onFinish: () => {
        if (status.value === 'success') {
            router.replace('/order')
        } else if (status.value === 'failure') {
            router.replace('/order') // 最好能直接到 /order/:id
        } else {
            router.replace('/')
        }
    }
})
watch(status, (newVal) => {
    if (newVal === 'success') {
        // 3秒后跳转至订单页面
        countDown.start()
    } else if (newVal === 'failure') {
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
        font-size: px2rem(72);
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