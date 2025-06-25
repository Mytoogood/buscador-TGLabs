# API da Moblix - Documentação Completa

## 📋 Visão Geral

Esta é uma implementação da API da Moblix baseada na documentação oficial. A API oferece funcionalidades para gestão de viagens e bilhetes aéreos, incluindo autenticação, criação de bilhetes, reservas e experiências.

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 14+ instalado
- npm ou yarn
- PowerShell ou terminal

### Dependências Necessárias
```bash
npm install express cors jsonwebtoken uuid
```

### Executar a API
```bash
# Método 1: Usando o script de inicialização
node start-moblix-api.js

# Método 2: Executar diretamente
node src/moblix-api.js
```

## 🔐 Autenticação

### Credenciais de Teste
- **Username:** `TooGood`
- **Password:** `23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7`

### Obter Bearer Token
```http
POST /auth/login
Content-Type: application/json

{
  "mbxUsername": "TooGood",
  "mbxPassword": "23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7"
}
```

**Resposta de Sucesso:**
```json
{
  "Success": true,
  "Data": {
    "bearerToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": "24h",
    "user": {
      "username": "TooGood",
      "id": 1
    }
  }
}
```

## 📍 Endpoints Principais

### 1. Status da API
```http
GET /moblix-api/status
```
Verifica o status e configurações da API.

### 2. Criar Bilhete (Endpoint Principal)
```http
POST /moblix-api/api/Pedido/EmitirPedido
Authorization: Bearer {token}
Content-Type: application/json
```

**Exemplo de Payload:**
```json
{
  "RequestId": "Teste-api",
  "Email": "testemoblix@gmail.com",
  "IdExterno": "",
  "Passageiros": [
    {
      "Email": "testemoblix@gmail.com",
      "DDI": "55",
      "DDD": "61",
      "Telefone": "999999999",
      "TipoDocumento": "cpf",
      "Id": 0,
      "Nome": "João Silva",
      "Sobrenome": "Santos",
      "Nascimento": "1987-04-21T00:00:00-03:00",
      "Cpf": "11901654060",
      "Sexo": "M"
    }
  ],
  "Ida": {
    "Token": "fa1f1ab21aae4105ab0af2c3f658d7d8"
  },
  "Volta": {
    "Token": "d176e0f3eb5a41f9a240e346c134884a"
  },
  "pagante": {
    "id": 0,
    "name": "João Silva Santos",
    "address": {
      "street": "Rua das Flores",
      "number": "123",
      "additional_details": "Apt 101",
      "zipcode": "01234567",
      "neighborhood": "Centro",
      "city": "São Paulo",
      "state": "SP",
      "country": "Brasil"
    },
    "phones": [
      {
        "DDD": "11",
        "DDI": "55",
        "number": "987654321"
      }
    ],
    "Nascimento": "1987-04-21T00:00:00-03:00"
  },
  "TokenConsultaIda": "8_Gol_55f0fc93f46242c1a22c734ff2654a73",
  "TokenConsultaVolta": "8_Gol_55f0fc93f46242c1a22c734ff2654a73",
  "IdMeioPagamento": 4,
  "ValorTotal": 850.50
}
```

### 3. Listar Bilhetes
```http
GET /moblix-api/api/Pedido/ListarBilhetes
Authorization: Bearer {token}
```

### 4. Booking - Criar Reserva
```http
POST /moblix-api/api/Booking/CriarReserva
Authorization: Bearer {token}
Content-Type: application/json
```

### 5. Booking - Listar Reservas
```http
GET /moblix-api/api/Booking/ListarReservas
Authorization: Bearer {token}
```

### 6. Experiences - Criar Experiência
```http
POST /moblix-api/api/Experiences/CriarExperiencia
Authorization: Bearer {token}
Content-Type: application/json
```

### 7. Experiences - Listar Experiências
```http
GET /moblix-api/api/Experiences/ListarExperiencias
Authorization: Bearer {token}
```

## 💳 Meios de Pagamento Suportados

| ID | Descrição |
|----|-----------|
| 3  | Boleto |
| 4  | Transferência |
| 5  | Na agência |
| 6  | PayPal |
| 7  | Pendente |
| 8  | Pix (indisponível) |

## 🧪 Testando a API

### Usando o Script de Teste
```bash
node test-moblix-api.js
```

Este script executa:
1. ✅ Verificação do status da API
2. 🔐 Autenticação e obtenção do Bearer Token
3. ✈️ Criação de um bilhete de exemplo
4. 📋 Listagem de todos os bilhetes criados

### Testando Manualmente com cURL

**1. Fazer Login:**
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "mbxUsername": "TooGood",
    "mbxPassword": "23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7"
  }'
```

**2. Criar Bilhete:**
```bash
curl -X POST http://localhost:3001/moblix-api/api/Pedido/EmitirPedido \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {SEU_TOKEN_AQUI}" \
  -d @exemplo-bilhete.json
```

## 📁 Estrutura dos Arquivos

```
API_VISUAL_DEMO/
├── src/
│   └── moblix-api.js           # Código principal da API
├── start-moblix-api.js         # Script para iniciar a API
├── test-moblix-api.js          # Script para testar a API
├── MOBLIX_API_README.md        # Esta documentação
└── package.json                # Dependências do projeto
```

## 🔧 Configurações

### Variáveis de Ambiente
```env
PORT=3001                      # Porta da API
JWT_SECRET=moblix-secret-key-2024  # Chave secreta para JWT
```

### Configurações da API
- **Base URL:** `http://localhost:3001`
- **Versão:** `1.0.0`
- **Timeout do Token:** `24 horas`

## 📊 Estrutura de Resposta Padrão

### Sucesso
```json
{
  "TotalItens": 1,
  "Completed": true,
  "Success": true,
  "HasResult": true,
  "Erro": null,
  "MensagemErro": null,
  "Data": [...],
  "Token": null
}
```

### Erro
```json
{
  "TotalItens": 0,
  "Completed": false,
  "Success": false,
  "HasResult": false,
  "Erro": "CODIGO_DO_ERRO",
  "MensagemErro": "Descrição do erro",
  "Data": null,
  "Token": null
}
```

## 🚨 Códigos de Erro Comuns

| Código | Descrição |
|--------|-----------|
| `TOKEN_REQUIRED` | Token de acesso é obrigatório |
| `INVALID_TOKEN` | Token inválido ou expirado |
| `CREDENTIALS_REQUIRED` | Username e password são obrigatórios |
| `INVALID_CREDENTIALS` | Credenciais inválidas |
| `MISSING_REQUIRED_FIELDS` | Campos obrigatórios não fornecidos |
| `INVALID_PAYMENT_METHOD` | Meio de pagamento inválido |
| `INTERNAL_SERVER_ERROR` | Erro interno do servidor |

## 📝 Notas Importantes

1. **Autenticação:** Todos os endpoints (exceto `/auth/login` e `/moblix-api/status`) requerem Bearer Token
2. **Dados Simulados:** Esta é uma implementação de demonstração com dados simulados
3. **Compatibilidade:** Estrutura baseada na documentação oficial da Moblix
4. **CORS:** Habilitado para desenvolvimento local

## 🎯 Próximos Passos

Para usar em produção:
1. Conectar com banco de dados real
2. Implementar validações mais robustas
3. Adicionar logging detalhado
4. Configurar HTTPS
5. Implementar rate limiting
6. Adicionar monitoramento

## 🐛 Troubleshooting

### Porta em Uso
```bash
# Verificar processos na porta 3001
netstat -an | findstr :3001

# Matar processo (Windows)
taskkill /F /PID {PID_DO_PROCESSO}
```

### Dependências Faltando
```bash
npm install express cors jsonwebtoken uuid
```

### Token Expirado
Refaça o login no endpoint `/auth/login` para obter um novo token.

---

**🏢 Moblix API v1.0.0** | **📧 Suporte:** testemoblix@gmail.com
