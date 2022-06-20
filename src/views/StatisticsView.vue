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
import VueCookies from "vue-cookies";
import { getStatistics } from "@/API/cpAPI";
import PCView from "@/views/PC/StatisticsView.vue";
import MobileView from "@/views/Mobile/StatisticsView.vue";
import { useMessage, useNotification } from "naive-ui";

const getNowDate = () => {
  const t = new Date();
  const y = String(t.getFullYear());
  let m = String(t.getMonth() + 1);
  const d = String(t.getDate());
  if (m.length == 1) m = "0" + m;
  return Number(y + m + d);
};

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
    const NowDate = getNowDate();
    const StatisticsData = await getStatistics(sessdata, NowDate, NowDate);
    // Null
    if (StatisticsData == {}) {
      propsData.value = {
        isNull: true,
      };
      callback(true);
      return;
    }
    propsData.value = {
      isNull: false,
      tableData: [],
      InitECharts: {
        date: [],
        statistics: [],
      },
    };
    for (const i in StatisticsData.domain) {
      propsData.value.tableData.push({
        Domain: i + ".mc.cfd",
        RequestQuantity: StatisticsData.domain[i],
      });
    }
    for (const i in StatisticsData.date) {
      const dateData = StatisticsData.date[i];
      propsData.value.InitECharts.date.push(dateData[0]);
      propsData.value.InitECharts.statistics.push(dateData[1]);
    }
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

const propsData = ref({});
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
