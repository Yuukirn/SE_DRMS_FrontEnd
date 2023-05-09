import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/home.vue')
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
      path: '/project/:projectId',
      name: 'project',
      children:[
				{
					path:"example/:exampleId",
          name:"example",
					component:() => import('../views/example.vue')
				}],
      component: () => import('../views/project.vue')
    },
    {
      path: '/:pathMatcher(.*)*',
      redirect: '/home',
    },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
