// users related routes
export const usersRoutes = [
  {
    path: '/users',
    name: 'Manage Users',
    components: {
      default: () => import('~/pages/users/UsersPage.vue')
    },
    meta: {
      roles: ['Coordinator', 'Admin']
    }
  },
  {
    path: '/users/:id',
    name: 'Edit User',
    components: {
      default: () => import('~/pages/users/EditUserPage.vue')
    },
    meta: {
      roles: ['Coordinator', 'Admin']
    }
  }
]
