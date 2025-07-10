import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home.vue'),
    },
    {
      path: '/m3000',
      name: 'm3000',
      component: () => import('../views/m3000.vue'),
    },
    {
      path: '/radio',
      name: 'radio',
      component: () => import('../views/radio.vue'),
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('../views/info.vue'),
    }
  ],
})


export default router
