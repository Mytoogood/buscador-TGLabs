import axios from 'axios';
import auth from './auth';

// ConfiguraÃ§Ã£o da API Moblix
const API_BASE_URL = 'https://api.moblix.com.br';

// Credenciais para autenticaÃ§Ã£o
const AUTH_CREDENTIALS = {
  username: 'TooGood',
  password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

/**
 * ServiÃ§o para interagir com a API Moblix
 */
const moblixApiService = {
  /**
   * Faz uma requisiÃ§Ã£o autenticada para a API Moblix
   * @param {Object} config ConfiguraÃ§Ã£o da requisiÃ§Ã£o
   * @returns {Promise<Object>} Resposta da API
   */
  async request(config, retry = true) {
    try {
      // Garante que temos um token vÃ¡lido
      if (!auth.isAuthenticated()) {
        await auth.login();
      }

      // Prepara a configuraÃ§Ã£o base
      const requestConfig = {
        ...config,
        url: `${API_BASE_URL}${config.endpoint}`,
        headers: {
          'Accept': 'application/json',
          ...auth.getAuthHeader(),
          ...(config.headers || {})
        }
      };

      // Para requisiÃ§Ãµes GET, os parÃ¢metros devem ser passados em params
      if (config.method?.toUpperCase() === 'GET' && config.params) {
        requestConfig.params = config.params;
      }

      console.log('ConfiguraÃ§Ã£o da requisiÃ§Ã£o:', {
        url: requestConfig.url,
        method: requestConfig.method,
        headers: requestConfig.headers,
        params: requestConfig.params,
        data: requestConfig.data
      });

      const response = await axios(requestConfig);
      return response.data;
    } catch (error) {
      console.error('Erro na requisiÃ§Ã£o para a API Moblix:', {
        message: error.message,
        endpoint: config.endpoint,
        status: error.response?.status,
        data: error.response?.data
      });

      // Se for um erro de autenticaÃ§Ã£o e ainda nÃ£o tivermos tentado renovar o token
      if ((error.response?.status === 401 || error.response?.status === 403) && retry) {
        try {
          console.log('Token expirado, tentando renovar...');
          await auth.logout();
          await auth.login();
          
          // Repete a requisiÃ§Ã£o original com o novo token
          return this.request({
            ...config,
            headers: {
              ...config.headers,
              ...auth.getAuthHeader()
            }
          }, false); // NÃ£o tenta renovar novamente
        } catch (refreshError) {
          console.error('Falha ao renovar token:', refreshError);
          throw new Error('NÃ£o foi possÃ­vel autenticar com a API Moblix');
        }
      }

      // Se for um erro de negÃ³cio da API, inclui os detalhes na mensagem
      if (error.response?.data?.Erro) {
        const apiError = error.response.data.Erro;
        const errorMessage = apiError.Message || 'Erro na API';
        const errorDetails = apiError.InnerException?.Message || apiError.StackTraceString || '';
        throw new Error(`${errorMessage} ${errorDetails}`.trim());
      }

      throw error;
    }
  },

  /**
   * Faz uma requisiÃ§Ã£o direta para obter um token de acesso
   * @returns {Promise<Object>} Dados do token de acesso
   */
  async getTokenDirectly() {
    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('username', AUTH_CREDENTIALS.username);
      formData.append('password', AUTH_CREDENTIALS.password);

      const response = await axios({
        method: 'post',
        url: `${API_BASE_URL}/api/Token`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'Origin': 'externo'
        },
        data: formData
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao obter token diretamente:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },

  // Exemplo de mÃ©todos especÃ­ficos da API
  
  /**
   * Busca dados de exemplo da API
   * @param {Object} params ParÃ¢metros da consulta
   * @returns {Promise<Object>} Dados da API
   */
  async getExampleData(params = {}) {
    return this.request({
      method: 'get',
      endpoint: '/api/exemplo/endpoint',
      params
    });
  },

  /**
   * Envia dados para a API
   * @param {Object} data Dados a serem enviados
   * @returns {Promise<Object>} Resposta da API
   */
  async postExampleData(data) {
    return this.request({
      method: 'post',
      endpoint: '/api/exemplo/endpoint',
      data
    });
  },

  /**
   * Consulta voos na API Moblix
   * @param {Object} params ParÃ¢metros da consulta
   * @param {string} params.origem CÃ³digo IATA do aeroporto de origem (ex: 'BSB')
   * @param {string} params.destino CÃ³digo IATA do aeroporto de destino (ex: 'GRU')
   * @param {string} params.ida Data de ida no formato 'YYYY-MM-DD'
   * @param {string} [params.volta] Data de volta no formato 'YYYY-MM-DD' (opcional para voos de ida e volta)
   * @param {number} [params.adultos=1] NÃºmero de passageiros adultos
   * @param {number} [params.criancas=0] NÃºmero de crianÃ§as
   * @param {number} [params.bebes=0] NÃºmero de bebÃªs
   * @param {number} [params.companhia=-1] ID da companhia aÃ©rea (-1 para todas)
   * @param {boolean} [params.internacional=false] Se Ã© um voo internacional
   * @param {boolean} [params.soIda=false] Se Ã© apenas ida
   * @param {number} [params.numeroPagina=1] NÃºmero da pÃ¡gina para resultados paginados
   * @param {number} [params.quantidadePorPagina=10] Quantidade de itens por pÃ¡gina
   * @param {string} [params.orderBy='tempo'] OrdenaÃ§Ã£o ('tempo' ou 'preco')
   * @returns {Promise<Object>} Dados dos voos encontrados
   */
  async consultarVoos(params) {
    // ValidaÃ§Ãµes bÃ¡sicas
    if (!params.origem || !params.destino || !params.ida) {
      throw new Error('Origem, destino e data de ida sÃ£o obrigatÃ³rios');
    }

    // Formata os parÃ¢metros para a API
    const requestData = {
      Origem: params.origem.toUpperCase(),
      Destino: params.destino.toUpperCase(),
      Ida: params.ida,
      Volta: params.volta || '0001-01-01', // Formato para indicar sem volta
      Adultos: params.adultos || 1,
      Criancas: params.criancas || 0,
      Bebes: params.bebes || 0,
      Companhia: params.companhia || -1,
      Internacional: params.internacional || false,
      SoIda: params.soIda || false,
      NumeroPagina: params.numeroPagina || 1,
      QuantidadePorPagina: params.quantidadePorPagina || 10,
      OrderBy: params.orderBy || 'tempo'
    };

    // Remove campos undefined
    Object.keys(requestData).forEach(key => requestData[key] === undefined && delete requestData[key]);

    // Faz a requisiÃ§Ã£o para a API
    return this.request({
      method: 'post',
      endpoint: '/api/ConsultaAereo/Consultar',
      data: requestData,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  },

  /**
   * Consulta voos nas consolidadoras Rextur e Eferatur
   * @param {Object} params ParÃ¢metros da consulta
   * @param {string} params.Origem CÃ³digo IATA do aeroporto de origem (ex: 'GRU')
   * @param {string} params.Destino CÃ³digo IATA do aeroporto de destino (ex: 'BSB')
   * @param {string} params.Ida Data de ida no formato 'YYYY-MM-DD'
   * @param {number} params.Adultos NÃºmero de passageiros adultos (padrÃ£o: 1)
   * @param {number} params.Criancas NÃºmero de crianÃ§as (padrÃ£o: 0)
   * @param {number} params.Bebes NÃºmero de bebÃªs (padrÃ£o: 0)
   * @param {number} params.Companhia ID da companhia aÃ©rea (ver documentaÃ§Ã£o)
   * @returns {Promise<Object>} Dados dos voos encontrados
   */
  async consultarReservaFacil(params) {
    // ValidaÃ§Ãµes bÃ¡sicas
    if (!params.Origem || !params.Destino || !params.Ida) {
      throw new Error('Origem, Destino e Ida sÃ£o obrigatÃ³rios');
    }

    // Valores padrÃ£o
    const requestData = {
      Origem: (params.Origem || '').toUpperCase(),
      Destino: (params.Destino || '').toUpperCase(),
      Ida: params.Ida,
      Adultos: params.Adultos || 1,
      Criancas: params.Criancas || 0,
      Bebes: params.Bebes || 0,
      Companhia: params.Companhia || 1 // Default para Latam
    };

    // Faz a requisiÃ§Ã£o para a API
    return this.request({
      method: 'post',
      endpoint: '/api/ReservaFacil/Consultar',
      data: requestData,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  },

  /**
   * Lista ofertas de voos disponÃ­veis
   * @param {Object} [params={}] ParÃ¢metros da consulta
   * @param {boolean} [params.international=false] Se deve retornar apenas voos internacionais
   * @param {number} [params.quantidade=10] Quantidade de ofertas a retornar
   * @param {boolean} [params.shuffle=false] Se deve retornar ofertas em ordem aleatÃ³ria
   * @returns {Promise<Array>} Lista de ofertas de voos
   */
  async listarOfertas(params = {}) {
    const { international = false, quantidade = 10, shuffle = false } = params;
    
    // Faz a requisiÃ§Ã£o para a API
    return this.request({
      method: 'get',
      endpoint: '/oferta/api/ofertas',
      params: {
        international,
        quantidade,
        shuffle
      },
      headers: {
        'Accept': 'application/json'
      }
    });
  },

  /**
   * Busca aeroportos com base em um termo de pesquisa
   * @param {string} filtro Termo para filtrar os aeroportos (nome ou cÃ³digo IATA)
   * @returns {Promise<Array>} Lista de aeroportos que correspondem ao filtro
   */
  async buscarAeroportos(filtro = '') {
    try {
      const response = await this.request({
        method: 'GET',
        endpoint: '/flight/api/Airport/GetAllAirport',
        params: {
          filtro: filtro.trim()
        },
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // Retorna apenas os dados dos aeroportos se a resposta for bem-sucedida
      return response && response.Success && response.Data ? response.Data : [];
    } catch (error) {
      console.error('Erro ao buscar aeroportos:', error);
      return [];
    }
  },





  /**
   * Cria um novo pedido
   * @param {Object} dadosPedido Dados do pedido a ser criado
   * @param {number} dadosPedido.IdAgency ID da agÃªncia
   * @param {number} dadosPedido.IdPerson ID da pessoa
   * @returns {Promise<Object>} Dados do pedido criado
   */
  async criarPedido({ IdAgency, IdPerson } = {}) {
    if (!IdAgency || !IdPerson) {
      throw new Error('ID da agÃªncia e ID da pessoa sÃ£o obrigatÃ³rios');
    }

    return request({
      method: 'POST',
      endpoint: '/api/orders',
      data: {
        IdAgency,
        IdPerson
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  },

  /**
   * Lista pedidos de acordo com os filtros fornecidos
   * @param {Object} params ParÃ¢metros da consulta
   * @param {number} [params.id] ID do pedido (opcional)
   * @param {number} [params.idPipeline=0] ID da negociaÃ§Ã£o
   * @param {number} [params.pageNumber=1] NÃºmero da pÃ¡gina
   * @param {number} [params.pageSize=10] Quantidade de itens por pÃ¡gina
   * @param {number} [params.idStatus=0] ID do status do pedido
   * @param {boolean} [params.listBudget=false] Se true, lista orÃ§amentos; se false, lista pedidos
   * @returns {Promise<Object>} Lista de pedidos
   */
  async listarPedidos({
    id,
    idPipeline = 0,
    pageNumber = 1,
    pageSize = 10,
    idStatus = 0,
    listBudget = false
  } = {}) {
    return request({
      method: 'GET',
      endpoint: '/api/orders',
      params: {
        id,
        idPipeline,
        pageNumber,
        pageSize,
        idStatus,
        listBudget
      },
      headers: {
        'Accept': 'application/json'
      }
    });
  },

  /**
   * Lista o estoque de um produto especÃ­fico
   * @param {number} idProduct ID do produto para consultar o estoque
   * @returns {Promise<Object>} Dados de estoque do produto
   */
  async listarEstoque(idProduct) {
    if (!idProduct) {
      throw new Error('ID do produto Ã© obrigatÃ³rio');
    }

    return request({
      method: 'GET',
      endpoint: `/api/inventory/${idProduct}`,
      headers: {
        'Accept': 'application/json'
      }
    });
  },

};


export default moblixApiService;
