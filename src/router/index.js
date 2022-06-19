import { createRouter, createWebHistory } from "vue-router";
import IndexView from "@/views/IndexView.vue";
import CPView from "@/views/CPView.vue";
import FindView from "@/views/FindView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import StatisticsView from "@/views/StatisticsView.vue";

const routes = [
  {
    path: "/",
    name: "Index",
    component: IndexView,
  },
  {
    path: "/find",
    name: "Find",
    component: FindView,
  },
  {
    path: "/cp",
    name: "CP",
    component: CPView,
  },
  {
    path: "/cp/statistics",
    name: "Statistics",
    component: StatisticsView,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
