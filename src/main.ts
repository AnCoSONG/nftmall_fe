import { createApp } from "vue";
import App from "./App.vue";
import "normalize.css";
// import "styles/global.scss"

import useVant from "./plugins/vant";
import { vueAxios } from "./plugins/axios";
import useClipboard from "./plugins/clipboard";
import router from "./routers";
import { createPinia } from "pinia";
import { authSrc, vueCos } from "./plugins/cos-sdk";
import { VueMasonryPlugin } from 'vue-masonry'

import wx from 'weixin-js-sdk'

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(useVant);
app.use(vueAxios);
app.use(vueCos);
app.use(useClipboard);
app.use(VueMasonryPlugin);
app.mount("#app");
