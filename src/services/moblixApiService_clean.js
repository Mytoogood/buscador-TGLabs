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
   * Busca sugestÃµes de localizaÃ§Ã£o para hotÃ©is
   * @param {string} query Termo de busca (nome da cidade ou hotel)
   * @returns {Promise<Array>} Lista de localizaÃ§Ãµes que correspondem Ã  busca
   */
  async buscarLocalizacaoHoteis(query = '') {
    try {
      const response = await this.request({
        method: 'GET',
        endpoint: `/hotel/api/AutocompleteLocation?Query=${encodeURIComponent(query)}`,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Retorna apenas os dados da resposta ou array vazio em caso de erro
      return response?.Data || [];
    } catch (error) {
      console.error('Erro ao buscar localizaÃ§Ãµes de hotÃ©is:', error);
      throw error;
    }
  },

  /**
   * Busca disponibilidade de hotÃ©is
   * @param {Object} params ParÃ¢metros da busca
   * @param {string} [params.idLocation] ID da localizaÃ§Ã£o (CityId) - opcional
   * @param {string} params.checkin Data de check-in no formato 'YYYY-MM-DD'
   * @param {string} params.checkout Data de check-out no formato 'YYYY-MM-DD'
   * @param {number} [params.adults=2] NÃºmero de adultos (padrÃ£o: 2)
   * @param {Array<number>} [params.childrenAges=[]] Idades das crianÃ§as
   * @param {string} [currency='BRL'] Moeda para os preÃ§os
   * @returns {Promise<Object>} Dados de disponibilidade dos hotÃ©is
   */
  async buscarDisponibilidadeHoteis({
    idLocation,
    checkin,
    checkout,
    adults = 2,
    childrenAges = [],
    currency = 'BRL'
  } = {}) {
    try {
      // ValidaÃ§Ã£o dos parÃ¢metros obrigatÃ³rios
      if (!checkin) {
        throw new Error('A data de check-in Ã© obrigatÃ³ria');
      }
      
      if (!checkout) {
        throw new Error('A data de check-out Ã© obrigatÃ³ria');
      }
      
      // Garante que o nÃºmero de adultos Ã© um nÃºmero vÃ¡lido e pelo menos 1
      const numAdults = Math.max(1, parseInt(adults, 10) || 1);
      
      if (isNaN(numAdults) || numAdults < 1) {
        throw new Error('O nÃºmero de adultos deve ser pelo menos 1');
      }
      
      if (numAdults > 8) {
        throw new Error('O nÃºmero mÃ¡ximo de adultos por quarto Ã© 8');
      }
      
      // Valida as datas
      const checkInDate = new Date(checkin);
      const checkOutDate = new Date(checkout);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (isNaN(checkInDate.getTime())) {
        throw new Error('Data de check-in invÃ¡lida. Use o formato YYYY-MM-DD');
      }
      
      if (isNaN(checkOutDate.getTime())) {
        throw new Error('Data de check-out invÃ¡lida. Use o formato YYYY-MM-DD');
      }
      
      if (checkInDate < today) {
        throw new Error('A data de check-in nÃ£o pode ser anterior ao dia atual');
      }
      
      if (checkOutDate <= checkInDate) {
        throw new Error('A data de check-out deve ser posterior Ã  data de check-in');
      }
      
      // Valida o perÃ­odo mÃ¡ximo de estadia (30 dias)
      const maxStayDays = 30;
      const diffTime = Math.abs(checkOutDate - checkInDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > maxStayDays) {
        throw new Error(`O perÃ­odo mÃ¡ximo de estadia Ã© de ${maxStayDays} dias`);
      }
      
      // Prepara as idades das crianÃ§as
      const processedChildrenAges = [];
      if (Array.isArray(childrenAges)) {
        childrenAges.forEach((age, index) => {
          const ageNum = parseInt(age, 10);
          if (!isNaN(ageNum) && ageNum > 0) {
            if (ageNum > 17) {
              console.warn(`CrianÃ§a na posiÃ§Ã£o ${index} tem ${ageNum} anos, que Ã© considerado adulto.`);
            } else if (ageNum > 0) {
              processedChildrenAges.push(ageNum);
            }
          }
        });
      }
      
      console.log(`Idades das crianÃ§as processadas (${processedChildrenAges.length}):`, processedChildrenAges);

      // Verifica o nÃºmero total de hÃ³spedes (adultos + crianÃ§as)
      const totalGuests = numAdults + processedChildrenAges.length;
      const maxGuestsPerRoom = 6; // Limite mÃ¡ximo de hÃ³spedes por quarto
      
      if (totalGuests > maxGuestsPerRoom) {
        throw new Error(
          `O nÃºmero mÃ¡ximo de hÃ³spedes por quarto Ã© ${maxGuestsPerRoom} ` +
          `(atualmente ${numAdults} adultos e ${processedChildrenAges.length} crianÃ§as)`
        );
      }

      // Prepara o objeto de quarto no formato esperado pela API
      const roomData = {
        Adts: numAdults,  // Note o uso de 'Adts' em vez de 'Adults'
        ChildAge: processedChildrenAges  // Note o uso de 'ChildAge' em vez de 'ChildrenAges'
      };

      console.log('Quarto preparado:', JSON.stringify(roomData, null, 2));

      // Prepara os parÃ¢metros da requisiÃ§Ã£o
      const requestParams = {
        IdLocation: idLocation,  // Adiciona IdLocation como parÃ¢metro da URL
        Checkin: checkin,
        Checkout: checkout,
        Rooms: JSON.stringify(roomData),  // Envia como string JSON
        Currency: currency.toUpperCase()
      };
      
      // Adiciona o ID da localizaÃ§Ã£o apenas se estiver disponÃ­vel
      if (idLocation) {
        if (typeof idLocation === 'string' && idLocation.trim() !== '') {
          requestParams.IdLocation = idLocation.trim();
          console.log('ID da localizaÃ§Ã£o incluÃ­do na requisiÃ§Ã£o:', `${idLocation.substring(0, 4)}...`);
        } else {
          console.warn('ID de localizaÃ§Ã£o invÃ¡lido, serÃ¡ ignorado:', idLocation);
        }
      } else {
        throw new Error('ID da localizaÃ§Ã£o Ã© obrigatÃ³rio');
      }
      
      // Garante que IdLocation seja uma string antes de chamar substring
      const idLocationForLog = requestParams.IdLocation ? 
        (typeof requestParams.IdLocation === 'string' ? 
          `${requestParams.IdLocation.substring(0, 4)}...` : 
          String(requestParams.IdLocation).substring(0, 4) + '...') : 
        'nÃ£o informado';

      console.log('ParÃ¢metros da requisiÃ§Ã£o:', {
        ...requestParams,
        IdLocation: idLocationForLog,
        Rooms: requestParams.Rooms // JÃ¡ estÃ¡ em formato string
      });

      // ConstrÃ³i a URL com os parÃ¢metros para garantir que esteja no formato correto
      const queryParams = new URLSearchParams();
      
      // Adiciona cada parÃ¢metro Ã  URL
      Object.entries(requestParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      
      const url = `/hotel/api/Availability?${queryParams.toString()}`;
      
      console.log('URL da requisiÃ§Ã£o:', url);
      
      console.log('Fazendo requisiÃ§Ã£o para a API de disponibilidade...');
      
      try {
        // Faz a requisiÃ§Ã£o para a API usando GET
        const response = await this.request({
          method: 'GET',
          endpoint: url,
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            ...auth.getAuthHeader() // Usa o auth module para obter o cabeÃ§alho de autenticaÃ§Ã£o
          },
          timeout: 30000 // 30 segundos de timeout
        });

        console.log('Resposta recebida da API de disponibilidade:', response ? 'OK' : 'VAZIA');

        // Verifica se a resposta Ã© vÃ¡lida
        if (!response) {
          throw new Error('NÃ£o foi recebida uma resposta vÃ¡lida da API');
        }

        // Verifica se a resposta indica sucesso
        if (!response.Success) {
          const errorCode = response.CodigoErro || 'UNKNOWN_ERROR';
          const errorMessage = response.MensagemErro || 'Erro desconhecido ao buscar disponibilidade de hotÃ©is';
          const errorDetails = response.ExErro || response.ExceptionErro || 'Sem detalhes adicionais';
          
          console.error('Erro na resposta da API de disponibilidade:', {
            errorCode,
            errorMessage,
            errorDetails,
            response: JSON.stringify(response, null, 2)
          });
          
          // Verifica se o erro Ã© relacionado Ã  integraÃ§Ã£o
          if (errorMessage.includes('integracao') || (errorDetails && errorDetails.includes('integracao'))) {
            console.error('Erro de integraÃ§Ã£o detectado. Verifique se o serviÃ§o de hotÃ©is estÃ¡ ativo e configurado corretamente.');
            // Aqui vocÃª pode adicionar lÃ³gica adicional para lidar com erros de integraÃ§Ã£o
          }
          
          // Mapeia cÃ³digos de erro conhecidos para mensagens mais amigÃ¡veis
          const errorMappings = {
            'NO_AVAILABILITY': 'Nenhum hotel disponÃ­vel para os critÃ©rios informados',
            'INVALID_PARAMETERS': 'ParÃ¢metros de busca invÃ¡lidos',
            'AUTH_FAILED': 'Falha na autenticaÃ§Ã£o com o provedor de hotÃ©is',
            'RATE_LIMIT_EXCEEDED': 'Limite de requisiÃ§Ãµes excedido. Tente novamente mais tarde.',
            'INTEGRATION_ERROR': 'Erro na integraÃ§Ã£o com o serviÃ§o de hotÃ©is. Por favor, tente novamente mais tarde.'
          };
          
          const friendlyMessage = errorMappings[errorCode] || errorMessage;
          throw new Error(friendlyMessage);
      }

      // Garante que a resposta tenha a estrutura esperada
      if (!response.Data) {
        console.warn('A resposta da API nÃ£o contÃ©m dados de hotÃ©is, retornando array vazio');
        return { ...response, Data: [] };
      }

      console.log(`Busca concluÃ­da com sucesso. ${response.Data.length} hotÃ©is encontrados.`);
      return response;
      
    } catch (error) {
      console.error('Erro ao buscar disponibilidade de hotÃ©is:', error);
      
      // Retorna um objeto de erro consistente
      return {
        MensagemErro: error.message || 'Erro ao buscar disponibilidade de hotÃ©is',
        Data: null
      };
    }
  },



  // Fechamento da funÃ§Ã£o buscarDisponibilidadeHoteis

  /**
   * Cria uma reserva de hotel
   * @param {Object} params ParÃ¢metros da reserva
   * @param {Object} params.availability Objeto de disponibilidade retornado na busca de hotÃ©is
   * @param {number} params.offerId ID da oferta (quarto) selecionado
   * @param {Array<Object>} params.hospedes Lista de hÃ³spedes
   * @param {Object} params.pagador InformaÃ§Ãµes do pagador
   * @param {string} params.requestId ID Ãºnico para a requisiÃ§Ã£o (GUID)
   * @param {Object} [params.cartao] Dados do cartÃ£o de crÃ©dito (opcional)
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
    // ValidaÃ§Ã£o dos parÃ¢metros obrigatÃ³rios
    if (!availability || !offerId || !hospedes || !pagador || !requestId) {
      throw new Error('Todos os parÃ¢metros obrigatÃ³rios devem ser fornecidos');
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

    // Remove o cartÃ£o de pagamento se nÃ£o for fornecido
    if (!cartao) {
      delete pagamento.PaymentCard;
    }

    // Prepara o objeto da requisiÃ§Ã£o
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
   * @param {string} bookingCode CÃ³digo da reserva a ser cancelada
   * @returns {Promise<Object>} Resposta da API de cancelamento
   */
  async cancelarReservaHotel(bookingCode) {
    if (!bookingCode) {
      throw new Error('O cÃ³digo da reserva Ã© obrigatÃ³rio');
    }

    return request({
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

  /**
   * ObtÃ©m informaÃ§Ãµes detalhadas de um hotel especÃ­fico
   * @param {Object} params ParÃ¢metros da requisiÃ§Ã£o
   * @param {string} params.hotelSearchCode CÃ³digo Ãºnico do hotel obtido na busca
   * @param {string} [params.language='pt-BR'] Idioma para as informaÃ§Ãµes do hotel
   * @returns {Promise<Object>} Dados detalhados do hotel
   */
  async getHotelInformation({ hotelSearchCode, language = 'pt-BR' } = {}) {
    if (!hotelSearchCode) {
      throw new Error('O cÃ³digo de busca do hotel Ã© obrigatÃ³rio');
    }

    return request({
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
