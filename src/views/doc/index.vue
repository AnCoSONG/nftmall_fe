<template>
    <Subpage :title="prop.title">
        <van-skeleton title row="10" :loading="loading">
            <div v-html="cleanHtml" v-if="docData" class="doc">
            </div>
            <Empty v-else :description="'暂无文档内容'" />
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
import { computed, onDeactivated, onUnmounted, ref } from 'vue';
import { onMountedOrActivated } from '@vant/use';
import { fetchDoc } from '../../api'
type DocType = {
    title: string
}
const prop = defineProps<DocType>()
const loading = ref(true)
const docData = ref('')
onMountedOrActivated(async () => {
    // 向后端请求文档内容并渲染
    document.title = prop.title
    loading.value = true
    const r = await fetchDoc(prop.title)
    if (r) {
        docData.value = r.content
    } else {
        docData.value = ``
    }
    loading.value = false
})
const cleanHtml = computed(() => {
    // console.log(docData.value, Dompurify.sanitize(docData.value))
    return Dompurify.sanitize(docData.value)
})

onDeactivated(() => {
    docData.value = ''
    loading.value = true
})

onUnmounted(() => {
    docData.value = ''
    loading.value = true
})
</script>
<style lang="scss">
.doc {
    width: 100%;
    padding: 0 px2rem(8.5);
    box-sizing: border-box;
    position: relative;
    word-break: break-all;
    font-size: px2rem(16);
    line-height: 1.5;
    // letter-spacing: px2rem(0.6);

    // 定义一些文档的样式
    a {
        color: white;
        text-decoration: underline;
    }

    img {
        width: 100%;
        display: block;
        height: auto;
    }
}
</style>