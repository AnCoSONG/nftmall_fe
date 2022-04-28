import { createApp } from "vue";
import App from "./App.vue";
import "normalize.css";
// import "styles/global.scss"

import router from "./routers";
import { createPinia } from "pinia";

const app = createApp(App);
app.use(router);
app.use(createPinia())
app.mount("#app");
