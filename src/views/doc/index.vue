<template>
    <Subpage :title="title">
        <van-skeleton title row="10" :loading="loading">
            <div v-html="cleanHtml" v-if="docData" class="doc">
            </div>
            <Empty v-else :description="'暂无文档内容'"/>
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
import Empty from '../../components/Empty.vue';
import Dompurify from 'dompurify';
import { computed, ref } from 'vue';
import { onMountedOrActivated } from '@vant/use';
import { onDeactivated } from 'vue'
import { fetchDoc } from '../../api'
type DocType = {
    type: 'platform_agreement' | 'privacy_agreement' | 'bsn' | 'jinyuanshuzi' | 'faq',
}
const prop = defineProps<DocType>()
const type2title = {
    'platform_agreement': '平台协议',
    'privacy_agreement': '隐私协议',
    'bsn': '关于BSN',
    'jinyuanshuzi': '关于晋元数字',
    'faq': '常见问题'
}
const title = computed(() => {
    return type2title[prop.type]
})

const loading = ref(true)
const docData = ref('')
onMountedOrActivated(async () => {
    // 向后端请求文档内容并渲染
    loading.value = true
    const r = await fetchDoc(title.value)
    if (r) {
        docData.value = r.content
    } else {
        docData.value = ``
    }
    loading.value = false    
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
    padding: 0 px2rem(8.5);
    box-sizing: border-box;
    position: relative;
    word-break: break-all;
    font-size: px2rem(16);

    // 定义一些文档的样式
}
</style>