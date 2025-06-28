import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    },
    extensions: ['.js', '.vue', '.json']
  },
  ssr: {
    noExternal: ['@supabase/supabase-js']
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      define: {
        global: 'globalThis',
      },
    },
    include: ['@supabase/supabase-js']
  },
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    'process.env': {}
  },
  server: {
    port: 3000,
    open: true,
    host: true,
    proxy: {
      '/api': {
        target: 'https://api.moblix.com.br',
        changeOrigin: true,
        // NÃO remove o prefixo /api - mantém o path original
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Adiciona header Origin que a API Moblix requer
            proxyReq.setHeader('Origin', 'externo');
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      },
      '/flight': {
        target: 'https://api.moblix.com.br',
        changeOrigin: true,
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('flight proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('Origin', 'externo');
            console.log('Flight Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Flight Response:', proxyRes.statusCode, req.url);
          });
        }
      },
      '/hotel': {
        target: 'https://api.moblix.com.br',
        changeOrigin: true,
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('hotel proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('Origin', 'externo');
            console.log('Hotel Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Hotel Response:', proxyRes.statusCode, req.url);
          });
        }
      },
      '/oferta': {
        target: 'https://api.moblix.com.br',
        changeOrigin: true,
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('oferta proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('Origin', 'externo');
            console.log('Oferta Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Oferta Response:', proxyRes.statusCode, req.url);
          });
        }
      },
      '/product': {
        target: 'https://api.moblix.com.br',
        changeOrigin: true,
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('product proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('Origin', 'externo');
            console.log('Product Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Product Response:', proxyRes.statusCode, req.url);
          });
        }
      },
      '/moblix-api': {
        target: 'https://api.moblix.com.br',
        changeOrigin: true,
        secure: true,
        // NÃO remove o prefixo, mantém o path original
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('moblix-api proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('Origin', 'externo');
            console.log('Moblix-API Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Moblix-API Response:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  },
  css: {
    postcss: './postcss.config.cjs'
  },
  test: {
    globals: true,
    environment: 'jsdom'
  },

})
