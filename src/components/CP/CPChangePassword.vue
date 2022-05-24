<template>
  <n-spin :show="spinAddResolution">
    <n-form label-placement="left" label-width="auto">
      <n-form-item
        :validation-status="PasswordStatus"
        :feedback="PasswordMessage"
        label="新的密码"
      >
        <n-input
          type="password"
          v-model:value="changePassword.Password"
          show-password-on="mousedown"
          placeholder="8-128 位字母数字半角符号"
          :maxlength="128"
          :input-props="{ autocomplete: true }"
          clearable
        />
      </n-form-item>
      <n-form-item
        :validation-status="RPasswordStatus"
        :feedback="RPasswordMessage"
        label="重复新的密码"
      >
        <n-input
          type="password"
          v-model:value="changePassword.RPassword"
          show-password-on="mousedown"
          placeholder="请再次输入一次密码"
          :maxlength="128"
          :input-props="{ autocomplete: true }"
          clearable
        />
      </n-form-item>
      <n-form-item label="新邮箱验证码">
        <n-input-group>
          <n-input
            v-model:value="changePassword.CheckMailCode"
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
      </n-form-item>
    </n-form>
    <n-space justify="end">
      <n-button type="primary" @click="ChangePasswordButtonClick">
        确认修改
      </n-button>
    </n-space>
    <template #description>处理中</template>
  </n-spin>
</template>

<script>
import { ref, computed, defineComponent } from "vue";
// import axios from "axios";
// import router from "@/router";
import VueCookies from "vue-cookies";
import MD5 from "crypto-js/md5";
import { changePassword, changePassword_getCheckMailCode } from "@/API/cpAPI";
import { checkPassword } from "@/assets/js/check";
import {
  NSpin,
  NForm,
  NInput,
  NSpace,
  NButton,
  NFormItem,
  NCountdown,
  NInputGroup,
} from "naive-ui";
import { useMessage, useNotification } from "naive-ui";

const spinAddResolution = ref(false);
const getCheckMailCodeType = ref("Null");
const Password = ref("");
const RPassword = ref("");
const CheckMailCode = ref("");
export default defineComponent({
  components: {
    NSpin,
    NForm,
    NInput,
    NSpace,
    NButton,
    NFormItem,
    NCountdown,
    NInputGroup,
  },
  setup() {
    window.$message = useMessage();
    window.$notification = useNotification();
    const renderCountdown = ({ seconds }) => {
      return `${String(seconds).padStart(2, "0")}`;
    };
    return {
      spinAddResolution,
      renderCountdown,
      getCheckMailCodeType,
      changePassword: ref({
        Password,
        RPassword,
        CheckMailCode,
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
      async getCheckMailCode(e) {
        e.preventDefault();
        // 请求API
        const sessdata = VueCookies.get("SESSDATA");
        if (sessdata == null) {
          VueCookies.remove("SESSDATA");
          location.reload();
          window.$message.error("请先登录/注册");
          return;
        }
        try {
          await changePassword_getCheckMailCode(sessdata);
          window.$message.success("验证码发送成功, 请前往邮箱查看");
          getCheckMailCodeType.value = "wait";
        } catch (e) {
          console.error("API ERROR", e);
          // SESSDATA过期
          if (e[2] == 403) {
            VueCookies.remove("SESSDATA");
            location.reload();
          }
        }
      },
      async ChangePasswordButtonClick(e) {
        e.preventDefault();
        const cPassword = checkPassword.check(Password.value);
        if (String(CheckMailCode.value).length != 8) {
          window.$message.error("请输入验证码");
        } else if (cPassword != true) {
          if (cPassword == "null") {
            window.$message.error("请输入密码");
          } else {
            window.$message.error(checkPassword.inputFeedback(Password.value));
          }
        } else if (RPassword.value != Password.value) {
          window.$message.error("两次输入的密码不一样");
        } else {
          spinAddResolution.value = true;
          // 请求API
          const sessdata = VueCookies.get("SESSDATA");
          if (sessdata == null) {
            VueCookies.remove("SESSDATA");
            location.reload();
            window.$message.error("请先登录/注册");
            return;
          }
          try {
            await changePassword(
              sessdata,
              CheckMailCode.value.toLocaleUpperCase(),
              MD5(String(Password.value)).toString()
            );
            window.$message.success("密码修改成功");
            location.reload();
          } catch (e) {
            console.error("API ERROR", e);
            // SESSDATA过期
            if (e[2] == 403) {
              VueCookies.remove("SESSDATA");
              location.reload();
            }
            spinAddResolution.value = false;
          }
        }
      },
    };
  },
});
</script>
