import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Plugin personalizado para mensagens divertidas
const jolpStudioMessages = () => {
  return {
    name: 'jolp-studio-messages',
    configureServer(server) {
      server.middlewares.use('/', (req, res, next) => {
        next()
      })
    },
    buildStart() {
      console.log('\n🎮 JOLP STUDIO CARREGANDO...')
      console.log('⚡ Preparando O Culto das Asas Brancas...')
      console.log('🚀 IIIIRUUUU! Vamos que vamos! kkkkkk\n')
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), jolpStudioMessages()],
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
})
