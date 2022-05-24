<template>
  <n-card>
    <n-tabs default-value="login" size="large" justify-content="space-evenly">
      <n-tab-pane name="login" tab="登录">
        <Login />
      </n-tab-pane>
      <n-tab-pane name="register" tab="注册">
        <Register />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script>
import { defineComponent } from "vue";
import Login from "@/components/Index/IndexLogin.vue";
import Register from "@/components/Index/IndexRegister.vue";
import VueCookies from "vue-cookies";
import router from "@/router";
import { NCard, NTabs, NTabPane } from "naive-ui";

const Init = () => {
  if (VueCookies.get("SESSDATA") != null) {
    router.push("/cp");
  }
};

export default defineComponent({
  components: {
    // Components
    Login,
    Register,
    // NaiveUI
    NCard,
    NTabs,
    NTabPane,
  },
  setup() {
    Init();
    return {};
  },
});
</script>
