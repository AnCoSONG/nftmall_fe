<template>
    <!-- todo: optim this implementation -->
    <div class="cell-btn">
        <div class="left">
            <div class="icon" v-show="prop.icon != null">
                <van-icon :name="prop.icon"></van-icon>
            </div>
            <div class="text">{{ prop.text }}</div>
        </div>
        <!-- todo：增强右侧，可以显示其他图案 -->
        <div class="right">
            <slot name="value"></slot>
            <div class="value" v-show="prop.value !== null">{{ prop.value }}</div>
            <van-icon class="right-icon" :name="prop.rightIcon" v-show="prop.rightIcon != null"></van-icon>
        </div>
    </div>
</template>
<script setup lang='ts'>
type Prop = {
    text: string,
    icon?: string,
    rightIcon?: string,
    value?: string | number,
}
const prop = defineProps<Prop>()
</script>
<style lang="scss" scoped>
.cell-btn {
    width: 100%;
    border-radius: px2rem(8);
    padding: px2rem(16) px2rem(16);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-flow: nowrap row;
    color: $normalTextColor;
    box-sizing: border-box;
    background-color: $boxBgColorLight;
    margin-bottom: px2rem(20);
    box-shadow: 0px px2rem(4) px2rem(4) 0px rgba(0, 0, 0, 0.25);

    &:last-child {
        margin-bottom: 0;
    }

    &:active {
        background-color: $boxBgColor;
    }

    .left {
        display: flex;
        align-items: center;
        flex-flow: nowrap row;
        justify-content: center;
        .icon {
            font-size: px2rem(20);
            margin-right: px2rem(12);
        }
    
        .text {
            // flex: 1;
            max-width: px2rem(150);
            font-size: px2rem(18);
        }
    }


    .right {
        flex: 1;
        max-width: px2rem(200);
        font-size: px2rem(16);
        color: $greyTextColor;
        display: flex;
        flex-flow: nowrap row;
        align-items: center;
        justify-content: flex-end;

        .value {
            max-width: px2rem(200);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .right-icon {
            margin-left: px2rem(12);
        }
    }
}
</style>