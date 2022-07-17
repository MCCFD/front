import { axiosPOST } from "@/API/axios";

/**
 * 登陆API
 * @param {String} mail 邮箱
 * @param {String} password 密码
 * @param {String} reCaptchaKey 验证码
 * @returns sessdata | [errorTitle, errorMessage, errorCode?]
 */

/**
 * 找回密码API
 * @param {String} key Key
 * @param {String} password 密码
 * @param {String} captchaServer Captcha服务器
 * @param {String} captchaToken Captcha Token
 * @returns sessdata | [errorTitle, errorMessage, errorCode?]
 */
const findAPI = async (key, password, captchaServer, captchaToken) => {
  const path = "/api/find";
  const parameter = {
    key: key,
    password: password,
    captchaServer: captchaServer,
    captchaToken: captchaToken,
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
 * @param {String} captchaServer Captcha服务器
 * @param {String} captchaToken Captcha Token
 * @returns true | [errorTitle, errorMessage, errorCode?]
 */
const getCheckMailCodeAPI = async (mail, captchaServer, captchaToken) => {
  const path = "/api/find/get_check_mail_code";
  const parameter = {
    mail: mail,
    captchaServer: captchaServer,
    captchaToken: captchaToken,
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

export { findAPI, getCheckMailCodeAPI };
