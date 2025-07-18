import axios from 'axios';

// Configuração da API Moblix
export const moblixConfig = {
  baseURL: import.meta.env.VITE_MOBLIX_API_URL || 'https://api.moblix.com.br',
  auth: {
    username: import.meta.env.VITE_MOBLIX_USERNAME || 'TooGood',
    password: import.meta.env.VITE_MOBLIX_PASSWORD || '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
  },
  // Configurações padrão para as requisições
  defaults: {
    timeout: 30000, // 30 segundos
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
};

// Cria uma instância do Axios com as configurações da Moblix
export function createMoblixClient() {
  const instance = axios.create({
    baseURL: moblixConfig.baseURL,
    timeout: moblixConfig.defaults.timeout,
    headers: moblixConfig.defaults.headers,
    auth: {
      username: moblixConfig.auth.username,
      password: moblixConfig.auth.password
    }
  });

  // Interceptador para tratamento de erros
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        // Erros 4xx/5xx
        console.error('Erro na resposta da API:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        console.error('Sem resposta do servidor:', error.request);
      } else {
        // Erro ao configurar a requisição
        console.error('Erro na requisição:', error.message);
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

// Instância global da API
export const moblixApi = createMoblixClient();
