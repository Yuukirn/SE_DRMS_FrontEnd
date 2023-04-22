import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/register.vue')
    },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
