<template>
  <n-spin :show="spinAddResolution">
    <n-form label-placement="top">
      <n-grid :cols="12" :x-gap="12">
        <n-form-item-gi :span="6" label="备注">
          <n-input
            v-model:value="AddResolution.note"
            size="small"
            placeholder="留空自动生成"
            clearable
          />
        </n-form-item-gi>
        <n-form-item-gi
          :span="6"
          :validation-status="ARDomainStatus"
          :feedback="ARDomainMessage"
          label="域名"
        >
          <n-input
            v-model:value="AddResolution.domain"
            size="small"
            placeholder="3-63 位中英文数字横杠下划线"
            clearable
          >
            <template #suffix>.mc.cfd</template>
          </n-input>
        </n-form-item-gi>
        <n-form-item-gi
          :span="6"
          :validation-status="ARServeStatus"
          :feedback="ARServeMessage"
          label="服务器域名/IP"
        >
          <n-input
            v-model:value="AddResolution.serve"
            placeholder="支持域名/IPV4/IPV6"
            size="small"
            clearable
          />
        </n-form-item-gi>
        <n-form-item-gi
          :span="6"
          :validation-status="ARServePortStatus"
          :feedback="ARServePortMessage"
          label="服务器端口"
        >
          <n-input
            v-model:value="AddResolution.servePort"
            size="small"
            placeholder="25565"
            :maxlength="5"
            clearable
          />
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <n-space justify="end">
      <n-button type="primary" @click="AddResolutionButtonClick">
        创建
      </n-button>
    </n-space>
    <template #description>处理中</template>
  </n-spin>
</template>

<script>
import { ref, computed, defineComponent } from "vue";
import router from "@/router";
import VueCookies from "vue-cookies";
import { addResolution } from "@/API/cpAPI";
import { checkPrefix, checkServe, checkServePort } from "@/assets/js/check";
import MD5 from "crypto-js/md5";
import {
  NSpin,
  NGrid,
  NForm,
  NInput,
  NSpace,
  NButton,
  NFormItemGi,
} from "naive-ui";
import { useMessage, useNotification } from "naive-ui";

const spinAddResolution = ref(false);
const AddResolution_note = ref("");
const AddResolution_domain = ref("");
const AddResolution_serve = ref("");
const AddResolution_servePort = ref("25565");
export default defineComponent({
  components: {
    NSpin,
    NGrid,
    NForm,
    NInput,
    NSpace,
    NButton,
    NFormItemGi,
  },
  setup() {
    window.$message = useMessage();
    window.$notification = useNotification();
    return {
      spinAddResolution,
      AddResolution: ref({
        note: AddResolution_note,
        domain: AddResolution_domain,
        serve: AddResolution_serve,
        servePort: AddResolution_servePort,
      }),
      ARDomainStatus: computed(() => {
        return checkPrefix.inputValidationStatus(
          AddResolution_domain.value.toLocaleLowerCase()
        );
      }),
      ARDomainMessage: computed(() => {
        return checkPrefix.inputFeedback(
          AddResolution_domain.value.toLocaleLowerCase()
        );
      }),
      ARServeStatus: computed(() => {
        return checkServe.inputValidationStatus(
          AddResolution_serve.value.toLocaleLowerCase()
        );
      }),
      ARServeMessage: computed(() => {
        return checkServe.inputFeedback(
          AddResolution_serve.value.toLocaleLowerCase()
        );
      }),
      ARServePortStatus: computed(() => {
        return checkServePort.inputValidationStatus(
          AddResolution_servePort.value
        );
      }),
      ARServePortMessage: computed(() => {
        return checkServePort.inputFeedback(AddResolution_servePort.value);
      }),
      async AddResolutionButtonClick(e) {
        e.preventDefault();
        const cDomain = checkPrefix.check(
          AddResolution_domain.value.toLocaleLowerCase()
        );
        const cServe = checkServe.check(
          AddResolution_serve.value.toLocaleLowerCase()
        );
        const cServePort = checkServePort.check(AddResolution_servePort.value);
        if (cDomain != true) {
          if (cDomain == "null") {
            window.$message.error("请输入域名");
          } else {
            window.$message.error(
              AddResolution_domain.value.toLocaleLowerCase()
            );
          }
          return;
        } else if (cServe == "illegal") {
          window.$message.error("请输入服务器的域名/IPV4/IPV6");
          return;
        } else if (cServe == "null") {
          window.$message.error("请输入服务器域名/IP");
          return;
        } else if (cServePort != true) {
          window.$message.error(
            checkServePort.inputFeedback(AddResolution_servePort.value)
          );
          return;
        }
        // 随机生成note
        if (AddResolution_note.value == "") {
          const tmp = MD5(
            String(Date.parse(new Date())) + String(Math.random() * 10000)
          ).toString();
          const ran = Math.ceil(Math.random() * (tmp.length - 9));
          AddResolution_note.value = tmp
            .substring(ran, ran + 8)
            .toLocaleUpperCase();
        }
        // 请求API
        const sessdata = VueCookies.get("SESSDATA");
        if (sessdata == null) {
          VueCookies.remove("SESSDATA");
          window.$message.error("请先登录/注册");
          router.push("/");
          return;
        }
        try {
          await addResolution(
            sessdata,
            AddResolution_note.value,
            AddResolution_domain.value.toLocaleLowerCase(),
            AddResolution_serve.value.toLocaleLowerCase(),
            AddResolution_servePort.value
          );
          window.$message.success("添加成功");
          location.reload();
        } catch (e) {
          console.error("API ERROR", e);
          // SESSDATA过期
          if (e[2] == 403) {
            VueCookies.remove("SESSDATA");
            location.reload();
          }
        }
      },
    };
  },
});
</script>
