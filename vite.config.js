import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load environment variables (like VITE_SUPABASE_URL) from your .env file
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 5173,
      open: true,
      // Replicate Vercel's rewrite behavior locally
      proxy: {
        '/supaproxy': {
          target: env.VITE_SUPABASE_URL, // Points to your Supabase project URL
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/supaproxy/, '')
        }
      }
    }
  }
})