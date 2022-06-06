<template>
  <n-form size="small">
    <n-form-item-row
      size="small"
      label="邮箱"
      :feedback="RegisterMailMessage"
      :validation-status="RegisterMailStatus"
    >
      <n-input
        size="small"
        clearable
        v-model:value="Register.Mail"
        :input-props="{ autocomplete: false }"
      />
    </n-form-item-row>
    <n-form-item-row size="small" label="验证码">
      <n-input-group>
        <n-input
          size="small"
          clearable
          v-model:value="Register.CheckMailCode"
          :disabled="getCheckMailCodeType == 'Null'"
          :input-props="{ autocomplete: false }"
        />
        <n-button
          size="small"
          type="primary"
          ghost
          :style="{ width: '33%' }"
          v-if="getCheckMailCodeType == 'OK' || getCheckMailCodeType == 'Null'"
          @click="getCheckMailCode"
        >
          获取验证码
        </n-button>
        <n-button
          size="small"
          type="primary"
          disabled
          ghost
          :style="{ width: '47%' }"
          v-if="getCheckMailCodeType == 'wait'"
        >
          <n-countdown
            :duration="60 * 1000"
            :render="renderCountdown"
            :on-finish="getCheckMailCodeWaitFinish"
            :active="getCheckMailCodeType == 'wait'"
          />
          秒后重新获取
        </n-button>
      </n-input-group>
    </n-form-item-row>
    <n-form-item-row
      size="small"
      label="用户名"
      :feedback="UserNameMessage"
      :validation-status="UserNameStatus"
    >
      <n-input
        size="small"
        placeholder="4-20 位中英文数字下划线"
        clearable
        v-model:value="Register.UserName"
        :maxlength="20"
        :input-props="{ autocomplete: false }"
      />
    </n-form-item-row>
    <n-form-item-row
      size="small"
      label="密码"
      :feedback="RegisterPasswordMessage"
      :validation-status="RegisterPasswordStatus"
    >
      <n-input
        size="small"
        type="password"
        show-password-on="mousedown"
        placeholder="8-128 位字母数字半角符号"
        clearable
        :maxlength="128"
        v-model:value="Register.Password"
        :input-props="{ autocomplete: false }"
      />
    </n-form-item-row>
    <n-form-item-row
      size="small"
      label="重复密码"
      :feedback="RegisterRPasswordMessage"
      :validation-status="RegisterRPasswordStatus"
    >
      <n-input
        size="small"
        type="password"
        show-password-on="mousedown"
        placeholder="请再次输入一次密码"
        clearable
        :maxlength="128"
        v-model:value="Register.RPassword"
        :input-props="{ autocomplete: false }"
      />
    </n-form-item-row>
  </n-form>
  <n-button
    size="small"
    type="primary"
    block
    secondary
    strong
    @click="RegisterButtonClick"
  >
    注册
  </n-button>
  <n-modal v-model:show="showGetCheckMailCodeReCaptchaModal">
    <n-card
      title="请通过人机校验"
      size="small"
      role="dialog"
      aria-modal="true"
      :bordered="false"
    >
      <vue-recaptcha
        theme="dark"
        v-if="showGetCheckMailCodeReCaptchaModal"
        :sitekey="sitekey"
        :recaptchaHost="recaptchaHost"
        @verify="getCheckMailCodeVerifyMethod"
        @expired="expiredMethod"
        @error="errorMethod"
      />
    </n-card>
  </n-modal>
  <n-modal v-model:show="showReCaptchaModal">
    <n-card
      title="请通过人机校验"
      size="small"
      role="dialog"
      aria-modal="true"
      :bordered="false"
    >
      <vue-recaptcha
        theme="dark"
        v-if="showReCaptchaModal"
        :sitekey="sitekey"
        :recaptchaHost="recaptchaHost"
        @verify="verifyMethod"
        @expired="expiredMethod"
        @error="errorMethod"
      />
    </n-card>
  </n-modal>
</template>

<script>
import { defineComponent, computed, ref } from "vue";
import router from "@/router";
import MD5 from "crypto-js/md5";
import VueCookies from "vue-cookies";
import { VueRecaptcha } from "vue-recaptcha";
import CONFIG from "@/config";
import { registeredAPI, getCheckMailCodeAPI } from "@/API/registeredAPI";
import { checkMail, checkPassword, checkUserName } from "@/assets/js/check";
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

const RegisterMail = ref("");
const RegisterCheckMailCode = ref("");
const RegisterUserName = ref("");
const RegisterPassword = ref("");
const RegisterRPassword = ref("");
const getCheckMailCodeType = ref("Null");
const showGetCheckMailCodeReCaptchaModal = ref(false);
const showReCaptchaModal = ref(false);
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
    const renderCountdown = ({ seconds }) => {
      return `${String(seconds).padStart(2, "0")}`;
    };
    return {
      sitekey: CONFIG.reCaptcha.sitekey,
      recaptchaHost: CONFIG.reCaptcha.recaptchaHost,
      showReCaptchaModal,
      showGetCheckMailCodeReCaptchaModal,
      getCheckMailCodeType,
      renderCountdown,
      Register: ref({
        Mail: RegisterMail,
        CheckMailCode: RegisterCheckMailCode,
        UserName: RegisterUserName,
        Password: RegisterPassword,
        RPassword: RegisterRPassword,
      }),
      getCheckMailCode(e) {
        e.preventDefault();
        var cMail = checkMail.check(RegisterMail.value.toLocaleLowerCase());
        if (RegisterMail.value.toLocaleLowerCase() == "") {
          window.$message.error("请输入邮箱");
        } else if (cMail != true) {
          window.$message.error(
            checkMail.inputFeedback(RegisterMail.value.toLocaleLowerCase())
          );
        } else if (cMail == true) {
          console.log("验证成功");
          showGetCheckMailCodeReCaptchaModal.value = true;
        }
      },
      getCheckMailCodeWaitFinish() {
        getCheckMailCodeType.value = "OK";
      },
      RegisterMailStatus: computed(() => {
        return checkMail.inputValidationStatus(
          RegisterMail.value.toLocaleLowerCase()
        );
      }),
      RegisterMailMessage: computed(() => {
        return checkMail.inputFeedback(RegisterMail.value.toLocaleLowerCase());
      }),
      UserNameStatus: computed(() => {
        return checkUserName.inputValidationStatus(RegisterUserName.value);
      }),
      UserNameMessage: computed(() => {
        return checkUserName.inputFeedback(RegisterUserName.value);
      }),
      RegisterPasswordStatus: computed(() => {
        return checkPassword.inputValidationStatus(RegisterPassword.value);
      }),
      RegisterPasswordMessage: computed(() => {
        return checkPassword.inputFeedback(RegisterPassword.value);
      }),
      RegisterRPasswordStatus: computed(() => {
        if (RegisterRPassword.value == "") {
          return void 0;
        } else if (RegisterRPassword.value != RegisterPassword.value) {
          return "error";
        } else {
          return checkPassword.inputValidationStatus(RegisterRPassword.value);
        }
      }),
      RegisterRPasswordMessage: computed(() => {
        if (RegisterRPassword.value == "") {
          return "";
        } else if (RegisterRPassword.value != RegisterPassword.value) {
          return "两次输入的密码不一样";
        } else {
          return checkPassword.inputFeedback(RegisterRPassword.value);
        }
      }),
      async getCheckMailCodeVerifyMethod(resp) {
        console.log("reCaptcha 验证通过");
        try {
          await getCheckMailCodeAPI(RegisterMail.value, resp);
          window.$message.success("验证码发送成功, 请前往邮箱查看");
          getCheckMailCodeType.value = "wait";
        } catch (e) {
          console.error("API ERROR", e);
        }
        showGetCheckMailCodeReCaptchaModal.value = false;
      },
      async verifyMethod(resp) {
        console.log("reCaptcha 验证通过");
        try {
          const sessdata = await registeredAPI(
            RegisterCheckMailCode.value,
            RegisterUserName.value,
            MD5(String(RegisterPassword.value)).toString(),
            resp
          );
          showReCaptchaModal.value = false;
          VueCookies.set("SESSDATA", sessdata, "0");
          RegisterMail.value = "";
          RegisterCheckMailCode.value = "";
          RegisterUserName.value = "";
          RegisterPassword.value = "";
          RegisterRPassword.value = "";
          window.$message.success("注册成功");
          router.push("/cp");
        } catch (e) {
          console.error("API ERROR", e);
        }
      },
      expiredMethod() {
        console.log("reCaptcha 过期");
        window.$message.warning("reCaptcha 过期");
      },
      errorMethod() {
        console.log("reCaptcha Error");
        window.$message.success("reCaptcha Error");
      },
      RegisterButtonClick(e) {
        e.preventDefault();
        var cMail = checkMail.check(RegisterMail.value.toLocaleLowerCase());
        var cPassword = checkPassword.check(RegisterPassword.value);
        if (RegisterCheckMailCode.value == "") {
          window.$message.error("请输入验证码");
        } else if (RegisterMail.value.toLocaleLowerCase() == "") {
          window.$message.error("请输入邮箱");
        } else if (
          RegisterPassword.value == "" ||
          RegisterRPassword.value == ""
        ) {
          window.$message.error("请输入密码");
        } else if (RegisterPassword.value != RegisterRPassword.value) {
          window.$message.error("两次输入的密码不一样");
        } else if (cMail != true) {
          window.$message.error(
            checkMail.inputFeedback(RegisterMail.value.toLocaleLowerCase())
          );
        } else if (cPassword != true) {
          window.$message.error(
            checkPassword.inputFeedback(RegisterPassword.value)
          );
        } else if (cMail == true && cPassword == true) {
          console.log("验证成功");
          showReCaptchaModal.value = true;
        }
      },
    };
  },
});
</script>
