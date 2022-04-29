<template>
    <div class="home">
        <router-view />
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
import { useStore } from '../../stores/app';
import { px2rem } from '../../utils';
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { v4 } from 'uuid';
const app = useStore()
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

        .item {
            display: flex;
            flex-flow: nowrap column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: white;

            &[data-active="true"] {
                color: $glodTextColor;
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