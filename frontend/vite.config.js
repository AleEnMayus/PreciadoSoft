import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  
  // Configuración del servidor de desarrollo
  server: {
    port: 3000,              // Puerto fijo para Electron
    host: 'localhost',       // Host específico
    strictPort: true,        // Forzar este puerto
    open: false              // No abrir navegador automáticamente
  },
  
  // Configuración de build para Electron
  build: {
    outDir: 'build',         // Carpeta de salida compatible con Electron
    assetsDir: 'static',     // Carpeta de assets
    sourcemap: false,        // Desactivar sourcemaps en producción
    minify: 'esbuild',       // Minificación rápida
    
    // Optimización para Electron
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']  // Si usas React Router
        }
      }
    }
  },
  
  // Base URL para Electron (rutas relativas)
  base: './',
  
  // Alias para imports más limpios
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles')
    }
  },
  
  // Variables de entorno
  define: {
    __IS_ELECTRON__: JSON.stringify(true),
    __API_URL__: JSON.stringify('http://localhost:3001'),
  },
  
  // Configuración CSS
  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  }
})