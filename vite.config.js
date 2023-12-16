import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 设置打包路径
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // src 路径
      'config': path.resolve(__dirname, 'src/config') // src 路径
    }
  },
})
