import { createRouter, createWebHistory } from 'vue-router'
import { getVisitorId } from '../utils/fingerP'

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
      beforeEnter: async (to, from, next) => { // перехватываем все обращения к маргруту
        try {
          const token = localStorage.getItem('jwt') // берём токен из локального хранилища
          if (!token) {
            return next('/') // если токена нет, отправляем на главную
          }

          const fingerprint = await getVisitorId() // генерируем отпечаток браузера
          const response = await fetch('/auth/login', {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'X-Fingerprint': fingerprint
            }
          })

          const data = await response.json()
          if (data.message === "invalid") {
            localStorage.removeItem('jwt') // Удаляем невалидный токен
            return next('/') // Отправляем на главную
          }

          to.params.user = data.user
          to.params.role = data.role
          to.params.code = data.code

          localStorage.setItem('jwt', data.tokenNew) // Обновляем токен
          next() // Разрешаем переход
        }
        catch(e) {
          next('/')
        }
      }
    },
    {
      path: '/radio',
      name: 'radio',
      component: () => import('../views/radio.vue'),
    },
  ],
})

export default router
