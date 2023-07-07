import { defineConfig } from 'vite'
import { getBaseConfig } from './vite.config.base'

const baseConfig = getBaseConfig({
  imports: {
    imports: ['vue-router'],
    dirs: ['src/**'],
    dts: 'src/auto-imports.d.ts'
  },
  components: {
    dirs: ['src/**/'],
    dts: 'src/components.d.ts',
    directoryAsNamespace: false,
    globalNamespaces: ['components']
  }
})

baseConfig.optimizeDeps?.include?.push('vue-router')

// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig
})
