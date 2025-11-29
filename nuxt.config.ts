// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,

  typescript: {
    strict: true
  },

  app: {
    head: {
      title: 'PDF‑редактор',
      htmlAttrs: { lang: 'ru' }
    }
  },

  vite: {
    optimizeDeps: {
      include: [
        'pdfjs-dist', 
        '@pqina/pintura', 
        '@pqina/vue-pintura'
      ]
    }
  },

  build: {
    transpile: [
        '@pqina/pintura',
        '@pqina/vue-pintura',
        '@pqina/filepond-plugin-image-editor',
    ],
  },

  modules: ['@nuxt/image'],

  css: [
    '~/assets/styles/global.css',
  ]
})