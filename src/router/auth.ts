// auth routes
export const authRoutes = [
  {
    path: '/auth',
    name: 'Auth',
    redirect: '/auth/login',
    component: () => import('~/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        components: {
          default: () => import('~/pages/LoginPage.vue')
        }
      },
      {
        path: 'register',
        name: 'Register',
        components: {
          default: () => import('~/pages/RegisterPage.vue')
        }
      }
    ]
  }
]
