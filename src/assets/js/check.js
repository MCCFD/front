const checkPassword = {
  check: (password) => {
    if (password == "" || password == undefined || password == null)
      return "null";
    else if (
      password.search(
        /^[a-z|A-Z|0-9|,|.|/|<|>|?|;|'|:|"|[|\]|\\|{|}|||!|@|#|$|%|^|&|*|(|)|_|+|=|\-|`|~]+$/
      ) != 0
    )
      return false;
    else if (
      password.search(
        /^[a-z|A-Z|0-9|,|.|/|<|>|?|;|'|:|"|[|\]|\\|{|}|||!|@|#|$|%|^|&|*|(|)|_|+|=|\-|`|~]{8,128}$/
      ) != 0
    )
      return "illegal-num";
    else return true;
  },
  inputValidationStatus: (password) => {
    var tmp = checkPassword.check(password);
    if (tmp == "null" || tmp == true) return void 0;
    else return "error";
  },
  inputFeedback: (password) => {
    var tmp = checkPassword.check(password);
    switch (tmp) {
      case "null":
        return "";
      case "illegal-num":
        return "密码仅能 8-128 位";
      case true:
        return "";
      case false:
        return "密码仅能包含 字母, 数字, 半角符号";
      default:
        return "发生未知错误";
    }
  },
};

const blackMailList = ["xx.xx"];
const checkMail = {
  get: (mail) =>
    mail.toLocaleLowerCase().split("@")[mail.split("@").length - 1],
  check: (mail) => {
    mail = mail.toLocaleLowerCase();
    if (mail == "" || mail == null || mail == "") return "null";
    else if (mail.search(/^.+@.+\.[a-z]+$/) != 0) return false;
    for (var i in blackMailList)
      if (checkMail.get(mail) == blackMailList[i]) return "black";
    return true;
  },
  inputValidationStatus: (mail) => {
    var tmp = checkMail.check(mail);
    if (tmp == "null" || tmp == true) return void 0;
    else return "error";
  },
  inputFeedback: (mail) => {
    var tmp = checkMail.check(mail);
    switch (tmp) {
      case "null":
        return "";
      case "black":
        return "@" + checkMail.get(mail) + " 邮箱已被管理员拉入黑名单";
      case true:
        return "";
      case false:
        return "邮箱格式错误";
      default:
        return "发生未知错误";
    }
  },
};

const checkUserName = {
  check: (UserName) => {
    if (UserName == "" || UserName == undefined || UserName == null)
      return "null";
    else if (UserName.search(/^[a-z|A-Z|\u4e00-\u9fa5|0-9]+$/) != 0)
      return false;
    else if (UserName.search(/^[a-z|A-Z|\u4e00-\u9fa5|0-9|_]{4,20}$/) != 0)
      return "illegal-num";
    else return true;
  },
  inputValidationStatus: (UserName) => {
    var tmp = checkUserName.check(UserName);
    if (tmp == "null" || tmp == true) return void 0;
    else return "error";
  },
  inputFeedback: (UserName) => {
    var tmp = checkUserName.check(UserName);
    switch (tmp) {
      case "null":
        return "";
      case "illegal-num":
        return "用户名仅能 4-20 位";
      case true:
        return "";
      case false:
        return "用户名仅能包含 中文, 字母, 数字, 下划线";
      default:
        return "发生未知错误";
    }
  },
};

const checkPrefix = {
  check: (prefix) => {
    // prefix 是否合法
    if (prefix == "" || prefix == null || prefix == undefined) return "null";
    else if (prefix.search(/^[a-z|A-Z|0-9|\u4e00-\u9fa5|\-|_]*$/) != 0)
      return "illegal";
    else if (prefix.search(/^[a-z|A-Z|0-9|\u4e00-\u9fa5|\-|_]{3,63}$/) != 0)
      return "illegal-num";
    return true;
  },
  inputValidationStatus: (prefix) => {
    var tmp = checkPrefix.check(prefix);
    if (tmp == "null" || tmp == true) return void 0;
    else return "error";
    // return void 0; 正常
    // return "warning"; Warning
    // return "error"; Error
  },
  inputFeedback: (prefix) => {
    var tmp = checkPrefix.check(prefix);
    switch (tmp) {
      case "null":
        return "";
      case "illegal":
        return "域名前缀仅能包含 a-z, A-Z, 0-9, -, _, 中文";
      case "illegal-num":
        return "域名前缀仅能在 3-63 之间";
      case true:
        return "";
      default:
        return "发生未知错误";
    }
  },
};

const checkServe = {
  check: (serve) => {
    // prefix 是否合法
    if (serve == "" || serve == null || serve == undefined) return "null";
    else if (
      serve.search(
        /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/
      ) == 0
    ) {
      return "v4";
    } else if (
      serve.search(
        /^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/
      ) == 0
    )
      return "v6";
    else if (serve.search(/^.+\..+$/) == 0) {
      return "domain";
    } else return "illegal";
  },
  inputValidationStatus: (serve) => {
    var tmp = checkServe.check(serve);
    if (tmp == "illegal") return "error";
    else return void 0;
    // return void 0; 正常
    // return "warning"; Warning
    // return "error"; Error
  },
  inputFeedback: (serve) => {
    var tmp = checkServe.check(serve);
    switch (tmp) {
      case "null":
        return "";
      case "illegal":
        return "请输入服务器的域名/IPV4/IPV6";
      case "domain":
        return "您输入的是: 域名";
      case "v4":
        return "您输入的是: IPV4";
      case "v6":
        return "您输入的是: IPV6";
      default:
        return "发生未知错误";
    }
  },
};

const checkServePort = {
  check: (servePort) => {
    if (
      servePort <= 0 ||
      servePort >= 65535 ||
      servePort.toString().search(/^[0-9]+$/) != 0
    ) {
      return false;
    } else {
      return true;
    }
  },
  inputValidationStatus: (servePort) => {
    var tmp = checkServePort.check(servePort);
    if (tmp == true) {
      return void 0;
    } else if (tmp == false) {
      return "error";
    }
  },
  inputFeedback: (servePort) => {
    var tmp = checkServePort.check(servePort);
    if (tmp == true) {
      return "";
    } else if (tmp == false) {
      return "端口范围 0-65535";
    }
  },
};

export {
  checkPassword,
  checkMail,
  checkUserName,
  checkPrefix,
  checkServe,
  checkServePort,
};
