import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import { authRoutes } from './auth'

// initialize the router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dist/sidebar/index.html',
      redirect: '/'
    },
    ...authRoutes,
    {
      path: '/',
      component: () => import('~/layouts/DefaultLayout.vue'),
      children: [...usersRoutes]
    }
  ]
})

// navigation guards
router.beforeEach((to: RouteLocationNormalized) => {
  const currentUser = auth.currentUser

  if (!currentUser && to.path !== '/auth/login') return { path: '/auth/login' }
  else if (currentUser && to.path === '/auth/login') return { path: '/' }
})

export default router
