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
            <CellItem text="收货地址"
                :value="user.data.delivery_address === null || user.data.delivery_address === '' ? '未设置' : user.data.delivery_address"
                right-icon="arrow" @click="edit('delivery_address')"></CellItem>
            <!-- todo: 增加邮箱 -->
            <!-- <CellItem
                text="邮箱"
                right-icon="arrow"
                :value="user.data.email ?? '未绑定'"
                @click="edit('邮箱')"
            ></CellItem> -->
            <CellItem text="UID" :value="`#${user.data.id.toString().padStart(5, '0')}`"></CellItem>
            <CellItem text="微信绑定"
                :value="user.data.wx_openid === null || user.data.wx_openid === '' ? '点此绑定当前账号' : '已绑定 ✔'"
                right-icon="arrow" @click="bindOpenid"></CellItem>
            <CellItem text="积分" :value="Math.round(user.data.credit / 10)"></CellItem>
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
            <textarea name="delivery_address" class="textarea-input" v-if="edit_field === 'delivery_address'"
                placeholder="请填写详细收货地址" v-model="value"></textarea>
            <input class="inner-input" type="text" v-model="value" :placeholder="'请输入' + field2text[edit_field]"
                v-else />
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
import { hidePhone, onCopySuccess, onCopyError, notSupport, hash, randomCode, redirectForOpenid, getQuerys } from "../../utils";
import { Dialog, Notify, Toast } from "vant";
import { ref } from "vue";
import { onMountedOrActivated } from "@vant/use";
import { fetchOpenid, updateUser } from "../../api";
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
    email: '邮箱',
    delivery_address: '收货地址'
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

const edit = (field: 'username' | 'email' | 'delivery_address') => {
    edit_field.value = field;
    value.value = user.data[field] ?? ""
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
        editing.value = false;
        setTimeout(() => {
            // 延迟关闭
            edit_field.value = "";
            value.value = "";
        }, 200)
        return true;
    }
    return false;
};

// onMountedOrActivated(async () => {
//     console.log(user.data);
// });

const openFileChooser = () => {
    // console.log(uploadFileRef.value)
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
                const toastInstance = Toast.loading({
                    forbidClick: true,
                    message: '请稍等...',
                    duration: 0
                })
                // console.log(fileObj)
                const res = await putObjectPromisify(fileObj.name, fileObj).catch(err => {
                    console.error(err)
                    Notify({
                        type: 'danger',
                        message: '上传图像出错: ' + err.statusCode
                    })
                    return null
                }) as boolean | null
                if (res) {
                    const r = await updateUser({ avatar: cdnTransform('avatar/' + cropped_name) }).catch(err => {
                        // console.log(err)
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
                toastInstance.clear()
            }
        })
    }
}

const bindOpenid = () => {
    if (!app.isWx) {
        Dialog.alert({
            title: '警告',
            message: `绑定微信需要您在<b>微信</b>内打开本页面!<br>请关注公众号“<b>晋元数字</b>”，并在公众号内打开本页面完成绑定。`,
            allowHtml: true
        })
        return;
    }
    if (user.data.wx_openid) {
        Dialog.confirm({
            title: '提示',
            message: '您已绑定一个微信账号，是否重新绑定当前微信账号？\n',
            confirmButtonText: '是，我要重新绑定',
            cancelButtonText: '保持不变'
        }).then(() => {
            redirectForOpenid()
        }).catch(() => { })
    } else {
        Dialog.confirm({
            title: '提示',
            message: '正在进行微信账号绑定，是否继续',
            confirmButtonText: '确定绑定',
            cancelButtonText: '不绑定'
        }).then(() => {
            redirectForOpenid()
        }).catch(() => { })
    }
}

// onMountedOrActivated(async() => {
//     if (app.isWx) {
//         // 请求Openid
//         const querys = getQuerys(location.href)
//         if ('code' in querys) {
//             console.log('bind wxopenid')
//             const res = await fetchOpenid(querys['code'])
//             if (res) {
//                 user.data.wx_openid = res;
//                 const updateRes = await updateUser({wx_openid: res })
//                 if (updateRes) {
//                     Toast({
//                         type: 'success',
//                         message: '已成功绑定'
//                     })
//                 } else {
//                     Toast({
//                         type: 'fail',
//                         message: '绑定失败:无法更新'
//                     })
//                 }
//             } else {
//                 Toast({
//                     type: 'fail',
//                     message: '绑定失败:无法获取Openid'
//                 })
//             }
//         }
//     }
// })
</script>
<style lang="scss" scoped>
.account {
    width: 100%;
    position: relative;
    margin-bottom: px2rem(60);

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

    .textarea-input {
        width: 100%;
        outline: none;
        margin: 0;
        border: 1px solid rgba(0, 0, 0, .1);
        resize: none;
        min-height: px2rem(100);
        margin: px2rem(20) 0;
    }
}
</style>
