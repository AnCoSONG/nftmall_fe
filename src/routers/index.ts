import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "home",
            component: () => import("views/home/index.vue"),
            meta: { title: "晋元数藏" },
            children: [
                {
                    path: "",
                    component: () => import("views/home/components/mall.vue"),
                },
                {
                    path: "exhibition",
                    component: () => import("views/home/components/exhibition.vue"),
                },
                {
                    path: "user",
                    component: () => import("views/home/components/user.vue"),
                }
            ],
        },
    ],
    scrollBehavior: (to, from, savedPosition) => {
        return { left: 0, top: 0, behavior: "smooth" };
    },
});

import NProgress from "nprogress";
import "../styles/nprogress.scss";

NProgress.configure({ easing: "ease", speed: 500, showSpinner: false });

const defaultTitle = "晋元数藏";
router.beforeEach((to, from, next) => {
    // console.log(to, from)
    NProgress.start();
    document.title = to.meta.title ? (to.meta.title as string) : defaultTitle;
    next();
});

router.afterEach((to, from) => {
    // console.log(to, from)
    NProgress.done();
});

export default router;
