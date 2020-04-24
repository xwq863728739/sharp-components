// packages/textarea/index.js

// 导入组件，组件必须声明 name
import Test2 from "./src/test2.vue";

// 为组件添加 install 方法，用于按需引入
Test2.install = function(Vue) {
  Vue.component(Test2.name, Test2);
};

export default Test2;
