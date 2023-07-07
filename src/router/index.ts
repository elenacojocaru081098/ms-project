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
    ...authRoutes
  ]
})

// navigation guards
router.beforeEach((to: RouteLocationNormalized) => {
  // if (to.name !== 'Auth') return { name: 'Auth' }
})

export default router
