import { createApp, type App } from 'vue'
import { createPinia } from 'pinia'

import 'vuetify/styles'
import vuetify from '~/plugins/vuetify'
import '@mdi/font/css/materialdesignicons.min.css'

import MSApp from './MSApp.vue'
import router from './router'
import { auth } from './composables/useFirebase'
import { onAuthStateChanged } from 'firebase/auth'

let app: App<Element> | null = null
let haveToInitializeApp: boolean = false

/**
 * Creates a new vue app and marks it as ready to be initialized
 */
function createVueApp() {
  app = createApp(MSApp)
  const pinia = createPinia()
  app.use(pinia)

  haveToInitializeApp = true
}

/**
 * Initializes and mounts the vue app
 */
function initializeApp() {
  app?.use(vuetify)
  app?.use(router)

  app?.mount('#app')
  haveToInitializeApp = false
}

/**
 * Firebase baked-in hook
 * Gets triggered when the app loads as well
 */
onAuthStateChanged(auth, async (user) => {
  // check if we need to create and initialize the app
  !app && createVueApp()
  haveToInitializeApp && initializeApp()

  if (user) {
    const { setLoggedUserData } = useUserStore()
    await setLoggedUserData(user)

    const curPath = router.currentRoute.value.path
    if (curPath === '/auth/login') router.push({ path: '/' })
  }
})
