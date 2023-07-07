// general routes
export const generalRoutes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/dashboard',
    component: () => import('~/layouts/DefaultLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        components: {
          default: () => import('~/pages/DashboardPage.vue')
        }
      }
    ]
  }
]
