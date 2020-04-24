<template>
  <div class="flx-row ali-c js-c mt-24" v-show="total>0">
    <el-pagination
      :layout="layout"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="total"
      :current-page="pageNum"
      @prev-click="handlePrevClick"
      @next-click="handleNextClick"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  name: "SN-Pagination",
  //"type"值用于区分是主list还是dialog
  props: ["total", "pageNum", "pageSize", "pageSizes", "type", "hideSizes"],
  data() {
    return {
      num: 1,
      size: 10,
      layout: "prev,pager,next,sizes"
    };
  },
  created() {
    //中间变量处理props同步传值
    this.num = this.pageNum;
    this.size = this.pageSize;
    if (this.hideSizes) this.layout = "prev,pager,next";
  },
  methods: {
    handlePrevClick() {
      this.num--;
      this.handleTransfer();
    },
    handleNextClick() {
      this.num++;
      this.handleTransfer();
    },
    //翻页
    handleCurrentChange(page) {
      this.num = page;
      this.handleTransfer();
    },
    //改变页显示数
    handleSizeChange(size) {
      this.size = size;
      this.handleTransfer();
    },
    //处理子组件向父组件数据同步
    handleTransfer() {
      let pageData = {
        num: this.num,
        size: this.size
      };
      this.$emit("syncPageData", pageData, this.type);
      this.$emit("changePage", this.type);
    }
  }
};
</script>