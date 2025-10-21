import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: { //配置路径别名
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0', // 允许所有主机访问
    port: 8080, // 设置端口
    historyApiFallback: true, // 所有请求都重定向到默认地址
    proxy: {
      '/ghyinyue': {
        target: 'https://ghyinyue.com/index/index/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ghyinyue/, ''),
      },
      '/gdstudio': {
        target: 'https://music-api.gdstudio.xyz/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gdstudio/, ''),
      },
      '/wyyApi': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wyyApi/, ''),
      },
      '/server': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/server/, ''),
      },
    },
  },
})
