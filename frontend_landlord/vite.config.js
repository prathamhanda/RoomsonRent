import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: 'roomsonrent.in', // Set the host
    port: 80, // Change port if needed
    strictPort: true, // Ensure it fails if the port is not available
    cors: true, // Enable CORS if required
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/global.scss";`, // Example: Auto import global styles
      },
    },
  },
})
