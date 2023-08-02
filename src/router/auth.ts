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
          default: () => import('~/pages/auth/LoginPage.vue')
        },
        meta: {
          roles: '*'
        }
      },
      {
        path: 'register',
        name: 'Register',
        components: {
          default: () => import('~/pages/auth/RegisterPage.vue')
        },
        meta: {
          roles: ['Coordinator', 'Admin']
        }
      },
      {
        path: 'password',
        name: 'Change Password',
        components: {
          default: () => import('~/pages/auth/ChangePasswordPage.vue')
        },
        meta: {
          roles: '*'
        }
      }
    ]
  }
]
