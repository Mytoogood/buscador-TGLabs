import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Configuração do proxy para a API Moblix - rotas /api
      '/api': {
        target: 'https://api.moblix.com.br',
        changeOrigin: true,
        secure: false,
        ws: true,
        logLevel: 'debug',
        rewrite: (path) => {
          console.log('Reescrevendo caminho /api:', path);
          return path;
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('Erro no proxy /api:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Adiciona os cabeçalhos necessários para a API Moblix
            proxyReq.setHeader('Host', 'api.moblix.com.br');
            proxyReq.setHeader('Origin', 'externo');
            proxyReq.setHeader('Referer', 'https://moblix.com.br/');
            proxyReq.setHeader('X-Requested-With', 'XMLHttpRequest');
            proxyReq.setHeader('Accept', 'application/json');
            
            console.log(`[PROXY /api] ${req.method} ${req.url}`);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            // Adiciona headers CORS
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, content-type, Authorization, Origin, Referer';
            
            console.log(`[PROXY /api] Resposta ${proxyRes.statusCode} para ${req.method} ${req.url}`);
          });
        }
      },
      // Configuração do proxy para a API Moblix - rotas /hotel/api, /flight/api, /oferta/api
      '/hotel': {
        target: 'https://api.moblix.com.br',
        changeOrigin: true,
        secure: false,
        ws: true,
        logLevel: 'debug',
        rewrite: (path) => {
          console.log('Reescrevendo caminho /hotel:', path);
          return path;
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('Erro no proxy /hotel:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Adiciona os cabeçalhos necessários para a API Moblix
            proxyReq.setHeader('Host', 'api.moblix.com.br');
            proxyReq.setHeader('Origin', 'externo');
            proxyReq.setHeader('Referer', 'https://moblix.com.br/');
            proxyReq.setHeader('X-Requested-With', 'XMLHttpRequest');
            proxyReq.setHeader('Accept', 'application/json');
            
            console.log(`[PROXY /hotel] ${req.method} ${req.url}`);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            // Adiciona headers CORS
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, content-type, Authorization, Origin, Referer';
            
            console.log(`[PROXY /hotel] Resposta ${proxyRes.statusCode} para ${req.method} ${req.url}`);
          });
        }
      },
      // Configuração do proxy para a API Moblix - rotas /flight/api
      '/flight': {
        target: 'https://api.moblix.com.br',
        changeOrigin: true,
        secure: false,
        ws: true,
        logLevel: 'debug',
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('Host', 'api.moblix.com.br');
            proxyReq.setHeader('Origin', 'externo');
            proxyReq.setHeader('Referer', 'https://moblix.com.br/');
            proxyReq.setHeader('X-Requested-With', 'XMLHttpRequest');
            proxyReq.setHeader('Accept', 'application/json');
            
            console.log(`[PROXY /flight] ${req.method} ${req.url}`);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, content-type, Authorization, Origin, Referer';
            
            console.log(`[PROXY /flight] Resposta ${proxyRes.statusCode} para ${req.method} ${req.url}`);
          });
        }
      },
      // Configuração do proxy para a API Moblix - rotas /oferta/api
      '/oferta': {
        target: 'https://api.moblix.com.br',
        changeOrigin: true,
        secure: false,
        ws: true,
        logLevel: 'debug',
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('Host', 'api.moblix.com.br');
            proxyReq.setHeader('Origin', 'externo');
            proxyReq.setHeader('Referer', 'https://moblix.com.br/');
            proxyReq.setHeader('X-Requested-With', 'XMLHttpRequest');
            proxyReq.setHeader('Accept', 'application/json');
            
            console.log(`[PROXY /oferta] ${req.method} ${req.url}`);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, content-type, Authorization, Origin, Referer';
            
            console.log(`[PROXY /oferta] Resposta ${proxyRes.statusCode} para ${req.method} ${req.url}`);
          });
        }
      }
    },
    // Habilita CORS para o servidor de desenvolvimento
    cors: true,
    // Define os headers de CORS
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization, Origin, Referer'
    }
  },
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  // Configuração adicional para garantir que o proxy funcione corretamente
  optimizeDeps: {
    include: ['axios']
  }
})
