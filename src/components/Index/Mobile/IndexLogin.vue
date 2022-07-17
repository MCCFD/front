<template>
  <n-form size="small">
    <n-form-item-row
      size="small"
      label="邮箱"
      :feedback="LoginMailMessage"
      :validation-status="LoginMailStatus"
    >
      <n-input
        size="small"
        clearable
        v-model:value="Login.Mail"
        :input-props="{ autocomplete: true }"
      />
    </n-form-item-row>
    <n-form-item-row
      size="small"
      label="密码"
      :feedback="LoginPasswordMessage"
      :validation-status="LoginPasswordStatus"
    >
      <n-input
        size="small"
        type="password"
        show-password-on="mousedown"
        clearable
        :maxlength="128"
        v-model:value="Login.Password"
        :input-props="{ autocomplete: true }"
      />
    </n-form-item-row>
  </n-form>
  <n-button
    size="small"
    type="primary"
    block
    secondary
    strong
    @click="LoginButtonClick"
  >
    登录
  </n-button>
  <n-space justify="end">
    <n-a href="/find" style="text-decoration: none">忘记密码？</n-a>
  </n-space>
  <n-modal v-model:show="showReCaptchaModal">
    <n-card
      title="请通过人机校验"
      size="small"
      role="dialog"
      aria-modal="true"
      :bordered="false"
    >
      <VaptchaComponent
        v-if="showReCaptchaModal"
        :scene="1"
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
import { loginAPI } from "@/API/loginAPI";
import { checkMail, checkPassword } from "@/assets/js/check";
import VaptchaComponent from "@/components/VaptchaComponent";
import {
  NA,
  NCard,
  NForm,
  NInput,
  NModal,
  NSpace,
  NButton,
  NFormItemRow,
} from "naive-ui";
import { useMessage, useNotification } from "naive-ui";

const LoginMail = ref("");
const LoginPassword = ref("");
const showReCaptchaModal = ref(false);
export default defineComponent({
  components: {
    // Vaptcha
    VaptchaComponent,
    // naiveUI
    NA,
    NCard,
    NForm,
    NInput,
    NModal,
    NSpace,
    NButton,
    NFormItemRow,
  },
  setup() {
    window.$message = useMessage();
    window.$notification = useNotification();
    return {
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
      async verifyMethod(obj) {
        const serverToken = obj.getServerToken();
        const VaptchaServer = serverToken.server;
        const VaptchaToken = serverToken.token;
        console.log("Vaptcha 验证通过");
        try {
          const sessdata = await loginAPI(
            LoginMail.value.toLocaleLowerCase(),
            MD5(String(LoginPassword.value)).toString(),
            VaptchaServer,
            VaptchaToken
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
