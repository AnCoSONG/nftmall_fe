<template>
    <div class="price">
        <div class="money-type" :style="{ fontSize: smallSize }">{{ moneyType }}&nbsp;</div>
        <div class="integral" :style="{ fontSize: integralSize }">{{ price.split('.')[0] }} </div>
        <div class="fractional" :style="{ fontSize: smallSize }">.{{ price.split('.')[1] }}</div>
    </div>
</template>
<script setup lang='ts'>
import { computed } from '@vue/reactivity';

type PropType = {
    moneyType: string,
    price: string,
    smallSize: string,
    integralSize: string,
}
const props = defineProps<PropType>()
</script>
<style lang="scss" scoped>
.price {
    color: $glodTextColor;
    font-weight: bolder;
    vertical-align: text-bottom;
    display: flex;
    flex-flow: nowrap row;
    align-items: baseline;


    .money-type,
    .fractional {
        font-size: px2rem(24);
        // display: inline-block;
    }

    .integral {
        font-size: px2rem(32);
        // display: inline-block;
    }
}
</style>