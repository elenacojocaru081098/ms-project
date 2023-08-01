// groups related routes
export const studiesRoutes = [
  {
    path: '/studies',
    name: 'Manage Studies',
    components: {
      default: () => import('~/pages/studies/StudiesPage.vue')
    }
  },
  // {
  //   path: '/studies/:id',
  //   name: 'Edit Study',
  //   components: {
  //     // default: () => import('~/pages/groups/EditGroupPage.vue')
  //   }
  // },
  {
    path: '/studies/create',
    name: 'Create Study',
    components: {
      default: () => import('~/pages/studies/CreateStudyPage.vue')
    }
  }
  // {
  //   path: '/studies/all',
  //   name: 'My studies',
  //   components: {
  //     // default: () => import('~/pages/groups/GroupsPage.vue')
  //   }
  // },
  // {
  //   path: '/studies/answer/:id',
  //   name: 'Answer Study',
  //   components: {
  //     // default: () => import('~/pages/groups/GroupsPage.vue')
  //   }
  // }
]
