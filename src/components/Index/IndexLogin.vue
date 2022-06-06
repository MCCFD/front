<template>
  <PCView v-if="userEQ == 'PC'" />
  <MobileView v-if="userEQ == 'Mobile'" />
</template>

<script>
import { defineComponent } from "vue";
import PCView from "@/components/Index/PC/IndexLogin.vue";
import MobileView from "@/components/Index/Mobile/IndexLogin.vue";

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
});
</script>
