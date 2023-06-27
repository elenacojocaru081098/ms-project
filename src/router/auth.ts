// auth routes
export const authRoutes = [
  {
    path: '/auth',
    name: 'Auth',
    components: {
      default: () => import('~/pages/AuthPage.vue')
    }
  }
]
