import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default ({ mode }) => {
  // 加載環境變數
  const env = loadEnv(mode, process.cwd(), '')
  return defineConfig({
    base: (env.NODE_ENV === 'development') ? '/' : env.VITE_APP_GIT_URL,
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  });
};