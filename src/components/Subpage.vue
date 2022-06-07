<template>
    <div class="subpage-layout">
        <div class="subpage-header" :style="{backdropFilter: `blur(${blurPx}px)`}">
            <van-icon name="arrow-left" class="icon" @click="routeBack" />
            <div class="title" :style="{ visibility: props.title === '' ? 'hidden' : 'visible' }">{{ props.title }}
            </div>
            <van-icon name="share-o" :style="{ visibility: props.shareable ? 'visible' : 'hidden' }" />
        </div>
        <div class="subpage-content">
            <slot></slot>
        </div>
    </div>
</template>
<script setup lang='ts'>
import { onMountedOrActivated } from '@vant/use';
import { onDeactivated, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
type PropType = {
    title: string,
    shareable?: boolean,
    backTo?: string,
}
const blurPx = ref(0)
const props = defineProps<PropType>()

const routeBack = () => {
    if(props.backTo !== undefined && props.backTo !== null) {
        router.push(props.backTo)
    } else {
        router.back()
    }
}

// https://codeantenna.com/a/XHbHc3eCZZ
const handleScroll = () => {
    const scrollTop = document.getElementById('app')?.scrollTop ?? 0;
    console.log(scrollTop)
    blurPx.value = scrollTop * 0.05;
    if (blurPx.value >= 20) {
        blurPx.value = 20;
    }
}

onMountedOrActivated(() => {
    window.addEventListener('scroll', handleScroll, true);
})

onDeactivated(() => {
    window.removeEventListener('scroll', handleScroll, true);
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll, true);
})
</script>
<style lang="scss" scoped>
.subpage-layout {
    position: relative;
    width: 100%;
    color: $normalTextColor;

    .subpage-header {
        // padding-top: px2rem(10);
        font-size: px2rem(24);
        display: flex;
        flex-flow: nowrap row;
        align-items: center;
        justify-content: space-between;
        // padding-bottom: px2rem(17);
        padding: px2rem(17) px2rem(17);
        box-sizing: border-box;
        z-index: 100;
        position: sticky;
        top: 0;
        backdrop-filter: blur(20px);
        background: transparent;
        
        .title {
            font-size: px2rem(18);
        }
    }

    .subpage-content {
        width: 100%;
        position: relative;
        padding: px2rem(17) px2rem(17);
        box-sizing: border-box;
        padding-top: 0;
        .test-box {
            width: 100%;
            height: 400px;
            background-color: white;
        }
    }
}
</style>