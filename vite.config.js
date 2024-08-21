import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from "vite-plugin-pwa"
import vue from '@vitejs/plugin-vue'

export default ({ mode }) => {
  // 加載環境變數
  const env = loadEnv(mode, process.cwd(), '')
  return defineConfig({
    base: (env.NODE_ENV === 'development') ? '/' : env.VITE_APP_GIT_URL,
    plugins: [
      vue(),
      /*VitePWA 會在vue專案裡自動產生manifest.json檔和service worke.js檔*/
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          /*開啟此選項可以讓VitePWA在development模式下產生manifest檔*/
          enabled: true,
        },
        /*此選項可以手動設置我們的manifest.json檔*/
        manifest: {
          name: "Music App",
          theme_color: "#ff5e3a",
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png"
            }
          ]
        },
        workbox: {
          globPatterns: (env.NODE_ENV === 'production') ? ['**/*.{js,css,html,svg,png,jpg,ico}'] : [],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/i\.imgur\.com\/.*$/, // 緩存 Imgur 圖片
              handler: 'CacheFirst',
              options: {
                cacheName: 'imgur-images',
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 1 //1天
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }]
        }
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  });
};