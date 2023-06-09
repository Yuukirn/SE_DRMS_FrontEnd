import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/home.vue')   //主页面路由
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue')  //登录界面路由
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/register.vue')  //注册界面路由
    },
    {
      path: '/project/:projectId',                      //项目界面路由
      name: 'project',
      children:[
        {         
          path: 'subproject/:subprojectId',              //项目子组件1
          name: 'subproject',
          component: () => import('../views/subproject.vue')
        }, 
        {               
          path: 'plan/:planId',                          //项目子组件2
          name: 'plan',
          component: () => import('../views/plan.vue')
        }, 
        {                                               
          path:"document/:documentId",                    //项目子组件3
          name:"document",
          component:() => import('../views/document.vue')
        }],
      component: () => import('../views/project.vue')
    },
    {
      path: '/:pathMatcher(.*)*',    //如果没有匹配，则重定向到home
      redirect: '/home',
    },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router          //导出路由
