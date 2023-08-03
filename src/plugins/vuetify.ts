import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

// custom light theme colors
export const CUSTOM_LIGHT_COLORS = {
  primary: '#0062a1',
  'on-primary': '#ffffff',
  'primary-container': '#d0e4ff',
  'on-primary-container': '#001d35',
  secondary: '#376a20',
  'on-secondary': '#ffffff',
  'secondary-container': '#b7f398',
  'on-secondary-container': '#062100',
  tertiary: '#99405c',
  'on-tertiary': '#ffffff',
  'tertiary-container': '#ffd9e0',
  'on-tertiary-container': '#3f001a',
  background: '#fffbff',
  'on-background': '#3f0016',
  surface: '#fffbff',
  'on-surface': '#3f0016',
  outline: '#73777f',
  'surface-variant': '#dfe3eb',
  'on-surface-variant': '#42474e',
  error: '#ba1a1a',
  'on-error': '#ffffff',
  'error-container': '#ffdad6',
  'on-error-container': '#410002'
}

// custom dark theme colors
export const CUSTOM_DARK_COLORS = {
  primary: '#9ccaff',
  'on-primary': '#003256',
  'primary-container': '#00497b',
  'on-primary-container': '#d0e4ff',
  secondary: '#9cd67e',
  'on-secondary': '#0f3900',
  'secondary-container': '#1f5108',
  'on-secondary-container': '#b7f398',
  tertiary: '#ffb1c4',
  'on-tertiary': '#5e112f',
  'tertiary-container': '#7c2945',
  'on-tertiary-container': '#ffd9e0',
  background: '#3f0016',
  'on-background': '#ffd9df',
  surface: '#3f0016',
  'on-surface': '#ffd9df',
  outline: '#8c9199',
  'surface-variant': '#42474e',
  'on-surface-variant': '#c2c7cf',
  error: '#ffb4ab',
  'on-error': '#690005',
  'error-container': '#93000a',
  'on-error-container': '#ffd9df'
}

const customLightTheme = {
  dark: false,
  colors: CUSTOM_LIGHT_COLORS
}

const customDarkTheme = {
  dark: true,
  color: CUSTOM_DARK_COLORS
}

// initialize vuetify
export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'customLightTheme',
    themes: {
      customLightTheme,
      customDarkTheme
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  defaults: {
    global: {
      density: 'compact'
    },
    VCard: {
      VCardActions: {
        VBtn: {
          variant: 'elevated',
          density: 'default'
        }
      }
    },
    VList: {
      density: 'default'
    }
  }
})
