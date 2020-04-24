import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import SN from "../packages/index";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./styles/index.scss";
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(SN);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
