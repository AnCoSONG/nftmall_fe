<template>
    <Subpage title="我的藏品" back-to="/user">
        <CollectionList></CollectionList>
    </Subpage>
</template>
<script setup lang='ts'>
import Subpage from '../../components/Subpage.vue';
import CollectionList from './components/CollectionList.vue';
</script>
<style lang="scss" scoped>
</style>