<template>
    <div class="login">
        <!-- <van-icon name="arrow-left"></van-icon> -->
        <!-- <van-image :src="logoFff" class="logo" @click="router.push('/')"></van-image>
        <div class="product-name" @click="router.push('/')">
            {{ app.mall_name }}
        </div> -->
        <MallInfo :infoSize="32" :marginBottom="60" @click="router.push({ path: '/' })" />
        <div class="form phone">
            <div class="label">
                <van-icon :name="phoneSvg" class="icon"></van-icon>
                <span class="text">手机号</span>
            </div>
            <div class="input">
                <div class="prefix">+86</div>
                <input class="inner-input" type="text" label="请输入手机号" v-model="phone" />
                <!-- todo 完善获取验证码按钮的逻辑，三种状态 待发送，已发送，输入有误或者时间没到不能发送 -->
                <div class="suffix" :data-disabled="disabled" @click="getVerification()" v-if="!showingCountDown">
                    获取验证码
                </div>
                <div class="suffix" v-else>
                    已发送 {{ countDownCurrent.seconds }}秒
                </div>
            </div>
            <div class="error" :data-show="errorText !== ''">
                {{ errorText }}
            </div>
        </div>
        <div class="form verification-code">
            <div class="label">
                <van-icon :name="lockSvg" class="icon"></van-icon>
                <span class="text">验证码</span>
            </div>
            <van-password-input class="code-input" :value="verifiedCode" :mask="false" :focused="showKeyboard"
                @focus="showKeyboard = true" />
        </div>
        <div class="login-btn">
            <div class="agreement">
                <van-checkbox shape="square" v-model="isAgree" checked-color="green">
                    <span class="text">我已阅读并同意《<router-link to="/doc?t=平台协议">平台协议</router-link>》以及《<router-link
                            to="/doc?t=隐私协议">隐私协议</router-link>》</span>
                </van-checkbox>
            </div>
            <div class="btn" @click="() => login()">登录</div>
            <div class="info">未注册账户将自动注册。</div>
        </div>
    </div>
    <van-number-keyboard v-model="verifiedCode" :show="showKeyboard" @blur="showKeyboard = false" />
</template>
<script setup lang="ts">
import { computed, onDeactivated, onUnmounted } from "vue";
import { ref, watch } from "vue";
import logoFff from "../../assets/logo-fff.png";
import phoneSvg from "../../assets/phone.svg";
import lockSvg from "../../assets/lock.svg";
import { useAppStore } from "../../stores/app";
import { phoneTest } from "../../utils";
import { sendCode } from "../../api/index";
import { useUserStore } from "../../stores/user";
import { onMountedOrActivated, useCountDown } from "@vant/use";
import { useRouter } from "vue-router";
import { useAxios } from "../../plugins/axios";
import { Notify, Toast } from "vant";
import { useRoute } from "vue-router";
import MallInfo from "../home/components/subcomponents/MallInfo.vue";
const props = defineProps({
    backTo: {
        type: String,
        default: "/user",
        required: false,
    }
})
const route = useRoute()
const axios = useAxios();
const router = useRouter();
const app = useAppStore();
const user = useUserStore();
const phone = ref("");
const disabled = ref(true);
const showingCountDown = ref(false);
const countDown = useCountDown({
    time: 60 * 1000,
    onFinish: () => {
        // console.log('countDown onFinish')
        showingCountDown.value = false;
        countDown.reset();
    },
});
const countDownCurrent = countDown.current;
watch(phone, (newVal) => {
    if (phoneTest(newVal)) {
        disabled.value = false;
    } else {
        disabled.value = true;
    }
});

const errorText = computed(() => {
    if (phone.value.length === 0) {
        return "";
    } else if (!phoneTest(phone.value)) {
        return "请输入正确的手机号";
    } else {
        return "";
    }
});

const verifiedCode = ref("");
const showKeyboard = ref(false);

const isAgree = ref(false);

onMountedOrActivated(() => {
    // check if login
    if (user.isLogin) {
        router.push("/");
    }
});
onDeactivated(() => {
    phone.value = "";
    verifiedCode.value = "";
    disabled.value = true;
    showKeyboard.value = false;
    isAgree.value = false;
})

onUnmounted(() => {
    // init
    phone.value = "";
    verifiedCode.value = "";
    disabled.value = true;
    showKeyboard.value = false;
    isAgree.value = false;
});

const getVerification = async () => {
    if (disabled.value) {
        Notify({
            type: "danger",
            message: "请输入正确的手机号后再试",
        });
        return;
    }
    // const res = await axios.post('/v1/verification')
    // const data = res.data;
    const data = await sendCode(phone.value);
    if (data == 200) {
        Notify({
            type: "success",
            message: "验证码已发送",
            background: '#aaaaaa'
        });
        countDown.start();
        showingCountDown.value = true;
    } else if (data == 201) {
        Notify({
            type: 'warning',
            message: '验证码已发送，请检查短信',
            // background: '#aaaaaa'
        })
    } else if (data === 209) {
        Notify({
            type: 'warning',
            message: "验证码已发送，但服务可能异常"
        })
        countDown.start();
        showingCountDown.value = true;
    } else {
        // do nothing because send code has error handlers
        // console.log("验证码发送失败, 请稍后重试");
        
    }
};
// console.log(props.backTo, route.params);
const login = async () => {
    if (!phoneTest(phone.value)) {
        Notify({
            type: "danger",
            message: "请输入正确的手机号",
        });
        return;
    }
    if (verifiedCode.value.length === 0) {
        Notify({
            type: "danger",
            message: "请输入验证码",
        });
        return;
    }
    if (!isAgree.value) {
        Notify({
            type: "danger",
            message: "请同意用户协议",
        });
        return;
    }
    const toast = Toast.loading({
        message: '请稍等...',
        forbidClick: true,
        loadingType: 'circular',
        duration: 0
    })
    const res = await user.login(phone.value, verifiedCode.value);
    toast.clear();
    if (res) {
        if (!user.firstBack) {
            // 如果用户都没有进入首页就登录成功
            // 会导致两个Notify同时出现，所以这里要判断一下
            Notify({
                type: "success",
                message: "登录成功",
                background: "#aaaaaa"
            })
        }
        router.push(props.backTo);
    } else {
        // do nothing
    }
};
</script>
<style lang="scss" scoped>
.login {
    width: 100%;
    color: $normalTextColor;
    padding: px2rem(56) px2rem(26);
    padding-bottom: 0;
    box-sizing: border-box;
    display: flex;
    flex-flow: nowrap column;
    justify-content: flex-start;
    align-items: flex-start;

    .logo {
        width: px2rem(calc(1408 / 745 * 50));
        height: px2rem(50);
        margin-bottom: px2rem(20);
    }

    .product-name {
        font-size: px2rem(24);
        font-weight: bold;

        margin-bottom: px2rem(50);
    }

    .form {
        width: 100%;
        display: flex;
        flex-flow: nowrap column;
        align-items: flex-start;
        justify-content: flex-start;
        position: relative;

        .label {
            margin-bottom: px2rem(12);
            display: inline-flex;
            justify-content: center;
            align-items: center;

            .icon {
                font-size: px2rem(24);
                margin-right: px2rem(6);
            }

            .text {
                // display: inline-block;
                font-size: px2rem(16);
            }
        }

        .input {
            width: 100%;
            // height: px2rem(54);
            padding: px2rem(16) px2rem(16);
            // border: 2px solid white;
            box-sizing: border-box;
            border-radius: px2rem(8);
            background-color: $boxBgColorLight;
            display: flex;
            box-shadow: 0 px2rem(4) px2rem(4) 0 rgba(0, 0, 0, 0.25);
            display: flex;
            flex-flow: nowrap row;
            justify-content: flex-start;
            align-items: center;
            z-index: 1;

            .prefix {
                font-size: px2rem(20);
                border-radius: px2rem(4);
                background-color: $backgroundColor;
                padding: px2rem(4) px2rem(8);
                box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.25);
                margin-right: px2rem(8);
            }

            .inner-input {
                display: block;
                // padding-right: 0;
                flex: 1;
                min-width: 50px;
                background: none;
                outline: none;
                border: 0px;
                box-sizing: border-box;
                font-size: px2rem(20);
                margin-right: px2rem(8);
            }

            .suffix {
                font-size: px2rem(16);
                border-radius: px2rem(4);
                // border: 2px solid white;
                padding: px2rem(8) px2rem(8);
                box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
                background-color: $greyTextColor;
                user-select: none;

                // flex-shrink: 0;
                // width: 100px;

                &[data-disabled="false"] {
                    background: $lightRedColor;

                    &:active {
                        background: $dangerColor;
                    }
                }
            }
        }

        .error {
            z-index: 0;
            background-color: $dangerColor;
            font-size: px2rem(12);
            margin-top: px2rem(8);
            width: 100%;
            text-align: center;
            padding: px2rem(8) px2rem(8);
            box-sizing: border-box;
            border-radius: px2rem(8);
            box-shadow: inset 0 px2rem(4) px2rem(4) 0 rgba(0, 0, 0, 0.25);
            transform: translateY(px2rem(-50));
            transition: transform 0.3s ease-in-out;
            margin-bottom: px2rem(20);

            &[data-show="true"] {
                transform: translateY(0);
            }
        }
    }

    .verification-code {
        .code-input {
            width: 100%;
            display: block;
            box-sizing: border-box;
            margin: 0;
            box-shadow: 0px px2rem(4) px2rem(4) 0 rgba(0, 0, 0, 0.25);
            // overflow: hidden;
            // border-radius: px2rem(8);
            margin-bottom: px2rem(50);
        }
    }

    .login-btn {
        // margin-top: px2rem);
        width: 100%;
        display: flex;
        flex-flow: nowrap column;
        justify-content: flex-start;
        align-items: flex-start;

        .agreement {
            font-size: px2rem(14);
            color: white;
            padding-left: 0;
            padding-right: 0;
            margin-bottom: px2rem(12);

            .text {
                color: white;

                a {
                    color: rgb(188, 204, 222);
                }
            }
        }

        .btn {
            border-radius: px2rem(8);
            background-color: $glodTextColor;
            font-size: px2rem(20);
            width: 100%;
            color: black;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: px2rem(14) px2rem(10);
            box-sizing: border-box;
            margin-bottom: px2rem(12);
        }

        .info {
            color: $greyTextColor;
            font-size: px2rem(12);
            align-self: center;
        }
    }
}
</style>
