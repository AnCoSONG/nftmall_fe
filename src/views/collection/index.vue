<template>
    <Subpage title="我的藏品">
        <div class="total">
            共 12 件藏品
        </div>
        <CollectionList></CollectionList>
    </Subpage>
</template>
<script setup lang='ts'>
import Subpage from '../../components/Subpage.vue';
import CollectionList from './components/CollectionList.vue';
</script>
<style lang="scss" scoped>
.total{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: px2rem(12);
    color: $greyTextColor;
    margin-bottom: px2rem(10);
}
</style>