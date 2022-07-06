<template>
    <div class="key-value-line">
        <div class="left">{{ keyText }}</div>
        <div class="right">
            <div class="value">
                {{ value }}
            </div>
            <van-icon :name="copySvg" :size="px2rem(16)" v-if="copy" v-clipboard:copy="value"
                v-clipboard:success="onCopySuccess" v-clipboard:error="onCopyError" />
        </div>
    </div>
</template>
<script setup lang='ts'>
import { toRefs } from 'vue'
import { px2rem } from '../utils';
import copySvg from "../assets/copy.svg"
import { onCopyError, onCopySuccess } from '../utils';
type PropType = {
    keyText: string;
    value: string | number;
    copy: boolean;
}
const props = defineProps<PropType>()
const { keyText, value, copy } = toRefs(props)
</script>
<style lang="scss" scoped>
.key-value-line {
    display: flex;
    flex-flow: nowrap row;
    justify-content: space-between;
    align-items: center;
    margin: px2rem(8.5) 0;
    width: 100%;

    .right {
        display: flex;
        flex-flow: nowrap row;
        justify-content: flex-end;
        align-items: flex-end;

        .value {
            max-width: px2rem(200);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-right: px2rem(4);
        }

    }
}
</style>