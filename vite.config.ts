import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { apiMiddleware } from './server/api.mjs'
import { mediaReviewMiddleware } from './server/media-review.mjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), { name: 'bidayah-api', configureServer(server) { server.middlewares.use(mediaReviewMiddleware); server.middlewares.use(apiMiddleware); } }],
})
