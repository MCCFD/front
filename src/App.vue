<template>
  <n-config-provider :locale="zhCN" :theme="darkTheme">
    <n-dialog-provider>
      <n-loading-bar-provider>
        <n-notification-provider :max="3">
          <n-message-provider>
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
            <!-- <n-grid
              :x-gap="12"
              :cols="12"
              item-responsive
              style="padding-top: 20px"
            >
              <n-gi span="1 1480:3" />
              <n-gi span="10 1480:6">
                <n-alert type="info">
                  如有任何问题, 请通过 qiaoshouzi@hgy.ooo 联系管理员
                </n-alert>
                <div style="padding-top: 15px"><router-view /></div>
              </n-gi>
              <n-gi span="1 1480:3" />
            </n-grid> -->
            <!-- PC -->
            <n-grid :cols="36" item-responsive style="padding-top: 20px">
              <n-gi span="0 768:3 1024:6 1440:10" />
              <n-gi span="0 768:30 1024:24 1440:16">
                <n-alert type="info">
                  如有任何问题, 请通过 qiaoshouzi@hgy.ooo 联系管理员
                </n-alert>
                <div style="padding-top: 15px"><router-view userEQ="PC" /></div>
              </n-gi>
              <n-gi span="0 768:3 1024:6 1440:10" />
            </n-grid>
            <!-- Mobile -->
            <n-grid :cols="36" item-responsive style="padding-top: 20px">
              <n-gi span="1 768:0" />
              <n-gi span="34 768:0">
                <n-alert type="info">
                  如有任何问题, 请通过 qiaoshouzi@hgy.ooo 联系管理员
                </n-alert>
                <div style="padding-top: 15px">
                  <router-view userEQ="Mobile" />
                </div>
              </n-gi>
              <n-gi span="1 768:0" />
            </n-grid>
          </n-message-provider>
        </n-notification-provider>
      </n-loading-bar-provider>
    </n-dialog-provider>
    <n-global-style />
  </n-config-provider>
</template>

<script>
import { defineComponent } from "vue";
import {
  NGi,
  NH1,
  NGrid,
  NAlert,
  NButton,
  NGlobalStyle,
  NConfigProvider,
  NDialogProvider,
  NMessageProvider,
  NLoadingBarProvider,
  NNotificationProvider,
} from "naive-ui";
import { darkTheme, zhCN } from "naive-ui";

export default defineComponent({
  components: {
    NGi,
    NH1,
    NGrid,
    NAlert,
    NButton,
    NGlobalStyle,
    NConfigProvider,
    NDialogProvider,
    NMessageProvider,
    NLoadingBarProvider,
    NNotificationProvider,
  },
  setup() {
    return {
      zhCN,
      darkTheme,
    };
  },
});
</script>
