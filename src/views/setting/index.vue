<template>
<Subpage title="设置">
    <div class="setting">
        <CellItem text="用户协议"></CellItem>
        <CellItem text="关于BSN文昌链"></CellItem>
        <CellItem text="商务合作"></CellItem>
        <!-- 登录后才显示 -->
        <DangerBtn text="退出登录"/>
    </div>
</Subpage>
</template>
<script setup lang='ts'>
import Subpage from '../../components/Subpage.vue';
import CellItem from 'comps/CellItem.vue';
import DangerBtn from '../../components/DangerBtn.vue';
</script>
<style lang="scss" scoped>
.setting {
    // height: 400px;
    width: 100%;
    position: relative;
    // background-color: #fff;

}
</style>