<template>
    <div class="transfer-item">
        <div class="top-status" :class="statusClass">
            {{ statusText }}
        </div>
        <div class="info" :class="{ actived: detailActived }">
            <div class="basic-info" @click="toggleDetails">
                <van-image :src="data.sender?.avatar" fit="cover" class="avatar">
                    <template #loading>
                        <ImageLoader></ImageLoader>
                    </template>
                </van-image>
                <div class="progress-bar sender" :class="statusClass">
                    ❯❯❯❯❯❯
                </div>
                <van-image :src="data.original_product_item.product?.preview_img" fit="cover" class="product">
                    <template #loading>
                        <ImageLoader></ImageLoader>
                    </template>
                </van-image>
                <div class="progress-bar receiver" :class="statusClass">
                    ❯❯❯❯❯❯
                </div>
                <van-image :src="data.receiver?.avatar" fit="cover" class="avatar">
                    <template #loading>
                        <ImageLoader></ImageLoader>
                    </template>
                </van-image>
            </div>
            <div class="extend-details">
                <div class="dashed-line"></div>
                <div class="box">
                    <KeyValueLine key-text="转赠人"
                        :value="data.sender_id === user.data.id ? '您自己' : (data.sender?.username ?? '...')" />
                    <KeyValueLine key-text="转赠手机号" :value="data.sender ? hidePhone(data.sender.phone) : '...'" />
                    <KeyValueLine key-text="接收人"
                        :value="data.receiver_id === user.data.id ? '您自己' : (data.receiver?.username ?? '...')" />
                    <KeyValueLine key-text="接收手机号" :value="data.receiver ? hidePhone(data.receiver?.phone) : '...'" />
                    <KeyValueLine key-text="转赠类型" :value="transferLaunchTypeText" />
                    <KeyValueLine key-text="转赠状态" :value="statusText" />
                    <KeyValueLine v-if="data.launch_type !== TransferLaunchType.USER" key-text="外部订单号"
                        :value="data.out_trade_id ?? '...'" />
                    <KeyValueLine key-text="藏品系列ID" :value="data.original_product_item.product?.id ?? '...'"
                        :copy="true" />
                    <KeyValueLine key-text="藏品系列链上ID" :value="data.nft_class_id" :copy="true" />
                    <KeyValueLine key-text="藏品链上ID" :value="data.nft_id" :copy="true" />
                    <KeyValueLine v-if="data.receiver_id === user.data.id" key-text="接收的藏品ID"
                        :value="data.target_product_item_id ?? '...'" :copy="true" />
                    <KeyValueLine key-text="操作ID" :value="data.operation_id ?? '...'" :copy="true" />
                    <KeyValueLine key-text="交易哈希" :value="data.tx_hash ?? '...'" :copy="true" />
                    <KeyValueLine key-text="转赠成功时间"
                        :value="new Date(data.tx_success_time!).toLocaleString() ?? '...'" />
                </div>
            </div>
        </div>
        <div class="btns">
            <div class="btn" @click="toggleDetails">{{ detailActived ? '收起' : '展开' }}详细信息</div>
            <div class="btn" @click="goCheckOnChain">查询链上信息</div>
            <div class="btn" v-if="data.receiver_id === user.data.id" @click="goCheckReceivedCollection">查看接收藏品</div>
        </div>
    </div>
</template>
<script setup lang='ts'>
import { computed } from '@vue/reactivity';
import ImageLoader from '../../../components/ImageLoader.vue';
import { ref, toRef } from 'vue';
import KeyValueLine from '../../../components/KeyValueLine.vue';
import { useUserStore } from '../../../stores/user';
import { Dialog } from 'vant';
import { useRouter } from 'vue-router';
import { hidePhone } from '../../../utils';
const user = useUserStore()
const router = useRouter()
const props = defineProps<{
    data: TransferItem
}>()
const data = toRef(props, 'data')
const extended = ref(false)
enum TransferStatus {
    SUCCESS = "success", // 成功
    PROCESSING = "processing", // 处理中
    FAILED = "failed", // 转赠失败
    PENDING = "pending", // 待处理
}
enum TransferLaunchType {
    USER = "user",
    DINGBLOCK = "dingblock",
    OTHER = "other",
}
const statusText = computed(() => {
    switch (data.value.status) {
        case TransferStatus.PENDING:
            return '待处理'
        case TransferStatus.PROCESSING:
            return '处理中'
        case TransferStatus.SUCCESS:
            return '转赠成功'
        case TransferStatus.FAILED:
            return '转赠失败'
        default:
            return '待处理...'
    }
})
const statusClass = computed(() => {
    switch (data.value.status) {
        case TransferStatus.PENDING:
            return 'pending'
        case TransferStatus.PROCESSING:
            return 'processing'
        case TransferStatus.SUCCESS:
            return 'success'
        case TransferStatus.FAILED:
            return 'failed'
        default:
            return 'pending'
    }
})
const transferLaunchTypeText = computed(() => {
    switch (data.value.launch_type) {
        case TransferLaunchType.USER:
            return '主动转赠'
        case TransferLaunchType.DINGBLOCK:
            return '钉链'
        case TransferLaunchType.OTHER:
            return '其他'
        default:
            return '其他'
    }
})
const productItemId = computed(() => {
    if (data.value.sender_id === user.data.id) {
        // 用户是发起人，展示原始藏品ID
    }
})

const detailActived = ref(false)

const toggleDetails = () => {
    detailActived.value = !detailActived.value
}

const goCheckOnChain = () => {
    Dialog.confirm({
        title: '提示',
        message: '请您复制上方的藏品信息如交易哈希、藏品链上ID等,在文昌链浏览器内验证链上转赠记录。'
    }).then(() => {
        window.location.href = 'https://explorer.wenchang.bianjie.ai/' // todo: 待修改为正式链
    }).catch(() => {
        // do nothing
    })
}

const goCheckReceivedCollection = () => {
    if (data.value.status === TransferStatus.SUCCESS) {
        router.push(`/collection/${data.value.target_product_item_id}`)
    } else if (data.value.status === TransferStatus.FAILED) {
        Dialog.alert({
            title: '提示',
            message: '转赠失败，无法查看接收藏品'
        })
    } else if (data.value.status === TransferStatus.PENDING) {
        Dialog.alert({
            title: '提示',
            message: '转赠还未处理，请耐心等待'
        })
    } else {
        Dialog.alert({
            title: '提示',
            message: '转赠处理中，请耐心等待'
        })
    }
}
</script>
<style lang="scss" scoped>
.transfer-item {
    width: 100%;
    height: 100%;
    background-color: $boxBgColor;
    border-radius: px2rem(8);
    overflow: hidden;
    // padding: px2rem(16);
    box-sizing: border-box;
    margin-bottom: px2rem(20);
    box-shadow: 0 px2rem(4) px2rem(4) 0 rgba(0, 0, 0, 0.25);

    .top-status {
        font-size: px2rem(12);
        color: $normalTextColor;
        text-align: center;
        padding: px2rem(8) 0;
        // border-top-left-radius: px2rem(8);
        // border-top-right-radius: px2rem(8);
        box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.25);
        // margin-bottom: px2rem(10);
        // background-color: ;

        &.pending {
            background-color: #565656;
        }

        &.processing {
            background-color: #5991B1;
        }

        &.success {
            background-color: #74A44E;
        }

        &.failed {
            background-color: #A44E4E;
        }
    }

    .info {
        width: 100%;
        position: relative;
        padding: 0 px2rem(17);
        box-sizing: border-box;
        max-height: px2rem(102);
        overflow: hidden;
        transition: max-height 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55);

        &.actived {
            max-height: px2rem(450);
        }


        .basic-info {
            width: 100%;
            display: flex;
            padding: px2rem(20) 0;
            box-sizing: border-box;
            flex-flow: nowrap row;
            align-items: center;
            justify-content: space-between;

            .avatar {
                width: px2rem(36);
                height: px2rem(36);
                object-fit: cover;
                border-radius: 50%;
                overflow: hidden;
                border: 1px solid #E5E5E5;
            }

            .product {
                width: px2rem(60);
                height: px2rem(60);
                object-fit: cover;
                border-radius: px2rem(8);
                overflow: hidden;
                border: 1px solid #E5E5E5;
                box-shadow: 0px px2rem(4) px2rem(4) 0px rgba(0, 0, 0, 0.1);
            }


            .progress-bar {
                font-size: px2rem(18);
                letter-spacing: px2rem(4);

                &.sender {
                    &.pending {
                        color: #565656;
                    }

                    &.processing {
                        color: #5991B1;
                    }

                    &.success {
                        color: #96c372;
                    }

                    &.failed {
                        color: #A44E4E;
                    }
                }

                &.receiver {
                    &.pending {
                        color: #565656;
                    }

                    &.processing {
                        color: #565656;
                    }

                    &.success {
                        color: #96c372;
                    }

                    &.failed {
                        color: #A44E4E;
                    }
                }
            }
        }

        .extend-details {
            width: 100%;
            position: relative;
            padding-bottom: px2rem(17);
            box-sizing: border-box;

            .dashed-line {
                height: 1px;
                width: 100%;
                background-color: $boxBgColorLight;
                // margin-top: px2rem(4);
                margin-bottom: px2rem(17);
            }

            .box {
                position: relative;
                width: 100%;
                font-size: px2rem(14);
                // padding: px2rem()

            }
        }
    }

    .btns {
        width: 100%;
        position: relative;
        display: flex;
        flex-flow: nowrap row;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #343434;
        background-color: $boxBgColor;

        .btn {
            flex: 1;
            font-size: px2rem(14);
            text-align: center;
            padding: px2rem(17) 0;
            box-sizing: border-box;
            border-right: 1px solid #343434;

            &:last-child {
                border-right: none;
            }

            &:active {
                background-color: #565656;
            }
        }
    }
}
</style>