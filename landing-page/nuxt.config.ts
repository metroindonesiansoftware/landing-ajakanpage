// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;700&display=swap',
        },
      ],
    },
  },
  css: ['@/assets/css/main.scss'],
  compatibilityDate: '2024-04-03',
  devServer: { 
    host: '0.0.0.0',
    port: 3000 
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxt/image',
    'nuxt-mdi',
    'nuxt-swiper',
    'nuxt-disqus'
  ],
  disqus: {
    shortname: "test-hy70l60dd1",
  },
  image: {
    dir: 'assets/img'
  }
})