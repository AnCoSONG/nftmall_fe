<template>
    <div class="home">
        <RouterView v-slot="{ Component }">
            <KeepAlive>
                <component :is="Component"></component>
            </KeepAlive>
        </RouterView>
        <div class="bottom-bar">
            <div class="item" v-for="item in items" :key="item.id" :data-active="route.path == item.path"
                @click="() => router.push(item.path)">
                <div class="icon">
                    <van-icon :name="item.icon" />
                </div>
                <div class="text">{{ item.text }}</div>
            </div>
        </div>
    </div>
</template>
<script setup lang='ts'>
import { useAppStore } from '../../stores/app';
import { px2rem } from '../../utils';
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { v4 } from 'uuid';
import { onMountedOrActivated } from '@vant/use';
import { useAxios } from '../../plugins/axios';
import { useUserStore } from '../../stores/user';
import { Notify } from 'vant';
const axios = useAxios()
const app = useAppStore();
const user = useUserStore();
const { title } = storeToRefs(app);
const route = useRoute()
const router = useRouter()

const items = ref([
    {
        id: v4(),
        path: '/',
        icon: "shop",
        text: "首页"
    },
    {
        id: v4(),
        path: '/exhibition',
        icon: "gem",
        text: "个人展馆"
    },
    {
        id: v4(),
        path: '/user',
        icon: "friends",
        text: "我的"
    }
])

onMountedOrActivated(async () => {
    console.log('123')
    const res = await axios.get('/v1/auth/fetchUserInfo')
    if (res.data.code === 200) {
        if(user.firstBack) {
            Notify({
                type: 'success',
                message: "欢迎回来, " + res.data.data.username,
            })
        }
        user.login(res.data.data);
        sessionStorage.setItem('id', res.data.data.id)
    }
})
</script>
<style lang="scss">
.home {
    position: relative;

    .bottom-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: px2rem(60);
        background-color: black;
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-flow: nowrap row;
        box-shadow: 0 px2rem(-4) px2rem(4) 0 rgba(0, 0, 0, 0.25);

        .item {
            display: flex;
            flex-flow: nowrap column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: white;

            &[data-active="true"] {
                color: $glodTextColor;
                filter: drop-shadow(0 0 px2rem(5) $glodTextColor);
            }

            .icon {
                font-size: px2rem(20);
                margin-bottom: 2px;

            }

            .text {
                font-size: px2rem(10);
            }
        }
    }
}
</style>