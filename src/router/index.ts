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
    ...generalRoutes
  ]
})

// navigation guards
router.beforeEach((to) => {
  const currentUser = auth.currentUser

  if (!currentUser && to.path !== '/auth/login') return { path: '/auth/login' }
  else if (currentUser && to.path === '/auth/login') return { path: '/' }
})

export default router
