<template>
    <div class="user-info">
        <div class="basic" v-if="user.isLogin">
            <van-image :src="user.data.avatar" class="avatar" round>
                <template #loading>
                    <ImageLoader/>
                </template>
            </van-image>
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
        <div class="address" v-if="user.isLogin && user.data.bsn_address != null">
            <div class="text">区块链地址: {{ user.data.bsn_address }}</div>
            <div class="copy" v-clipboard:copy="user.data.bsn_address" v-clipboard:success="onCopySuccess"
                v-clipboard:error="onCopyError">
                <van-icon :name="copySvg" />
            </div>
        </div>
        <div class="not-on-chain" v-else-if="user.isLogin && user.data.bsn_address == null" @click="onNotOnChain">
            您的账户暂未上链
        </div>
        <!-- <div v-else-if="user.data.bsn_address == null">
            即将上链
        </div>
        <div v-else></div> -->
    </div>
</template>
<script setup lang="ts">
import { useUserStore } from "../../../../stores/user";
import { toClipboard } from "@soerenmartius/vue3-clipboard";
import { Dialog } from "vant";
import { onCopySuccess, onCopyError } from "../../../../utils";
import copySvg from "../../../../assets/copy.svg";
import { useRouter } from "vue-router";
import ImageLoader from "../../../../components/ImageLoader.vue";
const router = useRouter();
const user = useUserStore();

const routeToLogin = () => {
    router.push("/login");
};

const onNotOnChain = () => {
    Dialog.alert({
        title: "未激活",
        message: "您的账户目前未上链!\n您可以通过<strong>购买藏品</strong>来创建链上账户",
        allowHtml: true,
    });
};
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
            box-shadow: 0 0 0 px2rem(2) $normalTextColor;
            border: 2px solid $backgroundColor;
            border-radius: 50%;
            background-color: $normalTextColor;
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
                color: $greyTextColor;
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
        box-shadow: inset 0px px2rem(4) px2rem(4) rgba(0, 0, 0, 0.25);

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

    .not-on-chain {
        width: 100%;
        box-sizing: border-box;
        // height: px2rem(20);
        border-radius: px2rem(8);
        font-size: px2rem(16);
        padding: px2rem(8) px2rem(16);
        // line-height: px2rem(20);
        text-align: center;
        color: $normalTextColor;
        background-color: $dangerColor;
        box-shadow: 0px px2rem(4) px2rem(4) 0px rgba(0, 0, 0, 0.25);
    }
}
</style>
