<template>
    <Subpage title="发起转赠" back-to="/transfer">
        <!-- todo: 选择藏品/支持从我的藏品页面带参数进行本页面 -->
        <!-- todo: 选择接收人（非本人、必须存在、给提示信息方便验证） -->
        <div class="tips" :class="{ ok: completeForm }">
            {{ tipText }}
        </div>
        <van-form>
            <van-cell-group inset>
                <van-field v-model="productValue" is-link readonly name="productPicker" label="藏品"
                    placeholder="请选择将转赠的藏品" @click="productPickerVisible = true">
                </van-field>
                <van-popup v-model:show="productPickerVisible" round position="bottom" safe-area-inset-bottom
                    teleport="body">
                    <van-picker ref="pickerRef" :columns="products" @confirm="onConfirmProduct" @cancel="productPickerVisible = false"
                        :loading="pickerLoading" title="选择藏品" :style="{ color: '#343434' }">
                        <template #option="data">{{
                                data.name
                        }}</template>
                    </van-picker>
                </van-popup>
                <van-field v-model="receiverValue" name="receiverPicker" label="接收人" type="digit" autocomplete="off"
                    placeholder="请输入接收人的ID" right-icon="question-o" @click-right-icon="onClickQuestion"
                    :rules="[{ validator: checkId, message: '接收人不存在' }]" />
            </van-cell-group>
            <GoldBtn @click="showSummary" class="confirm-btn" :disabled="!completeForm">确认转赠</GoldBtn>
        </van-form>
    </Subpage>

</template>
<script lang="ts">
export default {
    name: "transfer-apply",
};
</script>
<script setup lang='ts'>
import { computed } from '@vue/reactivity';
import { Dialog, PickerInstance, Toast } from 'vant';
import { onDeactivated, onMounted, onUnmounted, reactive, ref } from 'vue';
import { fetchAllCollections, findCollector, transferProductItem } from '../../api';
import GoldBtn from '../../components/GoldBtn.vue';
import Subpage from '../../components/Subpage.vue';
import router from '../../routers';
import { useUserStore } from '../../stores/user';
import { hidePhone } from '../../utils';

const props = defineProps<{
    product_item_id?: string
}>();

const transferDto = reactive({
    product_item_id: '',
    receiver_id: '',
})
const pickerRef = ref<PickerInstance>()
const user = useUserStore()
const productValue = ref<string>()
const receiverValue = ref<string>()
const receiverData = reactive<Partial<User>>({
    username: '',
    phone: ''
})
const productPickerVisible = ref(false);
const products = reactive<SimpleProductItem[]>([])
const pickerLoading = ref(true)

const onConfirmProduct = (value: SimpleProductItem) => {
    if (value.status === "locked") {
        Toast.fail("该藏品已被锁定，无法转赠")
        return
    }
    productValue.value = value.name;
    transferDto.product_item_id = value.id;
    productPickerVisible.value = false
}

const loadCollections = async () => {
    pickerLoading.value = true
    const data = await fetchAllCollections()
    if (data.length === 0) {
        Dialog.alert({
            title: '警告',
            message: '您还没有藏品，无法发起转赠。点击确定前往首页进行购买。',
        }).then(() => {
            router.replace('/')
        })
    }
    products.splice(0, products.length, ...data)
    pickerLoading.value = false
}

await loadCollections()

const onClickQuestion = () => {
    Dialog.alert({
        title: '提示',
        message: '接收人的用户ID可以在个人信息页面中查看。请仅输入0后面的实际数字。',
    })
}

const checkId = async (value: string, rule: any) => {
    // console.log(value, rule, typeof value) 
    if (value === '') {
        transferDto.receiver_id = ''
        receiverData.username = ''
        receiverData.phone = ''
        return false
    }
    if (value === user.data.id.toString()) {
        Dialog.alert({
            title: '警告',
            message: '您不能转赠给自己。',
        })
        rule.message = '不能转赠给自己'
        transferDto.receiver_id = ''
        receiverData.username = ''
        receiverData.phone = ''
        return false;
    }
    Toast.loading({
        duration: 0,
        message: '正在检查接收人信息...',
        forbidClick: true,
        loadingType: 'spinner',
    });
    const data = await findCollector(value)
    Toast.clear()
    if (data) {
        return Dialog.confirm({
            title: '确认您的藏品接收人',
            message: `您确定要将藏品转赠给该用户吗？<br><ul><li>用户名: <strong>${data.username}</strong><li>手机号: <strong>${hidePhone(data.phone)}</strong>`,
            allowHtml: true,
            messageAlign: 'left'
        }).then(() => {
            transferDto.receiver_id = value
            receiverData.username = data.username
            receiverData.phone = data.phone
            return true;
        }).catch(() => {
            transferDto.receiver_id = ''
            receiverData.username = ''
            receiverData.phone = ''
            rule.message = '请重新输入接收人ID'
            return false;
        })
    } else {
        transferDto.receiver_id = ''
        receiverData.username = ''
        receiverData.phone = ''
        return false;
    }
}

onDeactivated(() => {
    // console.log('on unmounted')
})

const tipText = computed(() => {
    if (transferDto.product_item_id === '' && transferDto.receiver_id === '') {
        return '请您选择将转赠的藏品，并输入接收人的用户ID。'
    } else if (transferDto.product_item_id === '') {
        return '请您选择将转赠的藏品。'
    } else if (transferDto.receiver_id === '') {
        return '请您输入接收人的用户ID。'
    } else {
        return '您已填写好转赠信息，请您确认后点击下方"确认转赠"按钮。'
    }
})

const completeForm = computed(() => {
    // console.log(transferDto)
    return transferDto.product_item_id !== '' && transferDto.receiver_id !== ''
})

const showSummary = () => {
    if (!completeForm.value) {
        Dialog.alert({
            title: '警告',
            message: '请您填写完整的转赠信息。',
        })
    } else {
        Dialog.confirm({
            title: '确认转赠信息',
            message: `您确定要将藏品转赠给该用户吗？<br><ul><li>藏品名称: <strong>${productValue.value}</strong><li>接收人: <strong>${receiverData.username}</strong><li>手机号: <strong>${hidePhone(receiverData.phone!)}</strong>`,
            allowHtml: true,
            messageAlign: 'left',
        }).then(async () => {
            // on confirm
            Toast.loading({
                duration: 0,
                message: '正在提交转赠信息...',
                forbidClick: true,
                loadingType: 'spinner',
            });
            const transferRes = await transferProductItem(transferDto.product_item_id, transferDto.receiver_id)
            Toast.clear()
            if (transferRes) {
                Dialog.alert({
                    title: '转赠成功',
                    message: '您已成功转赠藏品。',
                }).then(() => {
                    router.replace('/transfer')
                })
            }
        }).catch(() => {
            // on cancel
        })
    }
}

if (props.product_item_id) {
    transferDto.product_item_id = props.product_item_id;
    // productValue
    const idx = products.findIndex((item) => {
        if (item.id === props.product_item_id) {
            return true
        }
    })
    productValue.value = products[idx].name
}

</script>
<style lang="scss" scoped>
.tips {
    border-radius: px2rem(8);
    padding: px2rem(16) px2rem(20);
    word-break: break-all;
    background-color: #285665;
    font-size: px2rem(14);
    line-height: px2rem(20);
    margin: px2rem(20) px2rem(16);
    margin-top: 0;
    // text-indent: 2em;

    &.ok {
        background-color: #50a371;
    }
}

.confirm-btn {
    margin: px2rem(20) px2rem(16);
    // margin-top: 0;
    width: auto;
}
</style>