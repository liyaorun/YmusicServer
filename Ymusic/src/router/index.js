import { createRouter, createWebHistory } from "vue-router";

const routes = [
    { path: '/', redirect: '/home' },
    {
        path: '/home',
        component: () => import("@/views/home.vue")
    },
    {
        path: '/search',
        component: () => import("@/views/search.vue")
    },
    {
        path: '/setting',
        component: () => import("@/views/setting.vue")
    }, {
        path: '/songSheet',
        component: () => import("@/views/songSheet.vue")
    },
    {
        path: '/message',
        component: () => import("@/views/message.vue")
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router
