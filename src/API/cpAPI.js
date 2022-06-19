import { axiosPOST } from "@/API/axios";

/**
 * 获取用户信息API
 * @param {String} sessdata SESSDATA
 * @returns userInfo | [errorTitle, errorMessage, errorCode?]
 */
const getUserInfo = async (sessdata) => {
  const path = "/api/cp";
  const parameter = {
    sessdata: sessdata,
  };
  try {
    const reqData = await axiosPOST(parameter, path);
    return Promise.resolve(reqData.data);
  } catch (e) {
    window.$notification.error({
      title: e[0],
      content: e[1],
      duration: 10000,
    });
    return Promise.reject(e);
  }
};

/**
 * 更新域名信息API
 * @param {String} sessdata SESSDATA
 * @param {String} udid UDID
 * @param {String} note 备注
 * @param {String} prefix 域名前缀
 * @param {String} serve 服务器IP/域名
 * @param {String} servePort 服务器端口
 * @returns true | [errorTitle, errorMessage, errorCode?]
 */
const updateResolution = async (
  sessdata,
  udid,
  note,
  prefix,
  serve,
  servePort
) => {
  const path = "/api/cp/update_resolution";
  const parameter = {
    sessdata: sessdata,
    udid: udid,
    note: note,
    prefix: prefix,
    serve: serve,
    servePort: servePort,
  };
  try {
    await axiosPOST(parameter, path);
    return Promise.resolve(true);
  } catch (e) {
    window.$notification.error({
      title: e[0],
      content: e[1],
      duration: 10000,
    });
    return Promise.reject(e);
  }
};

/**
 * 删除域名API
 * @param {String} sessdata SESSDATA
 * @param {String} udid UDID
 * @returns true | [errorTitle, errorMessage, errorCode?]
 */
const delResolution = async (sessdata, udid) => {
  const path = "/api/cp/del_resolution";
  const parameter = {
    sessdata: sessdata,
    udid: udid,
  };
  try {
    await axiosPOST(parameter, path);
    return Promise.resolve(true);
  } catch (e) {
    window.$notification.error({
      title: e[0],
      content: e[1],
      duration: 10000,
    });
    return Promise.reject(e);
  }
};

/**
 * 新增域名API
 * @param {String} sessdata SESSDATA
 * @param {String} note 备注
 * @param {String} prefix 域名前缀
 * @param {String} serve 服务器IP/域名
 * @param {String} servePort 服务器端口
 * @returns true | [errorTitle, errorMessage, errorCode?]
 */
const addResolution = async (sessdata, note, prefix, serve, servePort) => {
  const path = "/api/cp/add_resolution";
  const parameter = {
    sessdata: sessdata,
    note: note,
    prefix: prefix,
    serve: serve,
    servePort: servePort,
  };
  try {
    await axiosPOST(parameter, path);
    return Promise.resolve(true);
  } catch (e) {
    window.$notification.error({
      title: e[0],
      content: e[1],
      duration: 10000,
    });
    return Promise.reject(e);
  }
};

/**
 * 修改密码API
 * @param {String} sessdata SESSDATA
 * @param {String} key Key
 * @param {String} password 密码
 * @returns true | [errorTitle, errorMessage, errorCode?]
 */
const changePassword = async (sessdata, key, password) => {
  const path = "/api/cp/change_password";
  const parameter = {
    sessdata: sessdata,
    key: key,
    password: password,
  };
  try {
    await axiosPOST(parameter, path);
    return Promise.resolve(true);
  } catch (e) {
    window.$notification.error({
      title: e[0],
      content: e[1],
      duration: 10000,
    });
    return Promise.reject(e);
  }
};

/**
 * 修改密码 获取邮箱验证码API
 * @param {String} sessdata SESSDATA
 * @returns true | [errorTitle, errorMessage, errorCode?]
 */
const changePassword_getCheckMailCode = async (sessdata) => {
  const path = "/api/cp/change_password/get_check_mail_code";
  const parameter = {
    sessdata: sessdata,
  };
  try {
    await axiosPOST(parameter, path);
    return Promise.resolve(true);
  } catch (e) {
    window.$notification.error({
      title: e[0],
      content: e[1],
      duration: 10000,
    });
    return Promise.reject(e);
  }
};

/**
 * 获取解析量
 * @param {String} sessdata SESSDATA
 * @returns StatisticsData | [errorTitle, errorMessage, errorCode?]
 */
const getStatistics = async (sessdata, startTime, endTime) => {
  const path = "/api/cp/getStatistics";
  const parameter = {
    sessdata: sessdata,
    startTime: startTime,
    endTime: endTime,
  };
  try {
    const reqData = await axiosPOST(parameter, path);
    return Promise.resolve(reqData.data);
  } catch (e) {
    window.$notification.error({
      title: e[0],
      content: e[1],
      duration: 10000,
    });
    return Promise.reject(e);
  }
};

export {
  getUserInfo,
  updateResolution,
  delResolution,
  addResolution,
  changePassword,
  changePassword_getCheckMailCode,
  getStatistics,
};
