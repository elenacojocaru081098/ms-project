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
  app.use(createPinia())

  haveToInitializeApp = true
}

function initializeApp() {
  app?.use(vuetify)
  app?.use(router)

  app?.mount('#app')
}

onAuthStateChanged(auth, (user) => {
  const { setLoggedUserData } = useUserStore()

  !app && createVueApp()
  setLoggedUserData(user)
  haveToInitializeApp && initializeApp()
})
