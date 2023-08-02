// groups related routes
export const errorRoutes = [
  {
    path: 'not-authorized',
    name: 'Not Authorized',
    components: {
      default: () => import('~/pages/errors/NotAuthorized.vue')
    }
  }
]
