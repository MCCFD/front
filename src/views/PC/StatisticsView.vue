<template>
  <n-card title="域名请求量统计">
    <n-date-picker
      type="daterange"
      v-model:value="datePickerRange"
      :is-date-disabled="dateDisableData"
      :shortcuts="dateRangeShortcuts"
      :update-value-on-close="true"
      @update:value="updateData"
      @clear="clearData"
      clearable
    >
      <template #footer>仅可查询最近15天的记录</template>
    </n-date-picker>
    <!-- <pre>{{ JSON.stringify(datePickerRange) }}</pre> -->
    <n-data-table
      style="padding-top: 15px"
      :columns="tableColumnsData"
      :data="tableData"
    />
    <div id="echarts-main" style="width: 100%; height: 450px"></div>
  </n-card>
</template>

<script>
import { ref, onMounted, defineComponent } from "vue";
import { startOfDay } from "date-fns/esm";
import VueCookies from "vue-cookies";
import router from "@/router";
import { getStatistics } from "@/API/cpAPI";
import { NCard, NDataTable, NDatePicker } from "naive-ui";

// ECharts
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import "@/assets/js/echarts/naiveuiTheme.js";

let InitECharts_data = {
  date: [],
  statistics: [],
};
const InitECharts = () => {
  if (InitECharts_data == {}) return;
  echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);
  var myChart = echarts.init(
    document.getElementById("echarts-main"),
    "naiveui"
  );
  const option = {
    aria: {
      enabled: true,
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: InitECharts_data.date, // ['2022-01-01', '2022-01-02']
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        type: "line",
        name: "请求量(次)",
        data: InitECharts_data.statistics, // [100, 200]
      },
    ],
  };

  option && myChart.setOption(option);

  window.onresize = function () {
    myChart.resize();
  };
};

const tableColumnsData = () => {
  return [
    {
      title: "域名",
      key: "Domain",
    },
    {
      title: "请求量 (次)",
      key: "RequestQuantity",
      sorter: (row1, row2) => row1.RequestQuantity - row2.RequestQuantity,
    },
  ];
};
const tableData = ref([]);
// const tableData = [
//   { Domain: "t1", RequestQuantity: 100 },
//   { Domain: "t2", RequestQuantity: 200 },
//   { Domain: "t3", RequestQuantity: 300 },
// ];

// {
//   isNull: false,
//   tableData: [],
//   InitECharts: {
//     date: [],
//     statistics: []
//   }
// }
const Init = (props) => {
  if (props.error == true && props == "") return;

  if (props.isNull == true) {
    tableData.value = [];
    InitECharts_data = {};
    return;
  }

  tableData.value = props.tableData;
  InitECharts_data.date = props.InitECharts.date;
  InitECharts_data.statistics = props.InitECharts.statistics;
};

const updateData = async (v) => {
  // 是否有SESSDATA
  const sessdata = VueCookies.get("SESSDATA");
  if (sessdata == null) {
    VueCookies.remove("SESSDATA");
    window.$message.error("请先登录/注册");
    router.push("/");
    return;
  }
  const TimezoneOffset = new Date().getTimezoneOffset() * 60000;
  try {
    const StatisticsData = await getStatistics(
      sessdata,
      v[0] + TimezoneOffset + 28800000,
      v[1] + TimezoneOffset + 28800000
    );
    // Null
    if (StatisticsData == {}) {
      InitECharts_data = {};
      InitECharts();
      tableData.value = [];
      return;
    }
    let tableData_data = [];
    for (const i in StatisticsData.domain) {
      tableData_data.push({
        Domain: i + ".mc.cfd",
        RequestQuantity: StatisticsData.domain[i],
      });
    }
    tableData.value = tableData_data;
    InitECharts_data = {
      date: [],
      statistics: [],
    };
    for (const i in StatisticsData.date) {
      const dateData = StatisticsData.date[i];
      InitECharts_data.date.push(dateData[0]);
      InitECharts_data.statistics.push(dateData[1]);
    }
    InitECharts();
  } catch (e) {
    console.error("API ERROR", e);
    // SESSDATA过期
    if (e[2] == 403) {
      VueCookies.remove("SESSDATA");
      location.reload();
    }
  }
};

const datePickerRange = ref([Date.now(), Date.now()]);
export default defineComponent({
  components: {
    NCard,
    NDataTable,
    NDatePicker,
  },
  props: {
    propsData: Object,
  },
  setup(props) {
    onMounted(() => {
      InitECharts();
    });
    Init(props.propsData);
    return {
      tableData,
      tableColumnsData: tableColumnsData(),
      datePickerRange,
      dateDisableData(ts, type, range) {
        if (type === "start" && range !== null) {
          // 15天内
          return (
            startOfDay(new Date().getTime()).valueOf() -
              startOfDay(ts).valueOf() >=
            86400000 * 15
          );
        }
        // if (type === "end" && range !== null) {
        //   return (
        //     startOfDay(ts).valueOf() - startOfDay(range[0]).valueOf() <= d * 6
        //   );
        // }
        return ts > Date.now();
      },
      dateRangeShortcuts: {
        今天: () => {
          const cur = new Date().getTime();
          return [cur, cur];
        },
        昨天: () => {
          const cur = new Date().getTime() - 86400000;
          return [cur, cur];
        },
        "7天": () => {
          const cur = new Date().getTime();
          return [cur - 86400000 * 6, cur];
        },
        "15天": () => {
          const cur = new Date().getTime();
          return [cur - 86400000 * 14, cur];
        },
      },
      clearData() {
        InitECharts_data = {};
        InitECharts();
        tableData.value = [];
      },
      updateData,
    };
  },
});
</script>
