<template>
    <Subpage :title="title">
        <van-skeleton title row="10" :loading="loading">
            <div v-html="cleanHtml" class="doc">
            </div>
        </van-skeleton>
    </Subpage>
</template>
<script lang="ts">
export default {
    name: 'doc'
}
</script>
<script setup lang='ts'>
// todo: 完善文档展示逻辑
import Subpage from '../../components/Subpage.vue';
import Dompurify from 'dompurify';
import { computed, ref } from 'vue';
import { onMountedOrActivated } from '@vant/use';
import { onDeactivated } from 'vue'
type DocType = {
    type: 'agreement' | 'bsn' | 'jinyuanshuzi',
}
const prop = defineProps<DocType>()

const type2title = {
    'agreement': '用户协议',
    'bsn': '关于BSN文昌链',
    'jinyuanshuzi': '关于晋元数字',
}
const title = computed(() => {
    return type2title[prop.type]
})

const loading = ref(true)
const docData = ref('')
onMountedOrActivated(() => {
    // 向后端请求文档内容并渲染
    setTimeout(() => {
        docData.value = `<div>${type2title[prop.type]}</div>`
        loading.value = false;
    }, 500)
})
const cleanHtml = computed(() => {
    console.log(docData.value, Dompurify.sanitize(docData.value))
    return Dompurify.sanitize(docData.value)
})

onDeactivated(() => {
    docData.value = ''
    loading.value = true
})
</script>
<style lang="scss" scoped>
.doc {
    width: 100%;
    position: relative;

    font-size: px2rem(16);

    // 定义一些文档的样式
}
</style>