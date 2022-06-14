<template>
  <n-config-provider :locale="zhCN" :theme="darkTheme">
    <n-grid :cols="36" item-responsive>
      <n-gi span="1 768:3 1024:6 1440:10" />
      <n-gi span="34 768:30 1024:24 1440:16">
        <div style="text-align: center; padding-top: 15px">
          <n-h1>
            <a style="color: #ffffffe6; text-decoration: none" href="/">
              MC.CFD
            </a>
          </n-h1>
          <n-button
            tertiary
            tag="a"
            size="small"
            href="https://github.com/MCCFD"
            target="_blank"
            type="primary"
          >
            Github
          </n-button>
        </div>
        <div style="padding-top: 20px">
          <n-card>
            <n-result status="418" title="维护中" size="huge">
              <template #footer>
                <n-h5>现有解析可正常使用</n-h5>
                <n-p>预计维护结束时间: <n-time :time="1652569200000" /></n-p>
                <n-button @click="reload">刷新</n-button>
              </template>
            </n-result>
          </n-card>
        </div>
      </n-gi>
      <n-gi span="1 768:3 1024:6 1440:10" />
    </n-grid>
    <n-global-style />
  </n-config-provider>
</template>

<script>
import { defineComponent } from "vue";
import {
  NP,
  NGi,
  NH1,
  NH5,
  NCard,
  NGrid,
  NTime,
  NButton,
  NResult,
} from "naive-ui";
import { NGlobalStyle, NConfigProvider, darkTheme, zhCN } from "naive-ui";

export default defineComponent({
  components: {
    NP,
    NGi,
    NH1,
    NH5,
    NCard,
    NGrid,
    NTime,
    NButton,
    NResult,
    NGlobalStyle,
    NConfigProvider,
  },
  setup() {
    return {
      zhCN,
      darkTheme,
      reload(e) {
        e.preventDefault();
        location.reload();
      },
    };
  },
});
</script>
