import vue from "vue";
import vueRouter from "vue-router";

vue.use(vueRouter);

const routes = [
  {
    path: "/",
    name: "/index",
    component: () => import("@/pages/index.vue"),
  },
  {
    path: "/indexAnimation",
    name: "/indexAnimation",
    component: () => import("@/pages/indexAnimation.vue"),
  },
  {
    path: "/about",
    name: "/about",
    component: () => import("@/pages/about.vue"),
  },
  {
    path: "/concat",
    name: "/concat",
    component: () => import("@/pages/concat.vue"),
  },
];

const router = new vueRouter({
  mode: "history",
  routes,
});
export default router;
