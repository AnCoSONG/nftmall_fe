<template>
    <Subpage title="账户信息" back-to="/user">
        <div class="account" v-if="user.data">
            <CellItem text="头像" right-icon="arrow" @click="openFileChooser()">
                <template #value>
                    <van-image class="avatar" round :src="user.data.avatar">
                        <template #loading>
                            <ImageLoader />
                        </template>
                    </van-image>
                    <input ref="uploadFileRef" type="file" accept="image/*" @change="uploadImg" style="display:none;" />
                </template>
            </CellItem>
            <CellItem text="昵称" right-icon="arrow" :value="user.data.username" @click="edit('username')"></CellItem>
            <CellItem text="手机号" :value="hidePhone(user.data.phone)"></CellItem>
            <!-- todo: 增加邮箱 -->
            <!-- <CellItem
                text="邮箱"
                right-icon="arrow"
                :value="user.data.email ?? '未绑定'"
                @click="edit('邮箱')"
            ></CellItem> -->
            <CellItem text="UID" :value="`#${user.data.id.toString().padStart(5, '0')}`"></CellItem>
            <CellItem text="OPENID" :value="app.openid === '' ? '点击获取' : app.openid" right-icon="arrow"
                @click="fetchOpenid"></CellItem>
            <CellItem text="积分" :value="user.data.credit"></CellItem>
            <CellItem text="区块链地址" :right-icon="copySvg" v-clipboard:copy="user.data.bsn_address"
                v-clipboard:success="onCopySuccess" v-clipboard:error="onCopyError" v-if="user.data.bsn_address">
                <template #value>
                    <div class="chain_text">
                        {{ user.data.bsn_address }}
                    </div>
                </template>
            </CellItem>
            <CellItem text="区块链地址" v-else>
                <template #value>
                    <div class="chain_text">
                        暂无区块链钱包地址
                    </div>
                </template>
            </CellItem>
            <CellItem text="实名认证" right-icon="arrow" value="未完成" v-if="!user.data.is_verified"
                @click="router.push('/verification')"></CellItem>
            <!-- 已完成 -->
            <CellItem text="实名认证" v-else right-icon="checked" value="已完成"></CellItem>

            <DangerBtn text="注销账户" @click="notSupport" />
        </div>
    </Subpage>
    <van-dialog v-model:show="editing" :title="'编辑' + field2text[edit_field]" show-cancel-button
        :before-close="onConfirm">
        <div class="input-wrapper">
            <input class="inner-input" type="text" v-model="value" placeholder="输入新的用户名" />
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
import { hidePhone, onCopySuccess, onCopyError, notSupport, hash, randomCode, redirectForOpenid } from "../../utils";
import { Notify } from "vant";
import { ref } from "vue";
import { onMountedOrActivated } from "@vant/use";
import { updateUser } from "../../api";
import { cdnTransform, putObjectPromisify } from '../../plugins/cos-sdk'
import ImageLoader from "../../components/ImageLoader.vue";
import { useAppStore } from "../../stores/app";
const app = useAppStore()
//@ts-ignore
import Clipic from 'clipic'
const user = useUserStore();
const router = useRouter();

const edit_field = ref("");
const editing = ref(false);
const value = ref("");
const uploadFileRef = ref()
const field2text: Record<string, string> = {
    username: '用户名',
    email: '邮箱'
}
const clipic = new Clipic()
onMountedOrActivated(async () => {
    await user.fetchUserInfo();
    window.onpopstate = () => {
        if (clipic && clipic.options) {
            clipic.cancel()
        }
        // clipic.cancle()
    }
})

const edit = (field: string) => {
    edit_field.value = field;
    value.value = "";
    editing.value = true;
};

const onConfirm = async (action: string): Promise<boolean> => {
    /** 
     * todo 改为正式逻辑 patch collector/:id
     * */
    if (action === "cancel") {
        return true;
    }
    const r = await updateUser({ [edit_field.value]: value.value })
    if (r) {
        Notify({
            type: 'success',
            message: '编辑成功',
            background: '#aaaaaa',

        })
        await user.fetchUserInfo() // 刷新用户信息
    }
    editing.value = false;
    edit_field.value = "";
    value.value = "";
    return true;
};

// onMountedOrActivated(async () => {
//     console.log(user.data);
// });

const openFileChooser = () => {
    console.log(uploadFileRef.value)
    uploadFileRef.value.click()
}
const uploadImg = (event: Event) => {
    //@ts-ignore
    const files = event.target.files
    const reader = new FileReader()
    const orginal_name = files[0].name
    const cropped_name = hash(orginal_name + randomCode()) + '.jpg'
    reader.readAsDataURL(files[0])
    //@ts-ignore
    reader.onload = img => {
        clipic.getImage({
            width: 400,
            height: 400,
            name: cropped_name,
            //@ts-ignore
            src: img.target.result,
            encode: 'file',
            type: 'jpeg',
            //@ts-ignore
            onDone: async (fileObj: File) => {
                console.log(fileObj)
                const res = await putObjectPromisify(fileObj.name, fileObj).catch(err => {
                    console.error(err)
                    Notify({
                        type: 'danger',
                        message: '上传COS出错: ' + err.statusCode
                    })
                    return null
                }) as boolean | null
                if (res) {
                    const r = await updateUser({ avatar: cdnTransform('avatar/' + cropped_name) }).catch(err => {
                        console.log(err)
                        Notify({
                            type: 'danger',
                            message: '更新出错: ' + err.response.data.message
                        })
                        return null
                    })
                    if (r) {
                        Notify({
                            type: 'success',
                            message: '更新成功',
                            background: '#aaaaaa',

                        })
                        await user.fetchUserInfo()
                    }
                }
            }
        })
    }
}

const fetchOpenid = () => {
    if (app.isWx && app.openid === '') {
        redirectForOpenid()
    }
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
