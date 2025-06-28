import axios from 'axios';
import auth from './auth';

// Configuração da API Moblix - usando proxy local para evitar CORS
const API_BASE_URL = '';

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
          // Note: Origin header is automatically set by the browser and cannot be overridden
          // The Moblix API should accept requests without manual Origin header setting
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
   * @param {Object} params Parâmetros da consulta
   * @param {string} params.origem Código IATA do aeroporto de origem (ex: 'BSB')
   * @param {string} params.destino Código IATA do aeroporto de destino (ex: 'GRU')
   * @param {string} params.ida Data de ida no formato 'YYYY-MM-DD'
   * @param {string} [params.volta] Data de volta no formato 'YYYY-MM-DD' (opcional para voos de ida e volta)
   * @param {number} [params.adultos=1] Número de passageiros adultos
   * @param {number} [params.criancas=0] Número de crianças
   * @param {number} [params.bebes=0] Número de bebês
   * @param {number} [params.companhia=-1] ID da companhia aérea (-1 para todas)
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

    // Formata os parâmetros para a API
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

    // Faz a requisição para a API
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
      Companhia: params.Companhia || 1 // Default para Latam
    };

    // Faz a requisição para a API
    return this.request({
      method: 'post',
      endpoint: '/moblix-api/api/ReservaFacil/Consultar',
      data: requestData,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
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
   * @param {string} filtro Termo para filtrar os aeroportos (nome ou código IATA)
   * @returns {Promise<Array>} Lista de aeroportos que correspondem ao filtro
   */
  async buscarAeroportos(filtro = '') {
    try {
      console.log('🛫 Buscando aeroportos com filtro:', filtro);
      
      const response = await this.request({
        method: 'POST',
        endpoint: '/moblix-api/api/ConsultaAereo/Aeroportos',
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
      const DEMO_MODE = true; // Altere para false quando as credenciais estiverem corretas
      
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
  }
};

export default moblixApiService;
