<template>
  <n-card>
    <n-result status="404" title="404 资源不存在">
      <template #footer>
        <n-button @click="toHomeButton">返回首页</n-button>
      </template>
    </n-result>
  </n-card>
</template>

<script>
import { defineComponent } from "vue";
import { NCard, NButton, NResult } from "naive-ui";

export default defineComponent({
  components: { NCard, NButton, NResult },
  props: {
    userEQ: {
      type: String,
      default: "PC",
    },
  },
  setup() {
    return {
      toHomeButton(e) {
        e.preventDefault();
        window.location.href = "/";
      },
    };
  },
});
</script>
