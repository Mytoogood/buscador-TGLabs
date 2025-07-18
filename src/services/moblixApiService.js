import axios from 'axios';
import auth from './auth.js';

// Configuração da API Moblix - usando proxy local para evitar CORS
const API_BASE_URL = import.meta.env.DEV ? '' : 'https://api.moblix.com.br';

// Credenciais para autenticação
const AUTH_CREDENTIALS = {
  username: 'TooGood',
  password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

/**
 * Serviço para interagir com a API Moblix
 */
const moblixApiService = {
  /**
   * Faz uma requisição autenticada para a API Moblix
   * @param {Object} config Configuração da requisição
   * @returns {Promise<Object>} Resposta da API
   */
  async request(config, retry = true) {
    try {
      // Garante que temos um token válido
      if (!auth.isAuthenticated()) {
        await auth.login();
      }

      // Prepara a configuração base
      const requestConfig = {
        ...config,
        url: `${API_BASE_URL}${config.endpoint}`,
        headers: {
          'Accept': 'application/json',
          ...auth.getAuthHeader(),
          ...(config.headers || {})
        }
      };

      // Para requisições GET, os parâmetros devem ser passados em params
      if (config.method?.toUpperCase() === 'GET' && config.params) {
        requestConfig.params = config.params;
      }

      console.log('Configuração da requisição:', {
        url: requestConfig.url,
        method: requestConfig.method,
        headers: requestConfig.headers,
        params: requestConfig.params,
        data: requestConfig.data
      });

      const response = await axios(requestConfig);
      console.log('Resposta da API Moblix:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro na requisição para a API Moblix:', {
        message: error.message,
        endpoint: config.endpoint,
        status: error.response?.status,
        data: error.response?.data
      });

      // Se for um erro de autenticação e ainda não tivermos tentado renovar o token
      if ((error.response?.status === 401 || error.response?.status === 403) && retry) {
        try {
          console.log('Token expirado, tentando renovar...');
          await auth.logout();
          await auth.login();
          // Repete a requisição original com o novo token
          return this.request({
            ...config,
            headers: {
              ...config.headers,
              ...auth.getAuthHeader()
            }
          }, false); // Não tenta renovar novamente
        } catch (refreshError) {
          console.error('Falha ao renovar token:', refreshError);
          throw new Error('Não foi possível autenticar com a API Moblix');
        }
      }

      // Se for um erro de negócio da API, inclui os detalhes na mensagem
      if (error.response?.data?.Erro) {
        const apiError = error.response.data.Erro;
        const errorMessage = apiError.Message || 'Erro na API';
        const errorDetails = apiError.InnerException?.Message || apiError.StackTraceString || '';
        throw new Error(`${errorMessage} ${errorDetails}`.trim());
      }

      // Tratamento amigável para erro de nenhum voo encontrado
      if (error.response?.data?.Data && Array.isArray(error.response.data.Data) && error.response.data.Data.length === 0) {
        throw new Error('Nenhum voo encontrado para os parâmetros informados');
      }

      throw error;
    }
  },

  /**
   * Faz uma requisição direta para obter um token de acesso
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
          'Accept': 'application/json'
        },
        data: formData,
        withCredentials: false
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

  // Exemplo de métodos específicos da API
  
  /**
   * Busca dados de exemplo da API
   * @param {Object} params Parâmetros da consulta
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
   * Endpoint: https://api.moblix.com.br/api/ConsultaAereo/Consultar
   * @param {Object} params Parâmetros da consulta
   * @param {string} params.origem Código IATA do aeroporto de origem (ex: 'BSB')
   * @param {string} params.destino Código IATA do aeroporto de destino (ex: 'GRU')
   * @param {string} params.ida Data de ida no formato 'YYYY-MM-DD'
   * @param {string} [params.volta] Data de volta no formato 'YYYY-MM-DD' (opcional para voos de ida e volta)
   * @param {number} [params.adultos=1] Número de passageiros adultos
   * @param {number} [params.criancas=0] Número de crianças
   * @param {number} [params.bebes=0] Número de bebês
   * @param {number} [params.companhia=-1] ID da companhia aérea (-1=Todas, 1=Latam, 2=Gol, 3=Azul, 11=TAP, 13=Copa, 22=American, 26=Iberia, 34=Livelo, 1200=Azul Interline)
   * @param {boolean} [params.internacional=false] Se é um voo internacional
   * @param {boolean} [params.soIda=false] Se é apenas ida
   * @param {number} [params.numeroPagina=1] Número da página para resultados paginados
   * @param {number} [params.quantidadePorPagina=10] Quantidade de itens por página
   * @param {string} [params.orderBy='tempo'] Ordenação ('tempo' ou 'preco')
   * @returns {Promise<Object>} Dados dos voos encontrados
   */
  async consultarVoos(params) {
    // Validações básicas
    if (!params.origem || !params.destino || !params.ida) {
      throw new Error('Origem, destino e data de ida são obrigatórios');
    }

    // Formata os parâmetros para a API - formato simplificado conforme documentação
    const requestData = {
      Origem: params.origem.toUpperCase(),
      Destino: params.destino.toUpperCase(),
      Ida: params.ida,
      Adultos: params.adultos || 1,
      Criancas: params.criancas || 0,
      Bebes: params.bebes || 0,
      Companhia: params.companhia || -1 // Default para Todas as companhias
    };
    
    // 🔑 CORREÇÃO CRÍTICA: Azul requer parâmetro internacional=true
    if (params.companhia === 3 || params.internacional) {
      requestData.internacional = true;
      console.log('🔧 Aplicando configuração especial para Azul: internacional=true');
    }
    
    // Validação de aeroportos específicos
    const validAirports = ['CNF', 'GRU', 'CGH', 'SDU', 'GIG', 'BSB', 'SSA', 'FOR', 'REC', 'POA', 'BEL', 'MAO', 'CWB', 'VIX'];
    
    // Mapeia códigos de aeroportos alternativos por companhia
    const getAirportMapping = (companyId) => {
      if (companyId === 2) { // GOL
        return {
          'RIO': 'GIG', // GOL: CNF -> Galeão (aeroporto principal GOL no RJ)
          'SAO': 'CGH',
          'SPO': 'CGH'
        };
      } else if (companyId === 3) { // AZUL
        return {
          'RIO': 'SDU', // Azul: CNF -> Santos Dumont (aeroporto preferencial Azul no RJ)
          'SAO': 'CGH', // Azul: Congonhas em São Paulo
          'SPO': 'CGH'
        };
      } else { // LATAM e outras
        return {
          'RIO': 'GIG', // LATAM: Galeão
          'SAO': 'GRU', // LATAM: Guarulhos
          'SPO': 'GRU'
        };
      }
    };
    
    const airportMapping = getAirportMapping(requestData.Companhia);
    
    // Aplica mapeamento se necessário
    if (airportMapping[requestData.Origem]) {
      const companyName = requestData.Companhia === 2 ? 'GOL' : requestData.Companhia === 3 ? 'Azul' : requestData.Companhia === 1 ? 'LATAM' : 'Outras';
      console.log(`🔧 Mapeando aeroporto: ${requestData.Origem} → ${airportMapping[requestData.Origem]} (${companyName})`);
      requestData.Origem = airportMapping[requestData.Origem];
    }
    
    if (airportMapping[requestData.Destino]) {
      const companyName = requestData.Companhia === 2 ? 'GOL' : requestData.Companhia === 3 ? 'Azul' : requestData.Companhia === 1 ? 'LATAM' : 'Outras';
      console.log(`🔧 Mapeando aeroporto: ${requestData.Destino} → ${airportMapping[requestData.Destino]} (${companyName})`);
      requestData.Destino = airportMapping[requestData.Destino];
    }

    // Adiciona volta apenas se fornecida
    if (params.volta && params.volta !== '0001-01-01') {
      requestData.Volta = params.volta;
    }

    console.log('📡 Enviando requisição para API Moblix:', requestData);

    try {
      const result = await this.request({
        method: 'post',
        endpoint: '/api/ConsultaAereo/Consultar',
        data: requestData,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log('Resultado da busca de voos:', result);
      
      // *** ESTRATÉGIA AUTOMÁTICA: AEROPORTOS ALTERNATIVOS DO RIO ***
      // Se não encontrou voos para Rio de Janeiro, tenta outros aeroportos automaticamente
      if (result?.Data?.[0]?.Ida?.length === 0 && 
          result?.Data?.[0]?.flights?.length === 0 &&
          params.origem === 'CNF' &&
          (params.destino === 'RIO' || requestData.Destino === 'GIG' || requestData.Destino === 'SDU')) {
        
        console.log('🔄 Nenhum voo encontrado - tentando aeroportos alternativos do Rio...');
        
        const rioAlternatives = [];
        if (requestData.Destino === 'GIG') {
          rioAlternatives.push('SDU', 'CGH'); // Se tentou GIG, tenta SDU e CGH
        } else if (requestData.Destino === 'SDU') {
          rioAlternatives.push('GIG', 'CGH'); // Se tentou SDU, tenta GIG e CGH
        }
        
        for (const altDestino of rioAlternatives) {
          try {
            console.log(`🔍 Tentando aeroporto alternativo: CNF → ${altDestino}`);
            
            const altParams = { ...requestData, Destino: altDestino };
            const altResult = await this.request({
              method: 'post',
              endpoint: '/api/ConsultaAereo/Consultar',
              data: altParams,
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            });
            
            if (altResult?.Data?.[0]?.Ida?.length > 0 || altResult?.Data?.[0]?.flights?.length > 0) {
              console.log(`✅ Voos encontrados em ${altDestino}! Retornando resultado.`);
              // Marca o resultado para indicar que foi encontrado em aeroporto alternativo
              if (altResult.Data[0]) {
                altResult.Data[0].AeroportoAlternativo = altDestino;
                altResult.Data[0].AeroportoOriginalPesquisado = requestData.Destino;
              }
              return altResult;
            }
          } catch (altError) {
            console.log(`❌ Erro ao tentar ${altDestino}:`, altError.message);
          }
        }
        
        console.log('⚠️ Nenhum voo encontrado em nenhum aeroporto do Rio');
      }
      
      return result;
    } catch (error) {
      console.error('Erro ao buscar voos:', error.message);
      
      // Se é um Network Error, relança o erro para debugging
      if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
        console.error('❌ Erro de conectividade com a API Moblix');
        console.error('Endpoint tentado:', '/api/ConsultaAereo/Consultar');
        console.error('Dados enviados:', requestData);
        throw new Error('Falha na conexão com a API de voos. Verifique sua conectividade.');
      }
      
      // Tratamento específico para diferentes tipos de erro
      if (error.message.includes('Nenhum voo encontrado') || 
          error.message.includes('Sequence contains no elements') ||
          error.response?.data?.message?.includes('Sequence contains no elements')) {
        // Retorna um objeto padrão para facilitar o tratamento no frontend
        console.log('📋 Retornando resposta vazia para "nenhum voo encontrado"');
        return { 
          Data: [{
            Ida: [],
            flights: [],
            TokenConsulta: null,
            Companhia: params.companhia === 1 ? 'LATAM' : params.companhia === 2 ? 'GOL' : params.companhia === 3 ? 'Azul' : 'Todas',
            SemDisponibilidade: true,
            PesquisaMilhasHabilitada: true,
            PesquisaPaganteHabilitada: true,
            NeedsAlternativeAirports: true // Sinaliza que pode precisar tentar outros aeroportos
          }], 
          Success: true,
          HasResult: false,
          Mensagem: 'Nenhum voo encontrado para os parâmetros informados',
          TotalItens: 0
        };
      }
      
      // Tratamento para erros de rota não encontrada
      if (error.response?.status === 404) {
        console.log('❌ Rota não encontrada - possivelmente sem voos para esta combinação');
        return { 
          Data: [{
            Ida: [],
            flights: [],
            TokenConsulta: null,
            SemDisponibilidade: true,
            RouteNotFound: true
          }], 
          Success: true,
          HasResult: false,
          Mensagem: 'Rota não disponível para os parâmetros informados',
          TotalItens: 0
        };
      }
      
      throw error;
    }
  },

  /**
   * Consulta voos em milhas na API Moblix
   * Faz múltiplas tentativas com diferentes parâmetros para encontrar voos em milhas
   * @param {Object} params Parâmetros da consulta
   * @returns {Promise<Object>} Dados dos voos em milhas encontrados
   */
  async consultarVoosEmMilhas(params) {
    console.log('✈️ Iniciando busca específica por voos em milhas REAIS...');
    
    // Estratégia 1: Busca com parâmetros específicos para milhas na API normal
    const milesParams1 = {
      Origem: params.origem.toUpperCase(),
      Destino: params.destino.toUpperCase(),
      Ida: params.ida,
      Adultos: params.adultos || 1,
      Criancas: params.criancas || 0,
      Bebes: params.bebes || 0,
      Companhia: params.companhia || 1,
      TipoBusca: 'milhas',
      BuscarMilhas: true,
      ProgramaFidelidade: true,
      Award: true,
      Redemption: true,
      IncluirMilhas: true
    };
    
    console.log('📡 Tentativa 1: Busca com parâmetros específicos para milhas');
    try {
      const result1 = await this.consultarVoos(milesParams1);
      if (result1 && result1.Data && result1.Data.length > 0) {
        const milesFlights = this.extractMilesFlights(result1);
        if (milesFlights.length > 0) {
          console.log('✅ Voos em milhas encontrados na tentativa 1:', milesFlights.length);
          return { ...result1, Data: [{ flights: milesFlights }] };
        }
      }
    } catch (error) {
      console.log('⚠️ Tentativa 1 falhou:', error.message);
    }
    
    // Estratégia 2: Busca direta na API ConsultaAereo com parâmetros de milhas
    console.log('📡 Tentativa 2: Busca direta na API ConsultaAereo');
    try {
      const milesParams2 = {
        Origem: params.origem.toUpperCase(),
        Destino: params.destino.toUpperCase(),
        Ida: params.ida,
        Adultos: params.adultos || 1,
        Criancas: params.criancas || 0,
        Bebes: params.bebes || 0,
        Companhia: params.companhia || 1,
        TipoBusca: 'milhas',
        BuscarMilhas: true,
        ProgramaFidelidade: true,
        Award: true,
        Redemption: true
      };
      
      const result2 = await this.request({
        method: 'post',
        endpoint: '/api/ConsultaAereo/Consultar',
        data: milesParams2,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (result2 && result2.Data && result2.Data.length > 0) {
        const milesFlights = this.extractMilesFlights(result2);
        if (milesFlights.length > 0) {
          console.log('✅ Voos em milhas encontrados na tentativa 2:', milesFlights.length);
          return { ...result2, Data: [{ flights: milesFlights }] };
        }
      }
    } catch (error) {
      console.log('⚠️ Tentativa 2 falhou:', error.message);
    }
    
    // Estratégia 3: Busca com endpoint específico para milhas
    console.log('📡 Tentativa 3: Busca com endpoint específico para milhas');
    try {
      const milesParams3 = {
        Origem: params.origem.toUpperCase(),
        Destino: params.destino.toUpperCase(),
        Ida: params.ida,
        Adultos: params.adultos || 1,
        Criancas: params.criancas || 0,
        Bebes: params.bebes || 0,
        Companhia: params.companhia || 1
      };
      
      const result3 = await this.request({
        method: 'post',
        endpoint: '/aereo/api/milhas/consulta',
        data: milesParams3,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (result3 && result3.Data && result3.Data.length > 0) {
        const milesFlights = this.extractMilesFlights(result3);
        if (milesFlights.length > 0) {
          console.log('✅ Voos em milhas encontrados na tentativa 3:', milesFlights.length);
          return { ...result3, Data: [{ flights: milesFlights }] };
        }
      }
    } catch (error) {
      console.log('⚠️ Tentativa 3 falhou:', error.message);
    }
    
    // Estratégia 4: Busca no endpoint da LATAM específico para milhas
    console.log('📡 Tentativa 4: Busca específica LATAM para milhas');
    try {
      const milesParams4 = {
        Origem: params.origem.toUpperCase(),
        Destino: params.destino.toUpperCase(),
        Ida: params.ida,
        Adultos: params.adultos || 1,
        Criancas: params.criancas || 0,
        Bebes: params.bebes || 0,
        Companhia: 1, // Força LATAM
        TipoBusca: 'award',
        ProgramaFidelidade: 'LATAM_PASS'
      };
      
      const result4 = await this.request({
        method: 'post',
        endpoint: '/aereo/api/latam/award',
        data: milesParams4,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (result4 && result4.Data && result4.Data.length > 0) {
        const milesFlights = this.extractMilesFlights(result4);
        if (milesFlights.length > 0) {
          console.log('✅ Voos em milhas encontrados na tentativa 4:', milesFlights.length);
          return { ...result4, Data: [{ flights: milesFlights }] };
        }
      }
    } catch (error) {
      console.log('⚠️ Tentativa 4 falhou:', error.message);
    }
    
    // Estratégia 5: Busca na API do Reserva Fácil com parâmetros de milhas
    console.log('📡 Tentativa 5: Busca na API Reserva Fácil para milhas');
    try {
      const milesParams5 = {
        Origem: params.origem.toUpperCase(),
        Destino: params.destino.toUpperCase(),
        Ida: params.ida,
        Adultos: params.adultos || 1,
        Criancas: params.criancas || 0,
        Bebes: params.bebes || 0,
        Companhia: params.companhia || 1,
        TipoBusca: 'milhas',
        BuscarMilhas: true
      };
      
      const result5 = await this.request({
        method: 'post',
        endpoint: '/moblix-api/api/ReservaFacil/ConsultarMilhas',
        data: milesParams5,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (result5 && result5.Data && result5.Data.length > 0) {
        const milesFlights = this.extractMilesFlights(result5);
        if (milesFlights.length > 0) {
          console.log('✅ Voos em milhas encontrados na tentativa 5:', milesFlights.length);
          return { ...result5, Data: [{ flights: milesFlights }] };
        }
      }
    } catch (error) {
      console.log('⚠️ Tentativa 5 falhou:', error.message);
    }
    
    // Se nenhuma estratégia encontrar voos reais em milhas, retorna erro
    console.log('❌ Nenhuma estratégia encontrou voos em milhas reais na API');
    console.log('💡 Possíveis causas:');
    console.log('  - API não tem voos em milhas disponíveis para esta rota/data');
    console.log('  - API precisa de autenticação específica para milhas');
    console.log('  - Endpoints de milhas podem estar em outros serviços');
    console.log('  - Parâmetros específicos podem ser necessários');
    
    throw new Error('Nenhum voo em milhas encontrado na API. Verifique se a API suporta busca de milhas para esta rota.');
  },
  
  /**
   * Extrai voos que são pagos em milhas de uma resposta da API
   * @param {Object} response Resposta da API
   * @returns {Array} Lista de voos em milhas
   */
  extractMilesFlights(response) {
    const allFlights = [];
    
    if (response.Data && Array.isArray(response.Data)) {
      response.Data.forEach(dataItem => {
        if (dataItem.flights && Array.isArray(dataItem.flights)) {
          allFlights.push(...dataItem.flights);
        } else if (dataItem.Ida && Array.isArray(dataItem.Ida)) {
          allFlights.push(...dataItem.Ida);
        }
      });
    }
    
    // Filtra voos com possibilidade de milhas
    // Na nova estrutura, verifica se tem PontosAdulto > 0 em qualquer lugar
    const milesFlights = allFlights.filter(flight => {
      // Verifica se tem PontosAdulto > 0 no objeto principal
      if (typeof flight.PontosAdulto === 'number' && flight.PontosAdulto > 0) {
        return true;
      }
      
      // Verifica se tem PontosAdulto > 0 nos segmentos
      if (flight.segments && Array.isArray(flight.segments)) {
        return flight.segments.some(segment => 
          typeof segment.PontosAdulto === 'number' && segment.PontosAdulto > 0
        );
      }
      
      // Verifica se tem indicação de programa de fidelidade
      if (flight.segments && Array.isArray(flight.segments)) {
        return flight.segments.some(segment => 
          segment.FidelityProgram && segment.FidelityProgram !== '' && segment.FidelityProgram !== null
        );
      }
      
      return false;
    });
    
    console.log(`📊 Voos analisados: ${allFlights.length}, Voos em milhas: ${milesFlights.length}`);
    return milesFlights;
  },
  


  /**
   * Consulta voos nas consolidadoras Rextur e Eferatur
   * @param {Object} params Parâmetros da consulta
   * @param {string} params.Origem Código IATA do aeroporto de origem (ex: 'GRU')
   * @param {string} params.Destino Código IATA do aeroporto de destino (ex: 'BSB')
   * @param {string} params.Ida Data de ida no formato 'YYYY-MM-DD'
   * @param {number} params.Adultos Número de passageiros adultos (padrão: 1)
   * @param {number} params.Criancas Número de crianças (padrão: 0)
   * @param {number} params.Bebes Número de bebês (padrão: 0)
   * @param {number} params.Companhia ID da companhia aérea (ver documentação)
   * @returns {Promise<Object>} Dados dos voos encontrados
   */
  async consultarReservaFacil(params) {
    // Validações básicas
    if (!params.Origem || !params.Destino || !params.Ida) {
      throw new Error('Origem, Destino e Ida são obrigatórios');
    }

    // Valores padrão
    const requestData = {
      Origem: (params.Origem || '').toUpperCase(),
      Destino: (params.Destino || '').toUpperCase(),
      Ida: params.Ida,
      Adultos: params.Adultos || 1,
      Criancas: params.Criancas || 0,
      Bebes: params.Bebes || 0,
      Companhia: params.Companhia || 0 // Default para Todas as companhias (0 para Reserva Fácil)
    };

    // Faz a requisição para a API
    try {
      return await this.request({
        method: 'post',
        endpoint: '/moblix-api/api/ReservaFacil/Consultar',
        data: requestData,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
    } catch (error) {
      console.error('Erro ao consultar Reserva Fácil:', error.message);
      
      // Se é um Network Error, relança o erro para debugging
      if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
        console.error('❌ Erro de conectividade com a API Reserva Fácil');
        console.error('Endpoint tentado:', '/moblix-api/api/ReservaFacil/Consultar');
        console.error('Dados enviados:', requestData);
        throw new Error('Falha na conexão com a API de voos. Verifique sua conectividade.');
      }
      
      throw error;
    }
  },

  /**
   * Lista ofertas de voos disponíveis
   * @param {Object} [params={}] Parâmetros da consulta
   * @param {boolean} [params.international=false] Se deve retornar apenas voos internacionais
   * @param {number} [params.quantidade=10] Quantidade de ofertas a retornar
   * @param {boolean} [params.shuffle=false] Se deve retornar ofertas em ordem aleatória
   * @returns {Promise<Array>} Lista de ofertas de voos
   */
  async listarOfertas(params = {}) {
    const { international = false, quantidade = 10, shuffle = false } = params;
    
    // Faz a requisição para a API
    return this.request({
      method: 'get',
      endpoint: '/oferta/api/ofertas',
      params: {
        international,
        quantidade: 100,
        shuffle
      },
      headers: {
        'Accept': 'application/json'
      }
    });
  },

  /**
   * Busca aeroportos com base em um termo de pesquisa
   * @param {string} filtro Termo para filtrar os aeroportos (nome ou código IATA)
   * @returns {Promise<Array>} Lista de aeroportos que correspondem ao filtro
   */
  async buscarAeroportos(filtro = '') {
    try {
      console.log('🛫 Buscando aeroportos com filtro:', filtro);
      
      const response = await this.request({
        method: 'GET',
        endpoint: '/aereo/api/aeroporto',
        params: {
          filtro: filtro.trim()
        },
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // Retorna apenas os dados dos aeroportos se a resposta for bem-sucedida
      console.log('✅ Aeroportos encontrados:', response?.length || 0);
      return response && Array.isArray(response) ? response : (response?.Data || []);
    } catch (error) {
      console.error('❌ Erro ao buscar aeroportos:', error);
      
      // Em caso de erro, retorna lista fallback para manter a funcionalidade
      console.log('🔄 Usando lista de aeroportos fallback');
      const aeroportosFallback = [
        { Iata: 'GRU', Nome: 'Aeroporto Internacional de São Paulo/Guarulhos', Pais: 'Brasil' },
        { Iata: 'CGH', Nome: 'Aeroporto de São Paulo/Congonhas', Pais: 'Brasil' },
        { Iata: 'BSB', Nome: 'Aeroporto Internacional de Brasília', Pais: 'Brasil' },
        { Iata: 'SDU', Nome: 'Aeroporto Santos Dumont', Pais: 'Brasil' },
        { Iata: 'GIG', Nome: 'Aeroporto Internacional do Rio de Janeiro/Galeão', Pais: 'Brasil' },
        { Iata: 'SSA', Nome: 'Aeroporto Internacional de Salvador', Pais: 'Brasil' },
        { Iata: 'FOR', Nome: 'Aeroporto Internacional de Fortaleza', Pais: 'Brasil' },
        { Iata: 'REC', Nome: 'Aeroporto Internacional do Recife', Pais: 'Brasil' },
        { Iata: 'POA', Nome: 'Aeroporto Internacional de Porto Alegre', Pais: 'Brasil' },
        { Iata: 'BEL', Nome: 'Aeroporto Internacional de Belém', Pais: 'Brasil' }
      ];
      
      if (!filtro || filtro.trim().length < 2) {
        return aeroportosFallback.slice(0, 5);
      }
      
      const filtroLower = filtro.toLowerCase().trim();
      return aeroportosFallback.filter(aeroporto => 
        aeroporto.Nome.toLowerCase().includes(filtroLower) ||
        aeroporto.Iata.toLowerCase().includes(filtroLower)
      );
    }
  },

  /**
   * Busca sugestões de localização para hotéis
   * @param {string} query Termo de busca (nome da cidade ou hotel)
   * @returns {Promise<Array>} Lista de localizações que correspondem à busca
   */
  async buscarLocalizacaoHoteis(query = '') {
    try {
      const response = await this.request({
        method: 'GET',
        endpoint: '/hotel/api/AutocompleteLocation',
        params: {
          Query: query.trim()
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Retorna apenas os dados da resposta ou array vazio em caso de erro
      return response?.Data || [];
    } catch (error) {
      console.error('Erro ao buscar localizações de hotéis:', error);
      // Instead of throwing, return empty array to keep UI working
      return [];
    }
  },

  /**
   * Busca hotéis disponíveis conforme documentação oficial da Moblix
   * @param {Object} params Parâmetros da busca
   * @param {string} [params.city] Nome da cidade - conforme documentação
   * @param {string} params.checkin Data de check-in no formato 'YYYY-MM-DD'
   * @param {string} params.checkout Data de check-out no formato 'YYYY-MM-DD'
   * @param {number} [params.guests=2] Número de hóspedes (padrão: 2)
   * @param {number} [params.rooms=1] Número de quartos (padrão: 1)
   * @returns {Promise<Object>} Dados dos hotéis encontrados
   */
  async buscarDisponibilidadeHoteis({
    city,
    checkin,
    checkout,
    adults = 2,
    guests = 2,
    rooms = 1,
    childrenAges = [],
    currency = 'BRL',
    idLocation,
    retryCount = 0
  } = {}) {
    try {
      console.log('=== BUSCA DE HOTÉIS - API MOBLIX ===');
      console.log('Parâmetros recebidos:', { city, checkin, checkout, adults, guests, rooms, idLocation });
      
      // MODO DEMO: Se não conseguirmos autenticar, retorna dados simulados
      const DEMO_MODE = false; // Altere para false quando as credenciais estiverem corretas
      
      if (DEMO_MODE) {
        console.log('🎭 MODO DEMO ATIVADO - Retornando dados simulados');
        
        // Simula delay da API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const locationText = city || idLocation || 'Brasil';
        const mockHotels = [
          {
            HotelId: 'HTL001',
            Name: `Hotel Premium ${locationText}`,
            Category: 5,
            Address: {
              City: city || 'São Paulo',
              Country: 'Brasil',
              Address: 'Av. Paulista, 1000'
            },
            Description: 'Hotel de luxo com vista panorâmica da cidade, oferecendo o melhor em conforto e elegância.',
            Images: [
              { Url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' }
            ],
            Amenities: ['Wi-Fi', 'Piscina', 'Academia', 'SPA', 'Restaurante'],
            BestPrice: { Amount: 450.00 }
          },
          {
            HotelId: 'HTL002',
            Name: `Hotel Executivo ${locationText}`,
            Category: 4,
            Address: {
              City: city || 'São Paulo',
              Country: 'Brasil',
              Address: 'Rua Augusta, 500'
            },
            Description: 'Hotel moderno ideal para viajantes de negócios, com todas as comodidades necessárias.',
            Images: [
              { Url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800' }
            ],
            Amenities: ['Wi-Fi', 'Centro de Negócios', 'Estacionamento'],
            BestPrice: { Amount: 280.00 }
          },
          {
            HotelId: 'HTL003',
            Name: `Pousada Aconchegante ${locationText}`,
            Category: 3,
            Address: {
              City: city || 'São Paulo',
              Country: 'Brasil',
              Address: 'Rua das Flores, 123'
            },
            Description: 'Acomodação charmosa e aconchegante, perfeita para uma estadia relaxante.',
            Images: [
              { Url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800' }
            ],
            Amenities: ['Wi-Fi', 'Café da manhã', 'Jardim'],
            BestPrice: { Amount: 180.00 }
          }
        ];
        
        console.log(`✅ DEMO: ${mockHotels.length} hotéis simulados gerados para ${locationText}`);
        
        return {
          Success: true,
          Data: mockHotels,
          Message: 'Dados simulados para demonstração'
        };
      }
      
      // Validação dos parâmetros obrigatórios conforme documentação
      if (!checkin) {
        throw new Error('A data de check-in é obrigatória');
      }
      
      if (!checkout) {
        throw new Error('A data de check-out é obrigatória');
      }
      
      // Garante que o número de hóspedes é válido
      const numGuests = Math.max(1, parseInt(guests || adults, 10) || 2);
      
      // Valida as datas
      const checkInDate = new Date(checkin);
      const checkOutDate = new Date(checkout);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (isNaN(checkInDate.getTime())) {
        throw new Error('Data de check-in inválida. Use o formato YYYY-MM-DD');
      }
      
      if (isNaN(checkOutDate.getTime())) {
        throw new Error('Data de check-out inválida. Use o formato YYYY-MM-DD');
      }
      
      if (checkInDate < today) {
        throw new Error('A data de check-in não pode ser anterior ao dia atual');
      }
      
      if (checkOutDate <= checkInDate) {
        throw new Error('A data de check-out deve ser posterior à data de check-in');
      }
      
      // Prepara parâmetros conforme API real da Moblix
      const roomConfig = {
        Adts: numGuests,
        ChildAge: Array.isArray(childrenAges) ? childrenAges : []
      };
      
      const requestParams = {
        Checkin: checkin,
        Checkout: checkout,
        Rooms: JSON.stringify(roomConfig),
        Currency: 'BRL'
      };
      
      // Adiciona ID da localização se fornecido
      if (idLocation && typeof idLocation === 'string' && idLocation.trim() !== '') {
        requestParams.IdLocation = idLocation.trim();
        console.log(`Buscando hotéis na localização: ${idLocation.trim()}`);
      } else if (city && typeof city === 'string' && city.trim() !== '') {
        // Se temos cidade mas não ID, tenta buscar sem filtro específico
        console.log(`Buscando hotéis em: ${city.trim()} (sem filtro de localização específica)`);
      } else {
        console.log('Buscando hotéis sem filtro de localização');
      }
      
      console.log('Parâmetros da requisição:', {
        ...requestParams,
        Rooms: `Adults: ${numGuests}, Children: ${childrenAges.length}`
      });
      
      try {
        // Faz a requisição para a API usando o endpoint real da Moblix
        const response = await this.request({
          method: 'GET',
          endpoint: '/hotel/api/Availability',
          params: requestParams,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 segundos
        });

        console.log('Resposta recebida da API:', response ? 'OK' : 'VAZIA');

        // Verifica se a resposta é válida
        if (!response) {
          throw new Error('Não foi recebida uma resposta válida da API');
        }

        // Verifica se a resposta indica sucesso (API Moblix real)
        if (response.Success) {
          const hotels = response.Data || [];
          console.log(`Busca concluída com sucesso. ${hotels.length} hotéis encontrados.`);
          
          // A API da Moblix já retorna no formato correto
          return response;
        } else {
          // Trata resposta de erro da API Moblix
          const errorCode = response.CodigoErro || 'UNKNOWN_ERROR';
          const errorMessage = response.MensagemErro || 'Erro desconhecido ao buscar hotéis';
          const errorDetails = response.ExErro || 'Sem detalhes adicionais';
          
          console.error('Erro na resposta da API:', {
            errorCode,
            errorMessage,
            errorDetails
          });
          
          throw new Error(errorMessage);
        }
        
      } catch (requestError) {
        console.error('Erro na requisição de hotéis:', requestError);
        
        // Se for erro 500, pode ser problema de parâmetros
        if (requestError.response?.status === 500) {
          throw new Error('Erro interno do servidor. Verifique os parâmetros de busca.');
        }
        
        // Para outros erros de requisição, lança o erro original
        throw requestError;
      }
      
    } catch (error) {
      console.error('Erro ao buscar hotéis:', error);
      throw error;
    }
  },

  /**
   * Cria uma reserva de hotel
   * @param {Object} params Parâmetros da reserva
   * @param {Object} params.availability Objeto de disponibilidade retornado na busca de hotéis
   * @param {number} params.offerId ID da oferta (quarto) selecionado
   * @param {Array<Object>} params.hospedes Lista de hóspedes
   * @param {Object} params.pagador Informações do pagador
   * @param {string} params.requestId ID único para a requisição (GUID)
   * @param {Object} [params.cartao] Dados do cartão de crédito (opcional)
   * @returns {Promise<Object>} Dados da reserva criada
   */
  async criarReservaHotel({ 
    availability, 
    offerId, 
    hospedes, 
    pagador, 
    requestId, 
    cartao = null 
  }) {
    // Validação dos parâmetros obrigatórios
    if (!availability || !offerId || !hospedes || !pagador || !requestId) {
      throw new Error('Todos os parâmetros obrigatórios devem ser fornecidos');
    }


    // Prepara o objeto de pagamento
    const pagamento = {
      Payer: {
        Name: pagador.nome,
        Email: pagador.email,
        Phones: [
          {
            DDI: pagador.telefone?.ddi || '55',
            DDD: pagador.telefone?.ddd,
            number: pagador.telefone?.numero
          }
        ],
        Birthdate: pagador.dataNascimento,
        Address: {
          street: pagador.endereco?.rua,
          number: pagador.endereco?.numero,
          additional_details: pagador.endereco?.complemento || null,
          zipcode: pagador.endereco?.cep,
          neighborhood: pagador.endereco?.bairro,
          city: pagador.endereco?.cidade,
          state: pagador.endereco?.estado,
          country: pagador.endereco?.pais || 'Brasil'
        },
        Document: pagador.documento
      },
      PaymentCard: cartao ? {
        CardType: cartao.tipo,
        CardHolderName: cartao.nomeTitular,
        CardNumber: cartao.numero,
        CardCode: cartao.codigoSeguranca,
        CardExpiration: cartao.validade
      } : null
    };

    // Remove o cartão de pagamento se não for fornecido
    if (!cartao) {
      delete pagamento.PaymentCard;
    }

    // Prepara o objeto da requisição
    const dadosRequisicao = {
      Availability: availability,
      OfferId: offerId,
      RoomGuest: [{
        Guests: hospedes.map(hospede => ({
          FirstName: hospede.nome,
          LastName: hospede.sobrenome,
          Title: hospede.titulo,
          IsMain: hospede.ehPrincipal,
          ChildAge: hospede.idadeCrianca,
          DocumentNumber: hospede.documento,
          BirthDate: hospede.dataNascimento
        }))
      }],
      RequestId: requestId,
      Payment: pagamento
    };

    return this.request({
      method: 'POST',
      endpoint: '/hotel/api/Booking',
      data: dadosRequisicao,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  },

  /**
   * Cancela uma reserva de hotel existente
   * @param {string} bookingCode Código da reserva a ser cancelada
   * @returns {Promise<Object>} Resposta da API de cancelamento
   */
  async cancelarReservaHotel(bookingCode) {
    if (!bookingCode) {
      throw new Error('O código da reserva é obrigatório');
    }

    return this.request({
      method: 'DELETE',
      endpoint: `/hotel/api/Booking?bookingCode=${encodeURIComponent(bookingCode)}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  },

  /**
   * Cria um novo pedido
   * @param {Object} dadosPedido Dados do pedido a ser criado
   * @param {number} dadosPedido.IdAgency ID da agência
   * @param {number} dadosPedido.IdPerson ID da pessoa
   * @returns {Promise<Object>} Dados do pedido criado
   */
  async criarPedido({ IdAgency, IdPerson } = {}) {
    if (!IdAgency || !IdPerson) {
      throw new Error('ID da agência e ID da pessoa são obrigatórios');
    }

    return this.request({
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
   * @param {Object} params Parâmetros da consulta
   * @param {number} [params.id] ID do pedido (opcional)
   * @param {number} [params.idPipeline=0] ID da negociação
   * @param {number} [params.pageNumber=1] Número da página
   * @param {number} [params.pageSize=10] Quantidade de itens por página
   * @param {number} [params.idStatus=0] ID do status do pedido
   * @param {boolean} [params.listBudget=false] Se true, lista orçamentos; se false, lista pedidos
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
    return this.request({
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
   * Lista o estoque de um produto específico
   * @param {number} idProduct ID do produto para consultar o estoque
   * @returns {Promise<Object>} Dados de estoque do produto
   */
  async listarEstoque(idProduct) {
    if (!idProduct) {
      throw new Error('ID do produto é obrigatório');
    }

    return this.request({
      method: 'GET',
      endpoint: `/api/inventory/${idProduct}`,
      headers: {
        'Accept': 'application/json'
      }
    });
  },

  /**
   * Obtém informações detalhadas de um hotel específico
   * @param {Object} params Parâmetros da requisição
   * @param {string} params.hotelSearchCode Código único do hotel obtido na busca
   * @param {string} [params.language='pt-BR'] Idioma para as informações do hotel
   * @returns {Promise<Object>} Dados detalhados do hotel
   */
  async getHotelInformation({ hotelSearchCode, language = 'pt-BR' } = {}) {
    if (!hotelSearchCode) {
      throw new Error('O código de busca do hotel é obrigatório');
    }

    return this.request({
      method: 'POST',
      endpoint: '/hotel/api/HotelInformation',
      data: {
        hotelSearchCode,
        language
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  },

  /**
   * Cria um novo pedido na API Moblix
   * @param {Object} orderData Dados do pedido a ser criado
   * @param {number} orderData.Id ID único do pedido
   * @param {string} orderData.RequestId ID único da requisição (GUID)
   * @param {number} orderData.IdAgency ID da agência
   * @param {number} orderData.IdPerson ID da pessoa
   * @param {number} orderData.IdStatus ID do status (1=Pendente, 2=Confirmado, 3=Cancelado, etc.)
   * @param {number} orderData.IdProduct ID do produto
   * @param {number} orderData.IdTypeProduct Tipo do produto (1=Voo, 2=Hotel, 3=Carro, etc.)
   * @param {number} orderData.IdProvider ID do fornecedor
   * @param {string} orderData.ProviderName Nome do fornecedor
   * @param {number} orderData.BasePrice Preço base
   * @param {number} orderData.Tax Taxa
   * @param {number} orderData.ServiceFee Taxa de serviço
   * @param {number} orderData.TotalPrice Preço total
   * @param {string} orderData.Currency Moeda (ex: 'BRL')
   * @param {string} orderData.BookingCode Código da reserva
   * @param {Object} orderData.Payer Dados do pagador
   * @param {string} orderData.Payer.Name Nome do pagador
   * @param {string} orderData.Payer.Email Email do pagador
   * @param {string} orderData.Payer.Document Documento do pagador
   * @param {string} orderData.Payer.Birthdate Data de nascimento (YYYY-MM-DD)
   * @param {Array} orderData.Payer.Phones Lista de telefones
   * @param {Object} orderData.Payer.Address Endereço do pagador
   * @param {Array} [orderData.Passengers] Lista de passageiros (para voos)
   * @param {Array} [orderData.Guests] Lista de hóspedes (para hotéis)
   * @param {Object} [orderData.PaymentCard] Dados do cartão de pagamento
   * @param {string} [orderData.PaymentCard.CardType] Tipo do cartão
   * @param {string} [orderData.PaymentCard.CardHolderName] Nome do titular
   * @param {string} [orderData.PaymentCard.CardNumber] Número do cartão
   * @param {string} [orderData.PaymentCard.CardCode] Código de segurança
   * @param {string} [orderData.PaymentCard.CardExpiration] Data de expiração (MM/YY)
   * @param {string} [orderData.Notes] Observações adicionais
   * @param {string} [orderData.CreatedAt] Data de criação (ISO 8601)
   * @param {string} [orderData.UpdatedAt] Data de atualização (ISO 8601)
   * @returns {Promise<Object>} Dados do pedido criado
   */
  async createOrder(orderData) {
    // Validações dos campos obrigatórios
    const requiredFields = ['Id', 'RequestId', 'IdAgency', 'IdPerson', 'IdStatus', 'Payer'];
    const missingFields = requiredFields.filter(field => !orderData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
    }

    // Validações específicas do pagador
    if (!orderData.Payer.Name || !orderData.Payer.Email || !orderData.Payer.Document) {
      throw new Error('Nome, email e documento do pagador são obrigatórios');
    }

    // Gera RequestId se não fornecido
    if (!orderData.RequestId) {
      orderData.RequestId = this.generateGUID();
    }

    // Adiciona timestamps se não fornecidos
    const now = new Date().toISOString();
    if (!orderData.CreatedAt) {
      orderData.CreatedAt = now;
    }
    if (!orderData.UpdatedAt) {
      orderData.UpdatedAt = now;
    }

    console.log('📋 Criando pedido na API Moblix:', {
      Id: orderData.Id,
      RequestId: orderData.RequestId,
      IdAgency: orderData.IdAgency,
      IdPerson: orderData.IdPerson,
      TotalPrice: orderData.TotalPrice,
      Currency: orderData.Currency
    });

    try {
      const response = await this.request({
        method: 'POST',
        endpoint: '/order/api/order',
        data: orderData,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('✅ Pedido criado com sucesso:', response);
      return response;
    } catch (error) {
      console.error('❌ Erro ao criar pedido:', error);
      throw error;
    }
  },

  /**
   * Gera um GUID único para usar como RequestId
   * @returns {string} GUID no formato xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
   */
  generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
};

export default moblixApiService;
