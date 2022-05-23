<template>
<Subpage title="设置">
    <div class="setting">
        <CellItem text="用户协议" right-icon="arrow" @click="router.push({path: '/doc/agreement'})"></CellItem>
        <CellItem text="关于BSN文昌链" right-icon="arrow" @click="router.push({path: '/doc/bsn'})"></CellItem>
        <CellItem text="商务合作" right-icon="arrow" @click="onCooperation"></CellItem>
        <!-- 登录后才显示 -->
        <DangerBtn text="退出登录" :loading="logoutLoading" @click="logout()" v-if="user.isLogin"/>
    </div>
</Subpage>
</template>
<script setup lang='ts'>
import Subpage from '../../components/Subpage.vue';
import CellItem from 'comps/CellItem.vue';
import DangerBtn from '../../components/DangerBtn.vue';
import { useRouter } from 'vue-router';
import { Dialog, Notify } from 'vant';
import { useUserStore } from '../../stores/user';
import { ref } from 'vue';
const user = useUserStore();
const router = useRouter();

const logoutLoading = ref(false);
const onCooperation = () => {
    Dialog.confirm({
        title: '商务合作',
        message: '请联系邮箱: xxxx@test.com',
        showCancelButton: false,
    })
}

const logout = async () => {
    logoutLoading.value = true;
    const res = await user.logout();
    if (res) {
        if (user.firstBack) {
            Notify({
                type: 'success',
                message: '退出成功',
            });
        }
        router.replace("/")
    }
    logoutLoading.value = false;
}
</script>
<style lang="scss" scoped>
.setting {
    // height: 400px;
    width: 100%;
    position: relative;
    margin-top: px2rem(10);
    // background-color: #fff;

}
</style>