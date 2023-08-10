// studies related routes
export const studiesRoutes = [
  {
    path: '/studies',
    name: 'Manage Studies',
    components: {
      default: () => import('~/pages/studies/StudiesPage.vue')
    },
    meta: {
      roles: ['Coordinator', 'Admin']
    }
  },
  {
    path: '/studies/:studyId',
    name: 'Edit Study',
    components: {
      default: () => import('~/pages/studies/EditStudyPage.vue')
    },
    meta: {
      roles: ['Coordinator', 'Admin']
    }
  },
  {
    path: '/studies/create',
    name: 'Create Study',
    components: {
      default: () => import('~/pages/studies/CreateStudyPage.vue')
    },
    meta: {
      roles: ['Coordinator', 'Admin']
    }
  },
  {
    path: '/studies/all',
    name: 'My studies',
    components: {
      default: () => import('~/pages/studies/StudiesPage.vue')
    }
  },
  {
    path: '/studies/:studyId/questions/add',
    name: 'Add a question',
    components: {
      default: () => import('~/pages/studies/questions/AddQuestion.vue')
    },
    meta: {
      roles: ['Coordinator', 'Admin']
    }
  },
  {
    path: '/studies/:studyId/answer',
    name: 'Answer Study',
    components: {
      default: () => import('~/pages/studies/StartStudyPage.vue')
    }
  },
  {
    path: '/studies/:studyId/answer/questions',
    name: 'Answer Question',
    components: {
      default: () => import('~/pages/studies/questions/AnswerQuestionPage.vue')
    }
  }
]
