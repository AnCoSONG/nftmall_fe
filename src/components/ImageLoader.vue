<template>
    <div class="loader-wrapper">
        <van-loading type="spinner" size="20" />
    </div>
</template>
<script setup lang='ts'>

</script>
<style lang="scss" scoped>
.loader-wrapper {
    height: 100%;
    width: 100%;
    // min-height: 200px;
    display: flex;
    flex-flow: nowrap column;
    align-items: center;
    justify-content: center;
    background-color: $boxBgColor;

}
</style>