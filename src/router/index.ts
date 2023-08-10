import { storeToRefs } from 'pinia'
import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'

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
      redirect: '/dashboard',
      component: () => import('~/layouts/DefaultLayout.vue'),
      children: [
        ...usersRoutes,
        ...groupsRoutes,
        ...studiesRoutes,
        {
          path: 'dashboard',
          component: () => import('~/pages/HomePage.vue')
        }
      ]
    },
    {
      path: '/error',
      children: [...errorRoutes]
    }
  ]
})

// navigation guards
router.beforeEach((to: RouteLocationNormalized) => {
  useFetchOnNavigation().fetchResources(to)

  const { user } = storeToRefs(useUserStore())

  if (!user.value && to.path !== '/auth/login') return { path: '/auth/login' }
  else if (user.value && to.path === '/auth/login') return { path: '/' }
  else if (user.value && to.path !== '/auth/login') {
    if (to.meta && to.meta.roles && to.meta.roles !== '*')
      if (!(to.meta.roles as Array<string>).includes(user.value.role))
        return { path: '/error/not-authorized' }
  }
})

export default router
