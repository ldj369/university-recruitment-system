import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import ApplicantdetailForm from '../views/ApplicantdetailForm.vue'


const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/MainView.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/main/resume' }, // 添加默认重定向
      { path: 'resume', name: 'Resume', component: ApplicantdetailForm, meta: { requiresAuth: true } },
      { path: 'jobs', name: 'Jobs', component: () => import('../views/JobsList.vue'), meta: { requiresAuth: true } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !token) {
    // 需要登录但没有token，跳转到登录页
    next('/login')
  } else if (to.path === '/login' && token) {
    // 已登录用户访问登录页，跳转到主页
    next('/main')
  } else {
    next()
  }
})

export default router
