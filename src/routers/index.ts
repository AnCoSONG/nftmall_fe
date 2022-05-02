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
                    component: () =>
                        import("views/home/components/exhibition.vue"),
                },
                {
                    path: "user",
                    component: () => import("views/home/components/user.vue"),
                },
            ],
        },
        {
            path: "/login",
            name: "login",
            component: () => import("views/login/index.vue"),
        },
        {
            path: "/order", // 订单
            name: "order",
            component: () => import("views/order/index.vue"),
        },
        {
            path: "/order/:id",
            name: "order-detail",
            component: () => import("views/order/detail.vue"),
        },
        {
            path: "/collection",
            name: "collection",
            component: () => import("views/collection/index.vue"),
        },
        {
            path: "/collection/:id",
            name: "collection-detail",
            component: () => import("views/collection/detail.vue"),
        },
        {
            // ID为藏品类别ID
            path: "/product/:id",
            name: "product-detail",
            component: () => import("views/product/index.vue"),
        },
        {
            path: "/setting",
            name: "setting",
            component: () => import("views/setting/index.vue"),
        },
        {
            // ID为订单ID
            path: "/cashier/:id",
            name: "cashier",
            component: () => import("views/cashier/index.vue"),
        },
        {
            path: "/payment_waiting",
            name: "payment_waiting",
            component: () => import("views/cashier/payment_waiting.vue"),
        },
        {
            path: "/account",
            name: "account",
            component: () => import("views/account/index.vue")
        },
        {
            path: '/verification',
            name: "verification",
            component: () => import("views/verification/index.vue")
        },
        {
            path: "/test",
            name: "test",
            component: () => import("comps/Subpage.vue"),
        },
    ],
    scrollBehavior: (to, from, savedPosition) => {
        document
            .querySelector("#app")!
            .scrollTo({ left: 0, top: 0, behavior: "smooth" });
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ left: 0, top: 0, behavior: "smooth" });
            }, 100);
        });
    },
});

import NProgress from "nprogress";
import "../styles/nprogress.scss";
import { defineAsyncComponent } from "vue";

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
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
});

export default router;
