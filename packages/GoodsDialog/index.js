// packages/textarea/index.js

// 导入组件，组件必须声明 name
import GoodsDialog from "./src/GoodsDialog";

// 为组件添加 install 方法，用于按需引入
GoodsDialog.install = function(Vue) {
  Vue.component(GoodsDialog.name, GoodsDialog);
};

export default GoodsDialog;
