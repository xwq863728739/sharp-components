import axios from "axios";
import { Message, Loading } from "element-ui";
// 加载动画
let loading;
function startLoading() {
  loading = Loading.service({
    text: "拼命加载中",
  });
}
function endLoading() {
  loading.close();
}
const service = axios.create({
  baseURL: "https://wechat.lirimall.com:9443",
  timeout: 5000, // request timeout
});
service.interceptors.request.use(
  (config) => {
    startLoading();
    return config;
  },
  (error) => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);
service.interceptors.response.use(
  (res) => {
    endLoading();
    if (res.data.code !== 200) {
      Message({
        message: res.data.msg || res.data.message || "Error",
        type: "error",
        duration: 5 * 1000,
      });
      return Promise.reject(
        new Error(res.data.error || res.data.msg || "Error")
      );
    } else {
      return res;
    }
  },
  (error) => {
    endLoading();
    console.log("err" + error); // for debug
    Message({
      message: error,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);
window.$http = service;
export default service;
