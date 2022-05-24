<template>
  <n-card title="找回密码">
    <n-form>
      <n-form-item-row
        :validation-status="MailStatus"
        :feedback="MailMessage"
        label="邮箱"
      >
        <n-input
          v-model:value="Find.Mail"
          :input-props="{ autocomplete: true }"
          clearable
        />
      </n-form-item-row>
      <n-form-item-row label="验证码">
        <n-input-group>
          <n-input
            v-model:value="Find.CheckMailCode"
            :disabled="getCheckMailCodeType == 'Null'"
            :input-props="{ autocomplete: false }"
            clearable
          />
          <n-button
            :style="{ width: '33%' }"
            v-if="
              getCheckMailCodeType == 'OK' || getCheckMailCodeType == 'Null'
            "
            type="primary"
            ghost
            @click="getCheckMailCode"
          >
            获取验证码
          </n-button>
          <n-button
            :style="{ width: '47%' }"
            v-if="getCheckMailCodeType == 'wait'"
            type="primary"
            disabled
            ghost
          >
            <n-countdown
              :render="renderCountdown"
              :duration="60 * 1000"
              :active="getCheckMailCodeType == 'wait'"
              :on-finish="getCheckMailCodeWaitFinish"
            />
            秒后重新获取
          </n-button>
        </n-input-group>
      </n-form-item-row>
      <n-form-item-row
        :validation-status="PasswordStatus"
        :feedback="PasswordMessage"
        label="密码"
      >
        <n-input
          type="password"
          v-model:value="Find.Password"
          show-password-on="mousedown"
          placeholder="8-128 位字母数字半角符号"
          :maxlength="128"
          :input-props="{ autocomplete: true }"
          clearable
        />
      </n-form-item-row>
      <n-form-item-row
        :validation-status="RPasswordStatus"
        :feedback="RPasswordMessage"
        label="重复密码"
      >
        <n-input
          type="password"
          v-model:value="Find.RPassword"
          show-password-on="mousedown"
          placeholder="请再次输入一次密码"
          :maxlength="128"
          :input-props="{ autocomplete: true }"
          clearable
        />
      </n-form-item-row>
    </n-form>
    <n-button type="primary" block secondary strong @click="OKButtonClick">
      完成
    </n-button>
    <n-modal v-model:show="showCheckMailCodeReCaptchaModal">
      <n-card
        style="width: 450px"
        title="请通过人机校验"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <vue-recaptcha
          v-if="showCheckMailCodeReCaptchaModal"
          :sitekey="sitekey"
          :recaptchaHost="recaptchaHost"
          theme="dark"
          @verify="checkMailCode_verifyMethod"
          @expired="expiredMethod"
          @error="errorMethod"
        ></vue-recaptcha>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showOKReCaptchaModal">
      <n-card
        style="width: 450px"
        title="请通过人机校验"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <vue-recaptcha
          v-if="showOKReCaptchaModal"
          :sitekey="sitekey"
          :recaptchaHost="recaptchaHost"
          theme="dark"
          @verify="OK_verifyMethod"
          @expired="expiredMethod"
          @error="errorMethod"
        ></vue-recaptcha>
      </n-card>
    </n-modal>
  </n-card>
</template>

<script>
import { ref, computed, defineComponent } from "vue";
import VueCookies from "vue-cookies";
import router from "@/router";
import { VueRecaptcha } from "vue-recaptcha";
import CONFIG from "@/config";
import MD5 from "crypto-js/md5";
import { findAPI, getCheckMailCodeAPI } from "@/API/findAPI";
import { checkMail, checkPassword } from "@/assets/js/check";
import {
  NCard,
  NForm,
  NInput,
  NModal,
  NButton,
  NCountdown,
  NInputGroup,
  NFormItemRow,
} from "naive-ui";
import { useMessage, useNotification } from "naive-ui";

const Init = () => {
  if (VueCookies.get("SESSDATA") != null) {
    router.push("/cp");
  }
};

const getCheckMailCodeType = ref("Null");
const showCheckMailCodeReCaptchaModal = ref(false);
const showOKReCaptchaModal = ref(false);
const Mail = ref("");
const CheckMailCode = ref("");
const Password = ref("");
const RPassword = ref("");
export default defineComponent({
  components: {
    // reCaptcha
    VueRecaptcha,
    // naiveUI
    NCard,
    NForm,
    NInput,
    NModal,
    NButton,
    NCountdown,
    NInputGroup,
    NFormItemRow,
  },
  setup() {
    window.$message = useMessage();
    window.$notification = useNotification();
    Init();
    const renderCountdown = ({ seconds }) => {
      return `${String(seconds).padStart(2, "0")}`;
    };
    return {
      sitekey: CONFIG.reCaptcha.sitekey,
      recaptchaHost: CONFIG.reCaptcha.recaptchaHost,
      renderCountdown,
      getCheckMailCodeType,
      showCheckMailCodeReCaptchaModal,
      showOKReCaptchaModal,
      Find: ref({
        Mail,
        CheckMailCode,
        Password,
        RPassword,
      }),
      MailStatus: computed(() => {
        return checkMail.inputValidationStatus(Mail.value.toLocaleLowerCase());
      }),
      MailMessage: computed(() => {
        return checkMail.inputFeedback(Mail.value.toLocaleLowerCase());
      }),
      PasswordStatus: computed(() => {
        return checkPassword.inputValidationStatus(Password.value);
      }),
      PasswordMessage: computed(() => {
        return checkPassword.inputFeedback(Password.value);
      }),
      RPasswordStatus: computed(() => {
        if (RPassword.value == "") {
          return void 0;
        } else if (RPassword.value != Password.value) {
          return "error";
        } else {
          return checkPassword.inputValidationStatus(RPassword.value);
        }
      }),
      RPasswordMessage: computed(() => {
        if (RPassword.value == "") {
          return "";
        } else if (RPassword.value != Password.value) {
          return "两次输入的密码不一样";
        } else {
          return checkPassword.inputFeedback(RPassword.value);
        }
      }),
      getCheckMailCodeWaitFinish() {
        getCheckMailCodeType.value = "OK";
      },
      getCheckMailCode(e) {
        e.preventDefault();
        const cMail = checkMail.check(Mail.value.toLocaleLowerCase());
        if (cMail != true) {
          if (cMail == "null") {
            window.$message.error("请输入邮箱");
          } else {
            window.$message.error(
              checkMail.inputFeedback(Mail.value.toLocaleLowerCase())
            );
          }
        } else {
          showCheckMailCodeReCaptchaModal.value = true;
        }
      },
      async checkMailCode_verifyMethod(resp) {
        console.log("reCaptcha 验证通过", resp);
        // 请求API 获取验证码
        try {
          await getCheckMailCodeAPI(Mail.value.toLocaleLowerCase(), resp);
          window.$message.success("验证码发送成功, 请前往邮箱查看");
          getCheckMailCodeType.value = "wait";
        } catch (e) {
          console.error("API ERROR", e);
        }
        showCheckMailCodeReCaptchaModal.value = false;
      },
      async OK_verifyMethod(resp) {
        console.log("reCaptcha 验证通过", resp);
        // 请求API 找回密码
        try {
          const sessdata = await findAPI(
            CheckMailCode.value.toLocaleLowerCase(),
            MD5(Password.value).toString(),
            resp
          );
          VueCookies.set("SESSDATA", sessdata, "0");
          Mail.value = "";
          CheckMailCode.value = "";
          Password.value = "";
          RPassword.value = "";
          window.$message.success("登陆成功");
          router.push("/cp");
        } catch (e) {
          console.error("API ERROR", e);
        }
        showOKReCaptchaModal.value = false;
      },
      expiredMethod() {
        console.log("reCaptcha 过期");
        window.$message.error("reCaptcha 过期");
      },
      errorMethod() {
        console.log("reCaptcha Error");
        window.$message.error("reCaptcha Error");
      },
      OKButtonClick(e) {
        e.preventDefault();
        const cMail = checkMail.check(Mail.value.toLocaleLowerCase());
        const cPassword = checkPassword.check(Password.value);
        if (cMail != true) {
          if (cMail == "null") {
            window.$message.error("请输入邮箱");
          } else {
            window.$message.error(
              checkMail.inputFeedback(Mail.value.toLocaleLowerCase())
            );
          }
        } else if (String(CheckMailCode.value).length != 8) {
          window.$message.error("请输入验证码");
        } else if (cPassword != true) {
          if (cPassword == "null") {
            window.$message.error("请输入密码");
          } else {
            window.$message.error(checkPassword.inputFeedback(Password.value));
          }
        } else if (Password.value != RPassword.value) {
          window.$message.error("两次输入的密码不一样");
        } else {
          console.log("校验通过");
          showOKReCaptchaModal.value = true;
        }
      },
    };
  },
});
</script>
