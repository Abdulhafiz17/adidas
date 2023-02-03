import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./libraries/qrcodejs/jquery.min.js";
import "./libraries/qrcodejs/qrcode.js";

createApp(App).use(router).mount("#app");
