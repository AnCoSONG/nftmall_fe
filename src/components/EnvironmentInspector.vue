<template>
    <div class="orientation-inspector" :style="{ height: orientation == 0 && isMobile ? 'auto' : '100%' }">
        <div v-if="orientation == 0 && isMobile">
            <van-config-provider :theme-vars="themeStore.componentVars">
                <RouterView v-slot="{ Component }">
                    <template v-if="Component">
                        <KeepAlive
                            exclude="cashier,payment_waiting,product,verification,order,account,order-detail,collection-detail">
                            <Suspense>
                                <component :is="Component"></component>
                                <template #fallback>
                                    <van-overlay :show="true">
                                        <div class="app-loader">
                                            <van-loading vertical>加载中</van-loading>
                                        </div>
                                    </van-overlay>
                                </template>
                            </Suspense>
                        </KeepAlive>
                    </template>
                </RouterView>
            </van-config-provider>
        </div>
        <div v-else class="wrapper">
            <div class="app-gold-text info-text">
                {{
                        orientation != 0
                            ? "请在竖屏环境下使用"
                            : isMobile
                                ? "未知错误"
                                : "本页面仅支持移动设备"
                }}
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { useThemeStore } from "../stores/theme";
import { useAppStore } from "../stores/app";
import { useUserStore } from "../stores/user";
import { onMountedOrActivated } from "@vant/use";
import { Notify, Toast } from "vant";
import { getQuerys } from "../utils";
import axios from "axios";
import { fetchOpenid } from "../api";

// theme begin
const themeStore = useThemeStore();
const appStore = useAppStore();
const user = useUserStore()
// theme end

// orientation begin
const orientation = ref<number>(0);
window.addEventListener("orientationchange", () => {
    // 方向改变前
    orientation.value = window.orientation | screen.orientation.angle;
    console.log("orientation change", orientation.value);
});

// when orientation changes, update the font size
watch(orientation, (newVal, oldVal) => {
    // console.log(newVal, oldVal);
    console.log("orientation changed", window.innerWidth, window.innerHeight);
    let pageWidth = window.innerHeight;
    document.querySelector("html")!.style.fontSize = pageWidth / 10 + "px";
    console.log(document.querySelector("html")!.style.fontSize);
});

// orientation end
// resize begin
window.addEventListener("resize", () => {
    console.log("size changed", window.innerWidth, window.innerHeight);
    let pageWidth = window.innerWidth;
    document.querySelector("html")!.style.fontSize = pageWidth / 10 + "px";
    console.log(document.querySelector("html")!.style.fontSize);
});
// resize end

// onload check
const isMobile = ref(/Mobi|Android|iPhone/i.test(navigator.userAgent));
appStore.isWx = /MicroMessenger/i.test(navigator.userAgent);
console.log('isWX:', appStore.isWx);


onMountedOrActivated(async () => {
    const res = await user.fetchUserInfo();
    if (res) {
        if (user.firstBack) {
            Notify({
                type: 'success',
                message: "欢迎回来, " + user.data.username
            })
            // Toast({
            //     type: 'success',
            //     message: "欢迎回来, " + user.data.username,
            // })
            user.firstBack = false;
        }
    }
    if (appStore.isWx) {
        console.log('请求 OpenID')
        // 获取用户 OPENID
        const querys = getQuerys(location.href)
        if ('code' in querys) {
            const res = await fetchOpenid(querys['code'])
            if (res) {
                appStore.openid = res;
                console.log('已获取OpenID', appStore.openid);
            }
        }
    }
});

</script>
<style lang="scss" scoped>
.orientation-inspector {
    height: auto;
}

.wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background-color: $backgroundColor;

    .info-text {
        display: block;
        font-size: px2rem(10);
        text-align: center;
    }
}
</style>
