import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { Vuetify3Resolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import type { UserConfig } from 'vite'
import { isDev, r } from './scripts/utils'

interface IAutoImportPlugin {
  include?: any[]
  imports: any
  dts: string
  dirs: string[]
}

interface IComponentPlugin {
  dirs: string[]
  dts: string
  directoryAsNamespace?: boolean
  globalNamespaces?: string[]
}

interface IOptions {
  imports?: IAutoImportPlugin
  components?: IComponentPlugin
}

export function getBaseConfig(options: IOptions = {}): UserConfig {
  const { imports = {} as IAutoImportPlugin } = options
  const { components = {} as IComponentPlugin } = options

  components.dirs.unshift('src/components') // shared components

  const componentsUnplugin: any = [
    Components({
      dirs: components.dirs.map((dir: string) => r(dir)),
      dts: r(components.dts),
      directoryAsNamespace: components.directoryAsNamespace || false,
      globalNamespaces: components.globalNamespaces || [],
      include: [
        /\.vue\??/ // .vue
      ],
      resolvers: [
        // auto import icons
        IconsResolver({
          componentPrefix: '',
          prefix: 'icon'
        }),

        // auto import vuetify components
        Vuetify3Resolver()
      ]
    })
  ]

  imports.imports.unshift('vue', '@vueuse/core') // shared composable
  imports.dirs.unshift('src/stores/**', 'src/composables/**', 'src/components/**') // shared composable

  const autoImportsUnplugin = [
    AutoImport({
      imports: imports.imports,
      dirs: (imports.dirs || []).map((dir: string) => r(dir)),
      dts: r(imports.dts),
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue\??/ // .vue
      ]
    })
  ]

  const plugins = [
    Vue(),
    ...autoImportsUnplugin,
    ...componentsUnplugin,

    // https://github.com/antfu/unplugin-icons
    Icons()

    // rewrite assets to use relative path
    // {
    //   name: 'assets-rewrite',
    //   enforce: 'post',
    //   apply: 'build',
    //   transformIndexHtml(html: any, { path }: any) {
    //     return html.replace(/"\/assets\//g, `"${relative(dirname(path), '/assets')}/`)
    //   }
    // }
  ]

  return {
    resolve: {
      alias: {
        '~/c': `${r('src')}/components`,
        '@/c': `${r('src')}/components`,
        '~/': `${r('src')}/`,
        '@/': `${r('src')}/`
      }
    },
    define: {
      __DEV__: isDev
    },
    plugins,

    optimizeDeps: {
      include: ['vue', '@vueuse/core', 'vuetify/components'],
      exclude: ['vue-demi']
    }
  }
}
