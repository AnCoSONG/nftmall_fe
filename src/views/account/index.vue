<template>
    <Subpage title="账户信息">
        <div class="account">
            <CellItem text="头像">
                <template #value>
                    <van-image class="avatar" round src="https://picsum.photos/120/120"></van-image>
                </template>
            </CellItem>
            <CellItem text="昵称" right-icon="arrow" value="藏家5406" @click="edit('用户名')"></CellItem>
            <CellItem text="手机号" value="185****5406"></CellItem>
            <CellItem text="邮箱" right-icon="arrow" value="未绑定" @click="edit('邮箱')"></CellItem>
            <CellItem text="UID" value="1673123"></CellItem>
            <CellItem text="积分" value="9.9"></CellItem>
            <CellItem text="区块链地址" :right-icon="copySvg" v-clipboard:copy="'123182edhe12bdu21g3y12eh281ge20021ge081g'"
                v-clipboard:success="onCopySuccess" v-clipboard:error="onCopyError">
                <template #value>
                    <div class="chain_text">
                        123182edhe12bdu21g3y12eh281ge20021ge081g
                    </div>
                </template>
            </CellItem>
            <CellItem text="实名认证" right-icon="arrow" value="未完成" @click="router.push('/verification')"></CellItem>
            <!-- 已完成 -->
            <CellItem text="实名认证" right-icon="checked" value="已完成"></CellItem>

            <DangerBtn text="注销账户" @click="notSupport" />
        </div>
    </Subpage>
    <van-dialog v-model:show="editing" :title="'编辑' + edit_field" show-cancel-button :before-close="onConfirm">
        <div class="input-wrapper">
            <input class="inner-input" type="text" v-model="value">
        </div>
    </van-dialog>
</template>
<script setup lang='ts'>
import Subpage from '../../components/Subpage.vue';
import CellItem from '../../components/CellItem.vue';
import copySvg from 'assets/copy.svg';
import DangerBtn from '../../components/DangerBtn.vue';
import { useRouter } from 'vue-router';
import { Notify } from 'vant';
import { ref } from 'vue';

const router = useRouter()

const edit_field = ref('')
const editing = ref(false)
const value = ref('')

const edit = (field: string) => {
    edit_field.value = field
    value.value = ''
    editing.value = true
}

const onCopyError = () => {
    Notify({ type: 'danger', message: '复制出错' })
}

const onCopySuccess = () => {
    Notify({ type: 'success', message: '复制成功' })
}

const onConfirm = (action: string) => {
    // todo 改为正式逻辑
    if (action === 'cancel') {
        return true;
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            Notify({
                type: 'success',
                message: '编辑成功'
            })
            editing.value = false;
            edit_field.value = '';
            value.value = '';
            resolve(true)
        }, 500)
    })
}

const notSupport = () => {
    Notify({
        type: 'danger',
        message: '暂不支持'
    })
}
</script>
<style lang="scss" scoped>
.account {
    width: 100%;
    position: relative;
    margin-bottom: px2rem(72);

    .avatar {
        width: px2rem(48);
        height: px2rem(48);
    }

    .chain_text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

.input-wrapper {
    width: 100%;
    padding: px2rem(0) px2rem(40);
    box-sizing: border-box;

    .inner-input {
        width: 100%;
        outline: none;
        margin: 0;
        display: block;
        min-width: 50px;
        outline: none;
        border: 0px;
        box-sizing: border-box;
        font-size: px2rem(20);
        padding: px2rem(10);
        // background-color: $greyTextColor;
        margin: px2rem(20) 0;
        border-bottom: 1px solid #ddd;
    }
}
</style>