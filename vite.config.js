import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Configuração do proxy para a API Moblix
      // Configuração para a API Moblix
      '/api': {
        target: 'https://api.moblix.com.br',
        changeOrigin: true,
        secure: false,
        ws: true,
        logLevel: 'debug',
        rewrite: (path) => {
          console.log('Reescrevendo caminho:', path);
          // Mantém o caminho original, pois a API espera /api/Token
          console.log('Mantendo caminho original:', path);
          return path;
        },
        onProxyReq: (proxyReq, req, res) => {
          // Log da requisição que está sendo enviada
          console.log('Enviando requisição para:', req.method, req.url);
          console.log('Headers originais:', req.headers);
          
          // Adiciona cabeçalhos necessários
          proxyReq.setHeader('Host', 'api.moblix.com.br');
          proxyReq.setHeader('Origin', 'externo');
          proxyReq.setHeader('Referer', 'https://moblix.com.br/');
          proxyReq.setHeader('X-Requested-With', 'XMLHttpRequest');
          
          // Se for uma requisição POST, precisamos ajustar o content-length
          if (req.method === 'POST' && req.body) {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
          }
          
          console.log('Headers modificados:', proxyReq.getHeaders());
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('Erro no proxy:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Adiciona os cabeçalhos necessários para a API Moblix
            proxyReq.setHeader('Host', 'api.moblix.com.br');
            proxyReq.setHeader('Origin', 'externo'); // Específico para a API Moblix
            proxyReq.setHeader('Referer', 'https://moblix.com.br/');
            proxyReq.setHeader('X-Requested-With', 'XMLHttpRequest');
            proxyReq.setHeader('Accept', 'application/json');
            
            // Log da requisição
            console.log(`[PROXY] ${req.method} ${req.url}`, {
              headers: proxyReq.getHeaders(),
              path: proxyReq.path
            });
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            // Adiciona headers CORS para permitir a resposta
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, content-type, Authorization, Origin, Referer';
            
            // Log da resposta
            console.log(`[PROXY] Resposta ${proxyRes.statusCode} para ${req.method} ${req.url}`);
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
