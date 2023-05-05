import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/example',
    name: 'example',
    component: () => import('../views/example.vue')
  },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../views/projects.vue')
    },
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
    {
      path: '/:pathMatcher(.*)*',
      redirect: '/projects',
    },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
