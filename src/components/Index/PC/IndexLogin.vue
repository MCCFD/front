<template>
  <n-form>
    <n-form-item-row
      :validation-status="LoginMailStatus"
      :feedback="LoginMailMessage"
      label="邮箱"
    >
      <n-input
        v-model:value="Login.Mail"
        :input-props="{ autocomplete: true }"
        clearable
      />
    </n-form-item-row>
    <n-form-item-row
      :validation-status="LoginPasswordStatus"
      :feedback="LoginPasswordMessage"
      label="密码"
    >
      <n-input
        type="password"
        v-model:value="Login.Password"
        show-password-on="mousedown"
        :maxlength="128"
        :input-props="{ autocomplete: true }"
        clearable
      />
    </n-form-item-row>
  </n-form>
  <n-button type="primary" block secondary strong @click="LoginButtonClick">
    登录
  </n-button>
  <n-space justify="end">
    <n-a href="/find" style="text-decoration: none">忘记密码？</n-a>
  </n-space>
  <n-modal v-model:show="showReCaptchaModal">
    <n-card
      style="width: 450px"
      title="请通过人机校验"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <vue-recaptcha
        v-if="showReCaptchaModal"
        :sitekey="sitekey"
        :recaptchaHost="recaptchaHost"
        theme="dark"
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
import VueCookies from "vue-cookies";
import { VueRecaptcha } from "vue-recaptcha";
import { loginAPI } from "@/API/loginAPI";
import MD5 from "crypto-js/md5";
import CONFIG from "@/config";
import { checkMail, checkPassword } from "@/assets/js/check";
import {
  NA,
  NForm,
  NCard,
  NInput,
  NSpace,
  NModal,
  NButton,
  NFormItemRow,
} from "naive-ui";
import { useMessage, useNotification } from "naive-ui";

const LoginMail = ref("");
const LoginPassword = ref("");
const showReCaptchaModal = ref(false);
export default defineComponent({
  components: {
    // reCaptcha
    VueRecaptcha,
    // naiveUI
    NA,
    NForm,
    NCard,
    NInput,
    NSpace,
    NModal,
    NButton,
    NFormItemRow,
  },
  setup() {
    window.$message = useMessage();
    window.$notification = useNotification();
    return {
      sitekey: CONFIG.reCaptcha.sitekey,
      recaptchaHost: CONFIG.reCaptcha.recaptchaHost,
      showReCaptchaModal,
      Login: ref({
        Mail: LoginMail,
        Password: LoginPassword,
      }),
      LoginMailStatus: computed(() => {
        return checkMail.inputValidationStatus(
          LoginMail.value.toLocaleLowerCase()
        );
      }),
      LoginMailMessage: computed(() => {
        return checkMail.inputFeedback(LoginMail.value.toLocaleLowerCase());
      }),
      LoginPasswordStatus: computed(() => {
        return checkPassword.inputValidationStatus(LoginPassword.value);
      }),
      LoginPasswordMessage: computed(() => {
        return checkPassword.inputFeedback(LoginPassword.value);
      }),
      async verifyMethod(resp) {
        console.log("reCaptcha 验证通过");
        try {
          const sessdata = await loginAPI(
            LoginMail.value.toLocaleLowerCase(),
            MD5(String(LoginPassword.value)).toString(),
            resp
          );
          VueCookies.set("SESSDATA", sessdata, "0");
          LoginMail.value = "";
          LoginPassword.value = "";
          window.$message.success("登陆成功");
          router.push("/cp");
        } catch (e) {
          console.error("API ERROR", e);
        }
        showReCaptchaModal.value = false;
      },
      expiredMethod() {
        console.log("reCaptcha 过期");
        window.$message.warning("reCaptcha 过期");
      },
      errorMethod() {
        console.log("reCaptcha Error");
        window.$message.success("reCaptcha Error");
      },
      LoginButtonClick(e) {
        e.preventDefault();
        var cMail = checkMail.check(LoginMail.value.toLocaleLowerCase());
        var cPassword = checkPassword.check(LoginPassword.value);
        if (LoginMail.value.toLocaleLowerCase() == "") {
          window.$message.error("请输入邮箱");
          console.log("Mail 验证失败");
        } else if (LoginPassword.value == "") {
          window.$message.error("请输入密码");
          console.log("Password 验证失败");
        } else if (cMail != true) {
          window.$message.error(
            checkMail.inputFeedback(LoginMail.value.toLocaleLowerCase())
          );
          console.log("Mail 验证失败");
        } else if (cPassword != true) {
          window.$message.error(
            checkPassword.inputFeedback(LoginPassword.value)
          );
          console.log("Password 验证失败");
        } else if (cMail == true && cPassword == true) {
          console.log("验证成功");
          showReCaptchaModal.value = true;
        }
      },
    };
  },
});
</script>
