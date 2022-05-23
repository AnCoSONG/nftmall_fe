import { createApp } from "vue";
import App from "./App.vue";
import "normalize.css";
// import "styles/global.scss"

import useVant from "./plugins/vant";
import { vueAxios } from "./plugins/axios";
import useClipboard from "./plugins/clipboard";
import router from "./routers";
import { createPinia } from "pinia";
import { vueCos } from "./plugins/cos-sdk";

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(useVant);
app.use(vueAxios);
app.use(vueCos);
app.use(useClipboard);
app.mount("#app");
