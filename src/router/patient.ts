// patients related routes
export const patientsRoutes = [
  {
    path: '/patients/add',
    name: 'Add Patient',
    components: {
      default: () => import('~/pages/patients/CreatePatientPage.vue')
    },
    meta: {
      roles: ['Participant']
    }
  },
  {
    path: '/patients/:pnc',
    name: 'List Patient',
    components: {
      default: () => import('~/pages/patients/ViewPatientPage.vue')
    },
    meta: {
      roles: ['Participant']
    }
  }
]
