import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export const VUETIFY_COLORS = {
  info: '#2080F0',
  error: '#B00020',
  success: '#208000'
}

const customTheme = {
  dark: false,
  colors: VUETIFY_COLORS
}

// initialize vuetify
export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
})
