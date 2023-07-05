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

function createVueApp() {
  app = createApp(MSApp)
  const pinia = createPinia()
  app.use(pinia)

  haveToInitializeApp = true
}

function initializeApp() {
  app?.use(vuetify)
  app?.use(router)

  app?.mount('#app')
  haveToInitializeApp = false
}

onAuthStateChanged(auth, (user) => {
  !app && createVueApp()
  haveToInitializeApp && initializeApp()

  // const { setLoggedUserData } = useUserStore()
  // user && setLoggedUserData(user)
})
