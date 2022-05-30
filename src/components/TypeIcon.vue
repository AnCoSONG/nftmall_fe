<template>
    <div class="type-icon">
        <van-icon name="photo" v-if="type == 'image'" />
        <van-icon name="music" v-else-if="type == 'audio'" />
        <van-icon name="video" v-else-if="type == 'video'" />
        <van-icon name="diamond" v-else-if="type == '3D'" />
        <van-icon name="gem" v-else-if="type == 'hybrid'" />
    </div>
</template>
<script setup lang="ts">
import { toRef } from "vue";
import { SupportType } from "../utils";

type PropType = {
    type: SupportType;
};
const props = defineProps<PropType>();
const type = toRef(props, "type");
</script>
<style lang="scss" scoped></style>
