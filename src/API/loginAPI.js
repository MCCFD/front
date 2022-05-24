import { axiosPOST } from "@/API/axios";

/**
 * 登陆API
 * @param {String} mail 邮箱
 * @param {String} password 密码
 * @param {String} reCaptchaKey 验证码
 * @returns sessdata | [errorTitle, errorMessage, errorCode?]
 */
const loginAPI = async (mail, password, reCaptchaKey) => {
  const path = "/api/login";
  const parameter = {
    mail: mail,
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

export { loginAPI };
