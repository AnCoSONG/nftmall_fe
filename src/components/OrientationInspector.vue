<template>
    <div v-if="orientation == 0">
        <router-view />
    </div>
    <div v-else class="orientation-inspector">
        <div class="app-gold-text info-text">
            请在竖屏环境下使用
        </div>
    </div>
</template>
<script setup lang='ts'>
import { ref } from 'vue'
const orientation = ref<number>(window.orientation);
window.addEventListener('orientationchange', () => {
    // 方向改变前
    orientation.value = window.orientation | screen.orientation.angle;
    console.log(window.innerWidth, window.innerHeight, document.documentElement.clientWidth, document.documentElement.clientHeight);
    let pageWidth = window.innerHeight;
    document.querySelector('html')!.style.fontSize = pageWidth / 10 + 'px';
    console.log(document.querySelector('html')!.style.fontSize)
});
</script>
<style lang="scss" scoped>
.orientation-inspector {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    background: $backgroundColor;

    .info-text {
        display: block;
        font-size: px2rem(10);
        text-align: center;
    }
}
</style>