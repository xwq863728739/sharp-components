<template>
  <div id="app">
    <div id="nav" class="ml-15">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
      <button @click="handleClick"></button>
      <SN-GoodsDialog ref="GoodsDialog" :tableHeader="tableHeader" :url="goodsUrl"></SN-GoodsDialog>
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  methods: {
    handleClick() {
      this.$refs.GoodsDialog.showGoods = true;
      this.$refs.GoodsDialog.getGoods();
    }
  },
  data() {
    return {
      goodsUrl: "http://www.tourask.com/mock/152/api/goodsList", // 商品列表表头
      tableHeader: [
        {
          value: "商品条形码",
          key: "barCode"
        },
        {
          value: "活动名称",
          key: "activityName"
        },
        {
          value: "一级类目",
          key: "firstClassify"
        },
        {
          value: "二级类目",
          key: "secondClassify"
        },
        {
          value: "实价",
          key: "price"
        },
        {
          value: "库存",
          key: "stock"
        }
      ]
    };
  }
};
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
