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
                    meta: { title: "个人展馆", requireAuth: "prompt" },
                    component: () =>
                        import("views/home/components/exhibition.vue"),
                },
                {
                    path: "user",
                    meta: { title: "个人中心" },
                    component: () => import("views/home/components/user.vue"),
                },
            ],
        },
        {
            path: "/login",
            name: "login",
            component: () => import("views/login/index.vue"),
            props: (route) => ({ backTo: route.params.backTo })
        },
        {
            path: "/order", // 订单
            name: "order",
            meta: { title: "订单", requireAuth: "required" },
            component: () => import("views/order/index.vue"),
        },
        {
            path: "/order/:id",
            name: "order-detail",
            meta: { title: "订单详情", requireAuth: "required" },
            component: () => import("views/order/detail.vue"),
            props: true,
        },
        {
            path: "/collection",
            name: "collection",
            meta: { title: "收藏", requireAuth: "required" },
            component: () => import("views/collection/index.vue"),
        },
        {
            path: "/collection/:id",
            name: "collection-detail",
            meta: { title: "收藏详情", requireAuth: "required" },
            component: () => import("views/collection/detail.vue"),
            props: true,
        },
        {
            // ID为藏品类别ID
            path: "/product/:id",
            name: "product-detail",
            meta: { title: "藏品详情", requireAuth: "prompt" },
            component: () => import("views/product/index.vue"),
            props: (route) => ({ id: route.params.id }),
        },
        {
            path: "/setting",
            name: "setting",
            meta: { title: "设置" },
            component: () => import("views/setting/index.vue"),
        },
        {
            // ID为订单ID
            path: "/cashier",
            name: "cashier",
            meta: { title: "收银台", requireAuth: "required" },
            component: () => import("views/cashier/index.vue"),
            props: (route) => ({ order_id: route.query.order_id, product_id: route.query.product_id }),
        },
        {
            path: "/payment_waiting",
            name: "payment_waiting",
            meta: { title: "等待支付回调", requireAuth: "required" },
            component: () => import("views/cashier/payment_waiting.vue"),
        },
        {
            path: "/account",
            name: "account",
            meta: { title: "账户", requireAuth: "required" },
            component: () => import("views/account/index.vue"),
        },
        {
            path: "/verification",
            name: "verification",
            meta: { title: "身份验证", requireAuth: "required" },
            component: () => import("views/verification/index.vue"),
        },
        {
            path: "/doc/:type",
            name: "doc",
            meta: { title: "文档" },
            component: () => import("views/doc/index.vue"),
            props: true,
        },
        {
            path: "/test",
            name: "test",
            component: () => import("comps/Subpage.vue"),
        },
        {
            // path: '/:\w+',
            path: '/:pathMatch(.*)*',
            name: '404',
            component: () => import('views/404/index.vue'),
            meta: { title: '404' }
        }
    ],
    scrollBehavior: (to, from, savedPosition) => {
        // fix some case cannot scroll
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
import { Notify, Toast } from "vant";

NProgress.configure({ easing: "ease", speed: 500, showSpinner: false });

const defaultTitle = "晋元数藏";
router.beforeEach((to, from, next) => {
    // console.log(to, from)
    NProgress.start();
    document.title = to.meta.title ? (to.meta.title as string) : defaultTitle;
    // console.log(to.matched);
    if (to.matched.some((route) => route.meta.requireAuth === "required")) {
        if (!sessionStorage.getItem("id")) {
            Notify({
                message: '请先登录',
                type: 'danger',
                duration: 2000
            })
            next("/login");
        } else {
            next();
        }
    } else if (
        to.matched.some((route) => route.meta.requireAuth === "prompt")
    ) {
        if (!sessionStorage.getItem("id")) {
            Toast({
                message: "建议您登录后浏览，以获得更好的体验",
                duration: 2000,
                forbidClick: true,
                icon: 'warning-o',
                iconSize: '1.6rem',
            })
            // Notify({
            //     message: "请先登录",
            // });
            next();
        } else {
            next();
        }
    } else {
        next();
    }
});

router.afterEach((to, from) => {
    // console.log(to, from)
    NProgress.done();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
});

export default router;
