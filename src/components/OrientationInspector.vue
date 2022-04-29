<template>
    <div class="orientation-inspector" :style="{height: orientation == 0 ? 'auto': '100%'}">
        <div v-if="orientation == 0">
            <router-view />
        </div>
        <div v-else class="wrapper">
            <div class="app-gold-text info-text">
                请在竖屏环境下使用
            </div>
        </div>
    </div>
</template>
<script setup lang='ts'>
import { ref, watch } from 'vue'
const orientation = ref<number>(0);
window.addEventListener('orientationchange', () => {
    // 方向改变前
    orientation.value = window.orientation | screen.orientation.angle;
    console.log('orientation change', orientation.value);
});

// when orientation changes, update the font size
watch(orientation, (newVal, oldVal) => {
    // console.log(newVal, oldVal);
    console.log('orientation changed', window.innerWidth, window.innerHeight);
    let pageWidth = window.innerHeight;
    document.querySelector('html')!.style.fontSize = pageWidth / 10 + 'px';
    console.log(document.querySelector('html')!.style.fontSize)
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