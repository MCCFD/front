<template>
  <n-form label-placement="top">
    <n-grid :cols="12" :x-gap="12">
      <n-form-item-gi :span="6" label="备注">
        <n-input
          v-model:value="formValue.note"
          size="small"
          placeholder="留空自动生成"
          clearable
        />
      </n-form-item-gi>
      <n-form-item-gi
        :span="6"
        label="域名"
        :validation-status="domainStatus"
        :feedback="domainMessage"
      >
        <n-input
          v-model:value="formValue.domain"
          size="small"
          placeholder="3-63 位中英文数字横杠下划线"
          clearable
        >
          <template #suffix>.mc.cfd</template>
        </n-input>
      </n-form-item-gi>
      <n-form-item-gi
        :span="6"
        label="服务器域名/IP"
        :validation-status="serveStatus"
        :feedback="serveMessage"
      >
        <n-input
          v-model:value="formValue.serve"
          size="small"
          placeholder="支持域名/IPV4/IPV6"
          clearable
        />
      </n-form-item-gi>
      <n-form-item-gi
        :span="6"
        label="服务器端口"
        :validation-status="servePortStatus"
        :feedback="servePortMessage"
      >
        <n-input
          v-model:value="formValue.servePort"
          size="small"
          placeholder="25565"
          :maxlength="5"
          clearable
        />
      </n-form-item-gi>
    </n-grid>
  </n-form>
  <n-grid :x-gap="12" :cols="12">
    <n-gi :span="6">
      <n-space>
        <n-button @click="delResolutionButtonClick">删除</n-button>
      </n-space>
    </n-gi>
    <n-gi :span="6">
      <n-space justify="end">
        <n-button type="primary" @click="updateResolutionButtonClick">
          保存
        </n-button>
      </n-space>
    </n-gi>
  </n-grid>
</template>

<script>
import { ref, computed, defineComponent } from "vue";
import router from "@/router";
import MD5 from "crypto-js/md5";
import VueCookies from "vue-cookies";
import { updateResolution, delResolution } from "@/API/cpAPI";
import { checkPrefix, checkServe, checkServePort } from "@/assets/js/check";
import {
  NGi,
  NGrid,
  NForm,
  NSpace,
  NInput,
  NButton,
  NFormItemGi,
} from "naive-ui";
import { useDialog, useMessage, useNotification } from "naive-ui";

const init = (props) => {
  id.value = props.id;
  note.value = props.note;
  domain.value = props.domain.replace(".mc.cfd", "");
  serve.value = props.serve;
  servePort.value = String(props.servePort);
  defNote = props.note;
  defDomain = props.domain.replace(".mc.cfd", "");
  defServe = props.serve;
  defServePort = String(props.servePort);
};

const id = ref("");
const note = ref("");
const domain = ref("");
const serve = ref("");
const servePort = ref("25565");
var defNote = "";
var defDomain = "";
var defServe = "";
var defServePort = "25565";
export default defineComponent({
  components: {
    NGi,
    NGrid,
    NForm,
    NSpace,
    NInput,
    NButton,
    NFormItemGi,
  },
  props: {
    data: Object,
  },
  setup(props) {
    window.$dialog = useDialog();
    window.$message = useMessage();
    window.$notification = useNotification();
    init(props.data);
    return {
      formValue: ref({
        note,
        domain,
        serve,
        servePort,
      }),
      domainStatus: computed(() => {
        return checkPrefix.inputValidationStatus(
          domain.value.toLocaleLowerCase()
        );
      }),
      domainMessage: computed(() => {
        return checkPrefix.inputFeedback(domain.value.toLocaleLowerCase());
      }),
      serveStatus: computed(() => {
        return checkServe.inputValidationStatus(
          serve.value.toLocaleLowerCase()
        );
      }),
      serveMessage: computed(() => {
        return checkServe.inputFeedback(serve.value.toLocaleLowerCase());
      }),
      servePortStatus: computed(() => {
        return checkServePort.inputValidationStatus(servePort.value);
      }),
      servePortMessage: computed(() => {
        return checkServePort.inputFeedback(servePort.value);
      }),
      updateResolutionButtonClick: async (e) => {
        e.preventDefault();
        const sessdata = VueCookies.get("SESSDATA");
        if (sessdata == null) {
          VueCookies.remove("SESSDATA");
          window.$message.error("请先登录/注册");
          location.reload();
          return;
        }
        if (
          note.value == defNote &&
          domain.value == defDomain &&
          serve.value == defServe &&
          servePort.value == defServePort
        ) {
          window.$message.error("没有任何修改");
          return;
        }
        const cDomain = checkPrefix.check(domain.value.toLocaleLowerCase());
        const cServe = checkServe.check(serve.value.toLocaleLowerCase());
        const cServePort = checkServePort.check(servePort.value);
        if (cDomain != true) {
          if (cDomain == "null") {
            window.$message.error("请输入域名");
          } else {
            window.$message.error(
              checkPrefix.inputFeedback(domain.value.toLocaleLowerCase())
            );
          }
          return;
        } else if (cServe == "null") {
          window.$message.error("请输入服务器域名/IP");
          return;
        } else if (cServe == "illegal") {
          window.$message.error(
            checkServe.inputFeedback(serve.value.toLocaleLowerCase())
          );
          return;
        } else if (cServePort != true) {
          window.$message.error(checkServePort.inputFeedback(servePort.value));
          return;
        }
        // 随机生成note
        if (note.value == "") {
          const tmp = MD5(
            String(Date.parse(new Date())) +
              String(id.value) +
              String(Math.random() * 1000)
          ).toString();
          const ran = Math.ceil(Math.random() * (tmp.length - 9));
          note.value = tmp.substring(ran, ran + 8).toLocaleUpperCase();
        }
        // 请求API
        try {
          await updateResolution(
            sessdata,
            id.value,
            note.value,
            domain.value.toLocaleLowerCase(),
            serve.value.toLocaleLowerCase(),
            servePort.value
          );
          window.$message.success("保存成功");
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
      delResolutionButtonClick: (e) => {
        e.preventDefault();
        window.$dialog.warning({
          title: "操作确认",
          content: "确定删除 " + domain.value + ".mc.cfd 吗？",
          positiveText: "确定删除",
          negativeText: "取消",
          onPositiveClick: async () => {
            const sessdata = VueCookies.get("SESSDATA");
            if (sessdata == null) {
              VueCookies.remove("SESSDATA");
              window.$message.error("请先登录/注册");
              router.push("/");
              return;
            }
            try {
              await delResolution(sessdata, id.value);
              window.$message.success("删除成功");
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
          onNegativeClick: () => {},
        });
      },
    };
  },
});
</script>
