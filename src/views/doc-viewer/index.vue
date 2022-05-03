<template>
    <Subpage :title="prop.title">
        <div v-html="cleanHtml" class="doc">
        </div>
    </Subpage>
</template>
<script setup lang='ts'>
// todo: 完善文档展示逻辑
import Subpage from '../../components/Subpage.vue';
import Dompurify from 'dompurify';
import { computed, ref } from 'vue';
import { onMountedOrActivated } from '@vant/use';
type DocType = {
    title: string,
    docType: string,
}
const prop = defineProps<DocType>()

const docData = ref('')
onMountedOrActivated(() => {
    // 向后端请求文档内容并渲染
    setTimeout(() => {
        docData.value = '<div>hello world</div>'
    }, 500)
})
const cleanHtml = computed(() => {
    return Dompurify.sanitize(docData.value)
})
</script>
<style lang="scss" scoped>
.doc {
    width: 100%;
    position: relative;

    font-size: px2rem(16);
}
</style>