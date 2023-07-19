// users related routes
export const usersRoutes = [
  {
    path: '/users',
    name: 'Manage Users',
    components: {
      default: () => import('~/pages/UsersPage.vue')
    }
  },
  {
    path: '/users/:id',
    name: 'Edit User',
    components: {
      default: () => import('~/pages/EditUserPage.vue')
    }
  }
]
