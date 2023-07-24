// users related routes
export const usersRoutes = [
  {
    path: '/users',
    name: 'Manage Users',
    components: {
      default: () => import('~/pages/users/UsersPage.vue')
    }
  },
  {
    path: '/users/:id',
    name: 'Edit User',
    components: {
      default: () => import('~/pages/users/EditUserPage.vue')
    }
  }
]
