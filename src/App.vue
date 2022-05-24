<template>
  <n-config-provider :locale="zhCN" :theme="darkTheme">
    <n-dialog-provider>
      <n-loading-bar-provider>
        <n-notification-provider :max="3">
          <n-message-provider>
            <div style="text-align: center; padding-top: 15px">
              <n-h1><a class="mccfd" href="/">MC.CFD</a></n-h1>
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
            <n-grid
              :x-gap="12"
              :cols="12"
              item-responsive
              style="padding-top: 20px"
            >
              <n-gi span="1 1330:3"></n-gi>
              <n-gi span="10 1330:6">
                <n-alert type="info">
                  如有任何问题, 请通过 qiaoshouzi@hgy.ooo 联系管理员
                </n-alert>
                <div style="padding-top: 15px"><router-view /></div>
              </n-gi>
              <n-gi span="1 1330:3"></n-gi>
            </n-grid>
          </n-message-provider>
        </n-notification-provider>
      </n-loading-bar-provider>
    </n-dialog-provider>
    <n-global-style />
  </n-config-provider>
</template>

<script>
import { defineComponent, ref } from "vue"; //computed
import {
  NNotificationProvider,
  NLoadingBarProvider,
  NMessageProvider,
  NDialogProvider,
  NConfigProvider,
  NGlobalStyle,
  NButton,
  NAlert,
  NGrid,
  NGi,
  NH1,
} from "naive-ui";
import { darkTheme, zhCN } from "naive-ui"; //useOsTheme
import router from "@/router";

// const osThemeRef = useOsTheme();
const mailLoginShow = ref(true);
export default defineComponent({
  components: {
    NNotificationProvider,
    NLoadingBarProvider,
    NMessageProvider,
    NDialogProvider,
    NConfigProvider,
    NGlobalStyle,
    NButton,
    NAlert,
    NGrid,
    NGi,
    NH1,
  },
  setup() {
    return {
      zhCN,
      darkTheme,
      mailLoginShow,
      // osTheme: osThemeRef,
      // theme: computed(() => (osThemeRef.value === "dark" ? darkTheme : null)),
      LoginMailButtonClick(e) {
        e.preventDefault();
        router.push("/loginMail");
      },
    };
  },
});
</script>

<style>
.mccfd {
  color: #ffffffe6;
  text-decoration: none;
}
</style>
