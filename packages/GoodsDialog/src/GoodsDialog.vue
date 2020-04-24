<template>
  <!-- 查看商品列表弹窗组件 -->
  <el-dialog :visible="showGoods" @close="close">
    <div class="pad-container">
      <div class="flx-row ali-c js-btw" v-if="isSearch">
        <div>
          <el-input
            :placeholder="item.placeholder"
            class="form-input-200 mr-10"
            v-model.trim="item.value"
            v-for="(item,index) in searchArr"
            :key="index"
          ></el-input>
        </div>
        <div>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-search"
            class="ml-15"
            @click="search"
          >查询</el-button>
          <el-button size="small" icon="el-icon-refresh" class="ml-15" @click="refresh">刷新</el-button>
        </div>
      </div>
      <el-table
        class="mt-24 member-table"
        :data="tableData"
        ref="multipleTable"
        @select-all="handleSelectAll"
        @select="handleSelect"
        :row-key="(row)=>{ return row[keyId] }"
      >
        <el-table-column type="selection" :reserve-selection="true" v-if="type==='select'"></el-table-column>
        <el-table-column :label="item.value" v-for="(item) in tableHeader" :key="item.key">
          <template slot-scope="scope">{{scope.row[item.key]}}</template>
        </el-table-column>
      </el-table>
      <Pagination
        :total="total"
        :pageNum="pageNum"
        :pageSize="pageSize"
        :hideSizes="true"
        :type="'dialog'"
        @syncPageData="syncPageData"
      />
    </div>
    <div class="flx-row ali-c js-fe mt-50" v-if="type==='select'">
      <el-button plain size="medium" @click="cancelSelect">取消</el-button>
      <el-button class="ml-15" size="medium" type="primary" @click="chooseGoods">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Pagination from "../../Pagination/src/Pagination";
import $http from "../../../examples/utils/request";
export default {
  name: "SN-GoodsDialog",
  props: {
    isSearch: {
      type: Boolean,
      default: true
    },
    tableHeader: Array,
    url: String,
    method: {
      type: String,
      default: "get"
    },
    type: String,
    searchArr: {
      type: Array,
      default: () => [
        {
          name: "barCode",
          value: "",
          placeholder: "请输入商品条形码"
        },
        {
          name: "goodsName",
          value: "",
          placeholder: "请输入商品名称"
        }
      ]
    },
    keyId: {
      type: [String, Number],
      default: "goodsId"
    },
    baseUrl: {
      type: String,
      default: ""
    }
  },
  components: {
    Pagination
  },
  data() {
    return {
      showGoods: false,
      pageNum: 1,
      pageSize: 2,
      tableData: [],
      total: 0,
      firstFlag: false,
      selected_temp: [],
      act_form: {
        list: []
      }
    };
  },
  methods: {
    // 取消勾选
    cancelSelect() {
      this.showGoods = false;
      this.selected_temp = JSON.parse(JSON.stringify(this.act_form.list));
    },
    // 关闭弹窗
    close() {
      this.showGoods = false;
    },
    // 换页
    syncPageData(data) {
      this.pageNum = data.num;
      this.pageSize = data.size;
      this.getGoods(this.type === "select" ? true : "");
    },
    //获取商品列表
    getGoods(selectFlag) {
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      if (this.isSearch) {
        let searchObj = {};
        this.searchArr.map(item => {
          searchObj[item.name] = item.value;
        });
        data = Object.assign(data, searchObj);
      }
      let reqParams = {
        baseUrl: this.baseUrl,
        url: this.url,
        method: this.method
      };
      reqParams =
        this.method === "post"
          ? Object.assign(reqParams, { data })
          : Object.assign(reqParams, { params: data });
      $http(reqParams).then(res => {
        this.total = res.data.body.total;
        this.tableData = res.data.body.list;
        if (this.type !== "select") return;
        if (!this.firstFlag) {
          // 编辑状态并且是第一次调用
          console.log("调用");
          // 默认选中列表
          this.selected_temp = JSON.parse(JSON.stringify(this.act_form.list));
          this.firstFlag = true;
        }
        // selectFlag 是否进行状态勾选
        selectFlag ? this.toggleSelection() : "";
      });
    },
    // 搜索
    search() {
      this.pageNum = 1;
      this.getGoods(this.type === "select" ? true : "");
    },
    // 刷新
    refresh() {
      this.searchArr.forEach(item => {
        item.value = "";
      });
      this.search();
    },

    /****     多选功能模块 start       ****/
    // 判断为空值,t=1则空值类型包含0与'0'
    isEmpty(v, t = 0) {
      switch (typeof v) {
        case "undefined":
          return true;
        case "string":
          if (v.length == 0 || t ? v === "0" : false) return true;
          break;
        case "boolean":
          if (!v) return true;
          break;
        case "number":
          if (isNaN(v) || t ? v === 0 : false) return true;
          break;
        case "object":
          if (null === v) {
            return true;
          } else if (!Object.keys(v).length) {
            return true;
          }
          break;
        default:
          return false;
      }
    },
    //确定多选商品
    chooseGoods() {
      this.act_form.list = JSON.parse(JSON.stringify(this.selected_temp));
      this.showGoods = false;
      this.$emit("getSelectedList", this.act_form.list);
    },
    // 切换勾选状态
    toggleSelection() {
      // this.$refs.multipleTable获取不到
      this.$nextTick(() => {
        let goodsIdList = this.act_form.list.map(item => item[this.keyId]);
        let selected_temp = this.selected_temp.map(item => item[this.keyId]);
        // 本页数据的勾选
        this.tableData.forEach(item => {
          // 不在已选商品中则去除勾选
          if (goodsIdList.indexOf(item[this.keyId]) === -1) {
            this.$refs.multipleTable.toggleRowSelection(item, false);
          }
          // 在全局勾选列表中添加勾选
          if (selected_temp.indexOf(item[this.keyId]) !== -1) {
            this.$refs.multipleTable.toggleRowSelection(item, true);
          }
        });
      });
    },
    // 手动全选
    handleSelectAll(selection) {
      let selections = selection.map(item => item[this.keyId]); // 用户手动选中的所有项id列表集合
      let selected_list = this.selected_temp.map(item => item[this.keyId]); // 所有选中项id列表集合
      // 当前页里有被勾选的 只执行勾选操作
      let flag = this.tableData.some(
        item => selections.indexOf(item[this.keyId]) !== -1
      );
      for (var i = 0; i < this.tableData.length; i++) {
        let item = this.tableData[i];
        if (selected_list.indexOf(item[this.keyId]) !== -1 && !flag) {
          // 本页数据在全局勾选列表中 并且 本页数据不在用户手选列表中（表明执行了取消勾选操作）
          // 将本页数据从全局勾选列表中删除
          let index = this.selected_temp.findIndex(
            value => value[this.keyId] === item[this.keyId]
          );
          this.selected_temp.splice(index, 1);
        } else {
          // 本页数据项不在全局勾选列表中（执行全选操作） - 将数据项添加进全局勾选列表
          if (selected_list.indexOf(item[this.keyId]) === -1) {
            this.selected_temp.push(item);
          }
        }
      }
    },
    // 手动单选
    handleSelect(selection, row) {
      // 判断总勾选列表中是否含有点击项
      let includeFlag = this.selected_temp.some((item, index) => {
        return item[this.keyId] == row[this.keyId];
      });
      if (includeFlag) {
        // 有-删除
        let index = this.selected_temp.findIndex(
          item => item[this.keyId] === row[this.keyId]
        );
        this.selected_temp.splice(index, 1);
      } else {
        // 无-添加
        this.selected_temp.push(row);
      }
    }

    /****     多选功能模块 end       ****/
  }
};
</script>
<style scoped lang='scss'>
</style>