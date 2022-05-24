import { axiosPOST } from "@/API/axios";

/**
 * 注册API
 * @param {String} key checkMailCode
 * @param {String} userName 用户名
 * @param {String} password 密码
 * @param {String} reCaptchaKey 验证码
 * @returns sessdata | [errorTitle, errorMessage, errorCode?]
 */
const registeredAPI = async (key, userName, password, reCaptchaKey) => {
  const path = "/api/registered";
  const parameter = {
    key: key,
    userName: userName,
    password: password,
    reCaptchaKey: reCaptchaKey,
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
 * 获取邮箱验证码API
 * @param {String} mail 邮箱
 * @param {String} reCaptchaKey 验证码
 * @returns true | [errorTitle, errorMessage, errorCode?]
 */
const getCheckMailCodeAPI = async (mail, reCaptchaKey) => {
  const path = "/api/registered/get_check_mail_code";
  const parameter = {
    mail: mail,
    reCaptchaKey: reCaptchaKey,
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

export { registeredAPI, getCheckMailCodeAPI };
