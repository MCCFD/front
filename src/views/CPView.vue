<template>
  <div v-if="showUI">
    <PCView v-if="userEQ == 'PC'" :propsData="propsData" />
    <MobileView v-if="userEQ == 'Mobile'" :propsData="propsData" />
  </div>
  <n-card v-if="showError">
    <n-result status="500" :title="errorTitle" :description="errorDescription">
      <template #footer>
        <n-button @click="reload">刷新</n-button>
      </template>
    </n-result>
  </n-card>
  <n-card v-if="showLoad">
    <n-result title="加载中" description="请勿反复刷新" size="huge">
      <template #icon><n-spin size="large" /></template>
    </n-result>
  </n-card>
</template>

<script>
import { ref, defineComponent } from "vue";
import router from "@/router";
import MD5 from "crypto-js/md5";
import VueCookies from "vue-cookies";
import { getUserInfo } from "@/API/cpAPI";
import PCView from "@/views/PC/CPView.vue";
import MobileView from "@/views/Mobile/CPView.vue";
import { useMessage, useNotification } from "naive-ui";

const Init = async (callback) => {
  // 是否有SESSDATA
  const sessdata = VueCookies.get("SESSDATA");
  if (sessdata == null) {
    VueCookies.remove("SESSDATA");
    window.$message.error("请先登录/注册");
    router.push("/");
    return;
  }
  try {
    const userInfo = await getUserInfo(sessdata);
    var createData = [];
    for (var i in userInfo.resolution.data) {
      const tmp = userInfo.resolution.data[i];
      createData.push({
        key: i,
        id: tmp.RID,
        note: tmp.note,
        domain: tmp.domain_prefix + ".mc.cfd",
        serve: tmp.serve,
        servePort: tmp.serve_port,
      });
    }
    propsData.value = {
      uid: userInfo.user.UID,
      parsing: [
        userInfo.resolution.data.length,
        Number(userInfo.resolution.max),
      ],
      mail: userInfo.user.mail,
      userName: userInfo.user.name,
      userHead:
        "https://gravatar.loli.net/avatar/" +
        MD5(userInfo.user.mail).toString(),
      createData: createData,
    };
    callback(true);
  } catch (e) {
    console.error("API ERROR", e);
    propsData.value = { error: true };
    // SESSDATA过期
    if (e[2] == 403) {
      VueCookies.remove("SESSDATA");
      location.reload();
    }
    callback(e);
  }
};

const propsData = ref([]);
const showError = ref(false);
const showLoad = ref(true);
const showUI = ref(false);
const errorTitle = ref("");
const errorDescription = ref("");
export default defineComponent({
  components: {
    PCView,
    MobileView,
  },
  props: {
    userEQ: {
      type: String,
      default: "PC",
    },
  },
  setup() {
    window.$message = useMessage();
    window.$notification = useNotification();
    Init((data) => {
      showLoad.value = false;
      if (data == true) {
        showUI.value = true;
      } else {
        showError.value = true;
        errorTitle.value = data[0];
        errorDescription.value = data[1];
      }
    });
    return {
      propsData,
      showError,
      showLoad,
      showUI,
      errorTitle,
      errorDescription,
      reload(e) {
        e.preventDefault();
        location.reload();
      },
    };
  },
});
</script>
