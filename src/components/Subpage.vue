<template>
    <div class="subpage-layout">
        <div class="subpage-header">
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
type PropType = {
    title: string,
    shareable?: boolean,
    backTo?: string,
}
const props = defineProps<PropType>()

const routeBack = () => {
    if(props.backTo !== undefined && props.backTo !== null) {
        router.push(props.backTo)
    } else {
        router.back()
    }
}
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