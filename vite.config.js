import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(
  {
  // server: {
  //   https: {
  //     key: 'lazy-app-privateKey.key',
  //     cert: './lazy-app.crt'
  //   }

  // },
  plugins: [react()],
  build:{
    sourcemap: true,
  }
})
