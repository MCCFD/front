<template>
  <n-form>
    <n-form-item-row
      :validation-status="RegisterMailStatus"
      :feedback="RegisterMailMessage"
      label="邮箱"
    >
      <n-input
        v-model:value="Register.Mail"
        :input-props="{ autocomplete: false }"
        clearable
      />
    </n-form-item-row>
    <n-form-item-row label="验证码">
      <n-input-group>
        <n-input
          v-model:value="Register.CheckMailCode"
          :disabled="getCheckMailCodeType == 'Null'"
          :input-props="{ autocomplete: false }"
          clearable
        />
        <n-button
          :style="{ width: '33%' }"
          v-if="getCheckMailCodeType == 'OK' || getCheckMailCodeType == 'Null'"
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
      :validation-status="UserNameStatus"
      :feedback="UserNameMessage"
      label="用户名"
    >
      <n-input
        v-model:value="Register.UserName"
        placeholder="4-20 位中英文数字下划线"
        :maxlength="20"
        :input-props="{ autocomplete: false }"
        clearable
      />
    </n-form-item-row>
    <n-form-item-row
      :validation-status="RegisterPasswordStatus"
      :feedback="RegisterPasswordMessage"
      label="密码"
    >
      <n-input
        type="password"
        v-model:value="Register.Password"
        show-password-on="mousedown"
        placeholder="8-128 位字母数字半角符号"
        :maxlength="128"
        :input-props="{ autocomplete: false }"
        clearable
      />
    </n-form-item-row>
    <n-form-item-row
      :validation-status="RegisterRPasswordStatus"
      :feedback="RegisterRPasswordMessage"
      label="重复密码"
    >
      <n-input
        type="password"
        v-model:value="Register.RPassword"
        show-password-on="mousedown"
        placeholder="请再次输入一次密码"
        :maxlength="128"
        :input-props="{ autocomplete: false }"
        clearable
      />
    </n-form-item-row>
  </n-form>
  <n-button type="primary" block secondary strong @click="RegisterButtonClick">
    注册
  </n-button>
  <n-modal v-model:show="showGetCheckMailCodeReCaptchaModal">
    <n-card
      style="width: 450px"
      title="请通过人机校验"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <VaptchaComponent
        v-if="showGetCheckMailCodeReCaptchaModal"
        :scene="2"
        @pass="getCheckMailCodeVerifyMethod"
      />
    </n-card>
  </n-modal>
  <n-modal v-model:show="showReCaptchaModal">
    <n-card
      style="width: 450px"
      title="请通过人机校验"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <VaptchaComponent
        v-if="showReCaptchaModal"
        :scene="2"
        @pass="verifyMethod"
      />
    </n-card>
  </n-modal>
</template>

<script>
import { defineComponent, computed, ref } from "vue";
import router from "@/router";
import MD5 from "crypto-js/md5";
import VueCookies from "vue-cookies";
import CONFIG from "@/config";
import { registeredAPI, getCheckMailCodeAPI } from "@/API/registeredAPI";
import { checkMail, checkPassword, checkUserName } from "@/assets/js/check";
import VaptchaComponent from "@/components/VaptchaComponent";
import {
  NForm,
  NCard,
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
    // Vaptcha
    VaptchaComponent,
    // naiveUI
    NForm,
    NCard,
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
      async getCheckMailCodeVerifyMethod(obj) {
        const serverToken = obj.getServerToken();
        const VaptchaServer = serverToken.server;
        const VaptchaToken = serverToken.token;
        console.log("Vaptcha 验证通过");
        try {
          await getCheckMailCodeAPI(
            RegisterMail.value,
            VaptchaServer,
            VaptchaToken
          );
          window.$message.success("验证码发送成功, 请前往邮箱查看");
          getCheckMailCodeType.value = "wait";
        } catch (e) {
          console.error("API ERROR", e);
        }
        showGetCheckMailCodeReCaptchaModal.value = false;
      },
      async verifyMethod(obj) {
        const serverToken = obj.getServerToken();
        const VaptchaServer = serverToken.server;
        const VaptchaToken = serverToken.token;
        console.log("Vaptcha 验证通过");
        try {
          const sessdata = await registeredAPI(
            RegisterCheckMailCode.value,
            RegisterUserName.value,
            MD5(String(RegisterPassword.value)).toString(),
            VaptchaServer,
            VaptchaToken
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
