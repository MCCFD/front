<template>
  <PCView v-if="userEQ == 'PC'" />
  <MobileView v-if="userEQ == 'Mobile'" />
</template>

<script>
import { defineComponent } from "vue";
import PCView from "@/views/PC/IndexView.vue";
import MobileView from "@/views/Mobile/IndexView.vue";

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
