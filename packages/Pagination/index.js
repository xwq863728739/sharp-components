// packages/textarea/index.js

// 导入组件，组件必须声明 name
import Pagination from "./src/Pagination";

// 为组件添加 install 方法，用于按需引入
Pagination.install = function(Vue) {
  Vue.component(Pagination.name, Pagination);
};

export default Pagination;
