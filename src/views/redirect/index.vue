<template>
    <div class="text">重定向中...</div>
</template>
<script setup lang='ts'>
const to = location.search.slice(1).split('=')[1]
const path = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6eac99154b799016&redirect_uri=${to}&response_type=code&scope=snsapi_base&state=home#wechat_redirect`
window.location.href = path
</script>
<style lang="scss" scoped>
.text {
    text-align: center;
    font-size: px2rem(24);
    margin-top: px2rem(100);
    color: #ccc;
}
</style>