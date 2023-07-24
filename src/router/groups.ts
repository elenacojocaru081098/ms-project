// groups related routes
export const groupsRoutes = [
  {
    path: '/groups',
    name: 'Manage Groups',
    components: {
      default: () => import('~/pages/groups/GroupsPage.vue')
    }
  },
  {
    path: '/groups/:id',
    name: 'Edit Group',
    components: {
      default: () => import('~/pages/groups/EditGroupPage.vue')
    }
  },
  {
    path: '/groups/create',
    name: 'Create Group',
    components: {
      default: () => import('~/pages/groups/CreateGroupPage.vue')
    }
  }
]
