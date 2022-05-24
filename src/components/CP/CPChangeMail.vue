<template>
  <n-spin :show="spinAddResolution">
    <n-form label-placement="left" label-width="auto">
      <n-form-item label="旧邮箱验证码">
        <n-input-group>
          <n-input
            v-model:value="changeMail.CheckOldMailCode"
            :disabled="getCheckOldMailCodeType == 'Null'"
            :input-props="{ autocomplete: false }"
            @input="CheckOldMailCodeInput"
            clearable
          />
          <n-button
            :style="{ width: '33%' }"
            v-if="
              getCheckOldMailCodeType == 'OK' ||
              getCheckOldMailCodeType == 'Null'
            "
            type="primary"
            ghost
            @click="getCheckOldMailCode"
          >
            获取验证码
          </n-button>
          <n-button
            :style="{ width: '47%' }"
            v-if="getCheckOldMailCodeType == 'wait'"
            type="primary"
            disabled
            ghost
          >
            <n-countdown
              :render="renderCountdown"
              :duration="60 * 1000"
              :active="getCheckOldMailCodeType == 'wait'"
              :on-finish="getCheckOldMailCodeWaitFinish"
            />
            秒后重新获取
          </n-button>
        </n-input-group>
      </n-form-item>
      <n-form-item
        v-show="showNew"
        :validation-status="MailStatus"
        :feedback="MailMessage"
        label="新的邮箱"
      >
        <n-input
          v-model:value="changeMail.NewMail"
          :input-props="{ autocomplete: true }"
          clearable
        />
      </n-form-item>
      <n-form-item label="新邮箱验证码" v-show="showNew">
        <n-input-group>
          <n-input
            v-model:value="changeMail.CheckNewMailCode"
            :disabled="getCheckNewMailCodeType == 'Null'"
            :input-props="{ autocomplete: false }"
            clearable
          />
          <n-button
            :style="{ width: '33%' }"
            v-if="
              getCheckNewMailCodeType == 'OK' ||
              getCheckNewMailCodeType == 'Null'
            "
            type="primary"
            ghost
            @click="getCheckNewMailCode"
          >
            获取验证码
          </n-button>
          <n-button
            :style="{ width: '47%' }"
            v-if="getCheckNewMailCodeType == 'wait'"
            type="primary"
            disabled
            ghost
          >
            <n-countdown
              :render="renderCountdown"
              :duration="60 * 1000"
              :active="getCheckNewMailCodeType == 'wait'"
              :on-finish="getCheckNewMailCodeWaitFinish"
            />
            秒后重新获取
          </n-button>
        </n-input-group>
      </n-form-item>
    </n-form>
    <n-space justify="end">
      <n-button v-show="showNew" type="primary" @click="ChangeMailButtonClick">
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
// import VueCookies from "vue-cookies";
import { checkMail } from "@/assets/js/check";
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
import { useMessage } from "naive-ui";

const spinAddResolution = ref(false);
const showNew = ref(false);
const getCheckOldMailCodeType = ref("Null");
const getCheckNewMailCodeType = ref("Null");
const CheckOldMailCode = ref("");
const NewMail = ref("");
const CheckNewMailCode = ref("");
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
    const renderCountdown = ({ seconds }) => {
      return `${String(seconds).padStart(2, "0")}`;
    };
    return {
      spinAddResolution,
      showNew,
      renderCountdown,
      getCheckOldMailCodeType,
      getCheckNewMailCodeType,
      changeMail: ref({
        CheckOldMailCode,
        NewMail,
        CheckNewMailCode,
      }),
      getCheckOldMailCodeWaitFinish() {
        getCheckOldMailCodeType.value = "OK";
      },
      getCheckNewMailCodeWaitFinish() {
        getCheckNewMailCodeType.value = "OK";
      },
      getCheckOldMailCode(e) {
        e.preventDefault();
        getCheckOldMailCodeType.value = "wait";
        // 请求API
      },
      getCheckNewMailCode(e) {
        e.preventDefault();
        getCheckNewMailCodeType.value = "wait";
        // 请求API
      },
      MailStatus: computed(() => {
        return checkMail.inputValidationStatus(
          NewMail.value.toLocaleLowerCase()
        );
      }),
      MailMessage: computed(() => {
        return checkMail.inputFeedback(NewMail.value.toLocaleLowerCase());
      }),
      CheckOldMailCodeInput(e) {
        showNew.value = String(e).length == 8;
      },
      ChangeMailButtonClick(e) {
        e.preventDefault();
        var cMail = checkMail.check(NewMail.value.toLocaleLowerCase());
        if (
          String(CheckOldMailCode.value).length != 8 ||
          String(CheckNewMailCode.value).length != 8
        ) {
          window.$message.error("请输入验证码");
        } else if (cMail != true) {
          if (cMail == "null") {
            window.$message.error("请输入邮箱");
          } else {
            window.$message.error(
              checkMail.inputFeedback(NewMail.value.toLocaleLowerCase())
            );
          }
        } else {
          spinAddResolution.value = true;
          // TODO 请求API
        }
      },
    };
  },
});
</script>
