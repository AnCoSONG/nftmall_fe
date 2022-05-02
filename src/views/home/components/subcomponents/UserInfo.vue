<template>
    <div class="user-info">
        <div class="basic" v-if="user.isLogin">
            <van-image :src="user.data.avatar" class="avatar" round></van-image>
            <div class="name-credit">
                <div class="name">{{ user.data.username }}</div>
                <div class="credit">积分: {{ user.data.credit }}</div>
            </div>
            <!-- todo 用户信息详情页 -->
            <div class="right" @click="router.push('/account')">
                <van-icon name="arrow" />
            </div>
            <div class="right-arrow"></div>
        </div>
        <div class="basic" v-else @click="routeToLogin">请登录</div>
        <div class="address" v-show="user.isLogin">
            <div class="text">
                区块链地址: {{ user.data.chain_address }}
            </div>
            <div class="copy" v-clipboard:copy="user.data.chain_address" v-clipboard:success="onCopySuccess"
                v-clipboard:error="onCopyError">
                <van-icon :name="copySvg" />
            </div>
        </div>
    </div>
</template>
<script setup lang='ts'>
import { useUserStore } from '../../../../stores/user';
import { toClipboard } from '@soerenmartius/vue3-clipboard'
import { Notify } from 'vant';
import copySvg from '../../../../assets/copy.svg'
import { useRouter } from 'vue-router';
const router = useRouter();
const user = useUserStore();

const onCopySuccess = () => {
    Notify({
        type: 'success',
        message: "复制成功",
    })
}

const onCopyError = () => {
    Notify({
        type: 'danger',
        message: "复制失败",
    })
}

const routeToLogin = () => {
    router.push('/login');
}
</script>
<style lang="scss" scoped>
.user-info {
    display: flex;
    flex-flow: nowrap column;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: px2rem(20);

    .basic {
        display: flex;
        flex-flow: nowrap row;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        margin-bottom: px2rem(18);
        color: $normalTextColor;


        .avatar {
            width: px2rem(54);
            height: px2rem(54);
            margin-right: px2rem(19);
        }

        .name-credit {
            flex: 1;
            display: flex;
            flex-flow: nowrap column;
            justify-content: flex-start;
            align-items: flex-start;

            .name {
                font-size: px2rem(20);
                margin-bottom: px2rem(6);
                color: $normalTextColor;
            }

            .credit {
                font-size: px2rem(12);
                color: $greyTextColor
            }
        }

        .right {
            font-size: px2rem(20);
            color: $normalTextColor;
        }
    }

    .address {
        width: 100%;
        display: flex;
        flex-flow: nowrap row;
        align-items: center;
        justify-content: flex-start;
        font-size: px2rem(12);
        border-radius: px2rem(8);
        color: $greyTextColor;
        padding: px2rem(4) px2rem(6);
        box-sizing: border-box;
        background-color: #1b1b1b;
        box-shadow: inset 0px px2rem(4) px2rem(4) rgba(0, 0, 0, .25);

        .text {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .copy {
            font-size: px2rem(16);
            line-height: px2rem(16);
        }
    }
}
</style>