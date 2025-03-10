import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home.vue')
    },
    {
      path: '/m3000',
      name: 'm3000',
      component: () => import('../views/m3000.vue'),
      // beforeEnter: async (to, from, next) => {
      // }
    },
    {
      path: '/radio',
      name: 'radio',
      component: () => import('../views/radio.vue'),
    },
  ],
})

export default router
