<template>
    <Subpage title="账户信息">
        <div class="account" v-if="user.data">
            <CellItem text="头像">
                <template #value>
                    <van-image
                        class="avatar"
                        round
                        :src="user.data.avatar"
                    ></van-image>
                </template>
            </CellItem>
            <CellItem
                text="昵称"
                right-icon="arrow"
                :value="user.data.username"
                @click="edit('用户名')"
            ></CellItem>
            <CellItem
                text="手机号"
                :value="hidePhone(user.data.phone)"
            ></CellItem>
            <!-- todo: 增加邮箱 -->
            <!-- <CellItem
                text="邮箱"
                right-icon="arrow"
                :value="user.data.email ?? '未绑定'"
                @click="edit('邮箱')"
            ></CellItem> -->
            <CellItem
                text="UID"
                :value="`#${user.data.id.toString().padStart(5, '0')}`"
            ></CellItem>
            <CellItem text="积分" :value="user.data.credit"></CellItem>
            <CellItem
                text="区块链地址"
                :right-icon="copySvg"
                v-clipboard:copy="user.data.bsn_address"
                v-clipboard:success="onCopySuccess"
                v-clipboard:error="onCopyError"
                v-if="user.data.bsn_address"
            >
                <template #value>
                    <div class="chain_text">
                        {{ user.data.bsn_address }}
                    </div>
                </template>
            </CellItem>
            <CellItem
                text="区块链地址"
                v-else
            >
                <template #value>
                    <div class="chain_text">
                        暂无区块链钱包地址
                    </div>
                </template>
            </CellItem>
            <CellItem
                text="实名认证"
                right-icon="arrow"
                value="未完成"
                v-if="!user.data.is_verified"
                @click="router.push('/verification')"
            ></CellItem>
            <!-- 已完成 -->
            <CellItem
                text="实名认证"
                v-else
                right-icon="checked"
                value="已完成"
            ></CellItem>

            <DangerBtn text="注销账户" @click="notSupport" />
        </div>
    </Subpage>
    <van-dialog
        v-model:show="editing"
        :title="'编辑' + edit_field"
        show-cancel-button
        :before-close="onConfirm"
    >
        <div class="input-wrapper">
            <input class="inner-input" type="text" v-model="value" />
        </div>
    </van-dialog>
</template>
<script lang="ts">
export default {
    name: "account",
};
</script>
<script setup lang="ts">
import Subpage from "../../components/Subpage.vue";
import CellItem from "../../components/CellItem.vue";
import copySvg from "assets/copy.svg";
import DangerBtn from "../../components/DangerBtn.vue";
import { useUserStore } from "../../stores/user";
import { useRouter } from "vue-router";
import { hidePhone, onCopySuccess, onCopyError, notSupport } from "../../utils";
import { Notify } from "vant";
import { ref } from "vue";
import { onMountedOrActivated } from "@vant/use";
const user = useUserStore();
const router = useRouter();

const edit_field = ref("");
const editing = ref(false);
const value = ref("");

onMountedOrActivated(async () => {
    await user.fetchUserInfo();
})

const edit = (field: string) => {
    edit_field.value = field;
    value.value = "";
    editing.value = true;
};

const onConfirm = (action: string): Promise<boolean> => {
    /** 
     * todo 改为正式逻辑 patch collector/:id
     * */ 
    if (action === "cancel") {
        return Promise.resolve(true);
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            Notify({
                type: "success",
                message: "编辑成功",
            });
            editing.value = false;
            edit_field.value = "";
            value.value = "";
            resolve(true);
        }, 500);
    });
};

// onMountedOrActivated(async () => {
//     console.log(user.data);
// });
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
