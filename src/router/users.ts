// users related routes
export const usersRoutes = [
  {
    path: '/users',
    name: 'Manage Users',
    components: {
      default: () => import('~/pages/UsersPage.vue')
    }
  }
]
