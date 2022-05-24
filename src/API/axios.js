import axios from "axios";

// const url = "http://127.0.0.1:9000";
const url = "https://api.mc.cfd";

/**
 * POST请求
 * @param {Object} parameter 请求参数
 * @param {String} path 请求路径
 * @returns data | [errorTitle, errorMessage, errorCode?]
 */
const axiosPOST = async (parameter, path) => {
  const params = new URLSearchParams();
  for (var i in parameter) {
    params.append(i, parameter[i]);
  }
  try {
    const resp = await axios.post(url + path, params);
    const status = resp.status;
    const data = resp.data;
    if (status != 200) {
      return Promise.reject([`${status} ERROR`, `API返回 ${status}`]);
    } else if (data.code != 200) {
      return Promise.reject([`${data.code} ERROR`, data.msg, data.code]);
    }
    return Promise.resolve(data);
  } catch (e) {
    return Promise.reject(["请求API失败", e.message]);
  }
};

export { axiosPOST };
