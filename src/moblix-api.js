/**
 * API da Moblix - Sistema de gestão de viagens e bilhetes aéreos
 * Baseado na documentação oficial da Moblix
 */

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configurações da API
const API_CONFIG = {
  baseUrl: 'https://api.moblix.com.br/moblix-api/api',
  version: '1.0.0',
  secretKey: 'moblix-secret-key-2024'
};

// Dados simulados para demonstração
let bilhetes = [];
let bookings = [];
let experiences = [];

// Middleware de autenticação Bearer Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      Success: false,
      Erro: 'TOKEN_REQUIRED',
      MensagemErro: 'Token de acesso é obrigatório'
    });
  }

  jwt.verify(token, API_CONFIG.secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({
        Success: false,
        Erro: 'INVALID_TOKEN',
        MensagemErro: 'Token inválido ou expirado'
      });
    }
    req.user = user;
    next();
  });
};

// Endpoint de autenticação para gerar Bearer Token
app.post('/auth/login', (req, res) => {
  const { mbxUsername, mbxPassword } = req.body;

  // Validação básica (em produção, validar com banco de dados)
  if (!mbxUsername || !mbxPassword) {
    return res.status(400).json({
      Success: false,
      Erro: 'CREDENTIALS_REQUIRED',
      MensagemErro: 'Username e password são obrigatórios'
    });
  }

  // Simular validação de credenciais
  if (mbxUsername === 'TooGood' && mbxPassword === '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7') {
    const token = jwt.sign(
      { username: mbxUsername, userId: 1 },
      API_CONFIG.secretKey,
      { expiresIn: '24h' }
    );

    res.json({
      Success: true,
      Data: {
        bearerToken: token,
        expiresIn: '24h',
        user: {
          username: mbxUsername,
          id: 1
        }
      }
    });
  } else {
    res.status(401).json({
      Success: false,
      Erro: 'INVALID_CREDENTIALS',
      MensagemErro: 'Credenciais inválidas'
    });
  }
});

/**
 * ENDPOINT PRINCIPAL: Criar Bilhete
 * POST /moblix-api/api/Pedido/EmitirPedido
 * 
 * Este endpoint é usado após uma busca bem-sucedida de voos.
 * Registra a intenção de compra do cliente e prepara o processo
 * para pagamento e emissão do bilhete aéreo.
 */
app.post('/moblix-api/api/Pedido/EmitirPedido', authenticateToken, (req, res) => {
  try {
    const {
      RequestId,
      Email,
      IdExterno,
      Passageiros,
      Ida,
      Volta,
      pagante,
      TokenConsultaIda,
      TokenConsultaVolta,
      IdMeioPagamento,
      ValorTotal
    } = req.body;

    // Validações obrigatórias
    if (!Email || !Passageiros || !Ida || !TokenConsultaIda || !IdMeioPagamento) {
      return res.status(400).json({
        TotalItens: 0,
        Completed: false,
        Success: false,
        HasResult: false,
        Erro: 'MISSING_REQUIRED_FIELDS',
        MensagemErro: 'Campos obrigatórios não fornecidos',
        Data: null,
        Token: null
      });
    }

    // Validar meio de pagamento
    const meiosPagamento = {
      3: 'Boleto',
      4: 'Transferência',
      5: 'Na agência',
      6: 'PayPal',
      7: 'Pendente',
      8: 'Pix (indisponível)'
    };

    if (!meiosPagamento[IdMeioPagamento]) {
      return res.status(400).json({
        TotalItens: 0,
        Completed: false,
        Success: false,
        HasResult: false,
        Erro: 'INVALID_PAYMENT_METHOD',
        MensagemErro: 'Meio de pagamento inválido',
        Data: null,
        Token: null
      });
    }

    // Gerar dados do pedido
    const pedidoId = Math.floor(Math.random() * 100000) + 30000;
    const clienteId = Math.floor(Math.random() * 50000) + 30000;
    const viagemId = Math.floor(Math.random() * 50000) + 40000;
    const passageiroId = Math.floor(Math.random() * 60000) + 50000;
    const trechoId = Math.floor(Math.random() * 80000) + 70000;
    const orderId = Math.floor(Math.random() * 40000) + 30000;

    // Criar resposta baseada no exemplo fornecido
    const bilhete = {
      DataInicio: null,
      DataFim: null,
      FiltrarPorDataVoo: false,
      Remover: false,
      RazaoCancel: null,
      Observacao: false,
      Includes: null,
      IdExternoStr: uuidv4(),
      IdsOrders: null,
      ValidadeReserva: null,
      AprovadoKonduto: false,
      TotalTaxaBagagem: 0,
      VouchersAnexo: null,
      VoucherBase64: null,
      StatusPedidoDesc: 1,
      StatusPagamentoDesc: 1,
      Id: pedidoId,
      Adultos: Passageiros.filter(p => p.TipoPassageiro !== 'crianca' && p.TipoPassageiro !== 'bebe').length,
      Criancas: Passageiros.filter(p => p.TipoPassageiro === 'crianca').length,
      Bebes: Passageiros.filter(p => p.TipoPassageiro === 'bebe').length,
      IdStatus: 1,
      Criacao: new Date().toISOString(),
      IdMeioPagamento: IdMeioPagamento,
      UltimaAlteracao: new Date().toISOString(),
      IdParceiro: 8,
      IdFaturaVindi: null,
      IdExterno: parseInt(new Date().toISOString().replace(/\D/g, '').substring(0, 11)),
      Parcelas: 0,
      UrlBoleto: null,
      IdUsuario: null,
      IdCliente: clienteId,
      IdContaBancaria: null,
      IdStatusPagamento: 1,
      IdFaturaPagSeguro: null,
      IdStatusPagamentoPagSeguro: null,
      ValorJuros: null,
      ValorSplit: null,
      IdPedidoTipo: 1,
      PaypalOrderId: null,
      PaypalSubscriptionId: null,
      ReservaFacilToken: null,
      TransactionId: null,
      ReservaFacilLocalizador: null,
      IdPagante: null,
      Observacoes: null,
      IdParceiroRevendedor: null,
      IdOrder: orderId,
      Pessoa: null,
      Cliente: null,
      CupomDescontoUso: [],
      MeioPagamento: null,
      Parceiro: null,
      Passageiro: Passageiros.map(p => ({
        ...p,
        Id: passageiroId + Math.floor(Math.random() * 1000),
        IdPedido: pedidoId,
        Email: null,
        DDI: null,
        DDD: null,
        Telefone: null,
        TipoDocumento: null,
        PaisResidencia: null,
        EmissaoDocumento: null,
        TipoPassageiro: null,
        PaisEmissor: null,
        NumeroDocumento: null,
        ValidadeDocumento: null
      })),
      ProdutoPedido: [],
      Status: null,
      StatusPagamento: null,
      Viagem: [
        {
          TotalTaxaBagagem: 0,
          Id: viagemId,
          IdPedido: pedidoId,
          Volta: false,
          IdCia: 1,
          Localizador: null,
          Eticket: null,
          MilhasAdulto: -1,
          MilhasCrianca: -1,
          ValorAdulto: ValorTotal || 264.63,
          ValorCrianca: 0,
          TaxaServico: 0,
          TaxaEmbarque: 29,
          Milheiro: null,
          QntdBagagem: 0,
          IdCiaOperadora: 1,
          TaxaBagagem: null,
          TaxaEmissaoResgate: 0,
          ValorFranquia: 0,
          QtdBagagemInclusa: 0,
          Cia: {
            Id: 1,
            Nome: "Latam",
            Iata: "LA",
            AtivaBusca: true,
            Icao: "LAN",
            Pais: "Chile",
            DadosCia: [],
            ConfiguracaoBagagem: [],
            CupomDescontoRestricao: [],
            TaxaEmbarque: [],
            Configuracao: [],
            LogResultado: [],
            LogConsulta: [],
            CacheConsulta: [],
            ConfigProxy: [],
            ProgramaFidelidadeTipo: [],
            ApiRequests: [],
            FranqueadoPolitica: [],
            Ids: null,
            _PageNumber: 0,
            PageNumber: 0,
            PageSize: 0,
            OrderBy: null,
            OrderDesc: false
          },
          Trecho: [
            {
              IdaStr: "Data do voo",
              ChegadaStr: "Data de chegada",
              ClasseStr: "Econômica",
              Id: trechoId,
              IataOrigem: "GRU",
              IataDestino: "BSB",
              NumeroVoo: "LA-3261",
              Saida: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              Chegada: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
              IdViagem: viagemId,
              Classe: 0
            }
          ],
          CiaOperadora: {
            Id: 1,
            Nome: "Latam",
            Iata: "LA",
            AtivaBusca: true,
            Icao: "LAN",
            Pais: "Chile",
            DadosCia: [],
            ConfiguracaoBagagem: [],
            CupomDescontoRestricao: [],
            TaxaEmbarque: [],
            Configuracao: [],
            LogResultado: [],
            LogConsulta: [],
            CacheConsulta: [],
            ConfigProxy: [],
            ProgramaFidelidadeTipo: [],
            ApiRequests: [],
            FranqueadoPolitica: [],
            Ids: null,
            _PageNumber: 0,
            PageNumber: 0,
            PageSize: 0,
            OrderBy: null,
            OrderDesc: false
          },
          BagagemViagem: [
            {
              Id: Math.floor(Math.random() * 70000) + 60000,
              IdViagem: viagemId,
              QntdBagagem: 1,
              Valor: 0
            }
          ]
        }
      ],
      Pagante: null,
      ContaBancaria: null,
      CartaoUtilizacao: [],
      ParceiroRevendedor: null,
      ProdutosMoblix: null,
      _PageNumber: 0,
      PageNumber: 0,
      PageSize: 0,
      OrderBy: null,
      OrderDesc: false
    };

    // Adicionar à lista de bilhetes
    bilhetes.push(bilhete);

    // Resposta de sucesso
    res.status(200).json({
      TotalItens: 1,
      Completed: true,
      Success: true,
      HasResult: true,
      Erro: null,
      MensagemErro: null,
      Data: [bilhete],
      Token: null
    });

  } catch (error) {
    console.error('Erro ao processar pedido:', error);
    res.status(500).json({
      TotalItens: 0,
      Completed: false,
      Success: false,
      HasResult: false,
      Erro: 'INTERNAL_SERVER_ERROR',
      MensagemErro: 'Erro interno do servidor',
      Data: null,
      Token: null
    });
  }
});

// Endpoint para listar bilhetes criados
app.get('/moblix-api/api/Pedido/ListarBilhetes', authenticateToken, (req, res) => {
  res.json({
    TotalItens: bilhetes.length,
    Completed: true,
    Success: true,
    HasResult: bilhetes.length > 0,
    Erro: null,
    MensagemErro: null,
    Data: bilhetes,
    Token: null
  });
});

// Endpoints da seção Booking
app.post('/moblix-api/api/Booking/CriarReserva', authenticateToken, (req, res) => {
  const booking = {
    id: uuidv4(),
    ...req.body,
    dataCriacao: new Date().toISOString(),
    status: 'ativo'
  };
  
  bookings.push(booking);
  
  res.json({
    Success: true,
    Data: booking,
    MensagemErro: null
  });
});

app.get('/moblix-api/api/Booking/ListarReservas', authenticateToken, (req, res) => {
  res.json({
    TotalItens: bookings.length,
    Success: true,
    Data: bookings
  });
});

// Endpoints da seção Experiences
app.post('/moblix-api/api/Experiences/CriarExperiencia', authenticateToken, (req, res) => {
  const experience = {
    id: uuidv4(),
    ...req.body,
    dataCriacao: new Date().toISOString(),
    status: 'disponivel'
  };
  
  experiences.push(experience);
  
  res.json({
    Success: true,
    Data: experience,
    MensagemErro: null
  });
});

app.get('/moblix-api/api/Experiences/ListarExperiencias', authenticateToken, (req, res) => {
  res.json({
    TotalItens: experiences.length,
    Success: true,
    Data: experiences
  });
});

// Endpoint de status da API
app.get('/moblix-api/status', (req, res) => {
  res.json({
    status: 'online',
    version: API_CONFIG.version,
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/auth/login',
      criarBilhete: '/moblix-api/api/Pedido/EmitirPedido',
      listarBilhetes: '/moblix-api/api/Pedido/ListarBilhetes',
      booking: '/moblix-api/api/Booking/*',
      experiences: '/moblix-api/api/Experiences/*'
    },
    meiosPagamento: {
      3: 'Boleto',
      4: 'Transferência',
      5: 'Na agência',
      6: 'PayPal',
      7: 'Pendente',
      8: 'Pix (indisponível)'
    }
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    Success: false,
    Erro: 'INTERNAL_SERVER_ERROR',
    MensagemErro: 'Erro interno do servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 API da Moblix rodando na porta ${PORT}`);
  console.log(`📋 Status: http://localhost:${PORT}/moblix-api/status`);
  console.log(`🔐 Autenticação: POST http://localhost:${PORT}/auth/login`);
  console.log(`✈️  Criar Bilhete: POST http://localhost:${PORT}/moblix-api/api/Pedido/EmitirPedido`);
});

export default app;
