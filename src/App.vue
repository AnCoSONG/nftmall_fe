<template>
  <EnvironmentInspector />
  <!-- <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <Transition mode="out-in">
        <KeepAlive>
          <Suspense>
            <component :is="Component"></component>
            <template #fallback>
              <van-overlay :show="true">
                <div class="app-loader">
                  <van-loading vertical>加载中</van-loading>
                </div>
              </van-overlay>
            </template>
          </Suspense>
        </KeepAlive>
      </Transition>
    </template>
  </RouterView> -->
</template>
<script setup lang="ts">
import EnvironmentInspector from './components/EnvironmentInspector.vue';
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
</script>

<style lang="scss">
// global style definition
.timeline .van-step__circle-container {
  background-color: #272727 !important;
}

html,
body,
#app {
  width: 100%;
  min-height: 100% !important;
  height: 100%;
  background-color: $backgroundColor;
  // color: $normalTextColor;
}

.dg.ac {
  top: px2rem(54);
}

#app {
  overflow: auto;
}

.outer-box {
  padding: px2rem(17) px2rem(17);
  padding-bottom: 0;
  box-sizing: border-box;
}

.app-gold-text {
  color: rgb(215, 198, 101);
  background: linear-gradient(180deg, rgba(232, 227, 186, 0.81) 0%, #DBC692 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  // text-fill-color: transparent;
}

.app-loader {
  display: flex;
  flex-flow: nowrap column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
