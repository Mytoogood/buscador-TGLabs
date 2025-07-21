# Buscador-TGLabs

Sistema completo para busca, gestão e análise de voos, bilhetes e experiências, integrando Supabase e Moblix API. Desenvolvido para consultoria, treinamentos e automação de processos relacionados a milhas e viagens.

## Funcionalidades

- **Busca de voos**: Scripts e interface para consultar voos baratos, ofertas e detalhes de itinerários.
- **Gestão de bilhetes e reservas**: API própria (`src/moblix-api.js`) para criar, listar e gerenciar bilhetes, reservas e experiências.
- **Autenticação e usuários**: Integração com Supabase para cadastro, login, confirmação de email, redefinição de senha e gerenciamento de perfis.
- **Dashboard e área logada**: Interface Vue 3 com rotas protegidas, área administrativa e funcionalidades exclusivas para usuários autenticados.
- **Monitoramento de APIs**: Script de interceptação para análise de requisições, preços e dados em tempo real.
- **Automação de banco de dados**: Scripts para criação, verificação e limpeza de tabelas no Supabase.
- **Proxy para APIs externas**: Configuração avançada de proxy no Vite para integração com a API Moblix.

## Tecnologias

- **Frontend**: Vue 3, Pinia, Tailwind CSS, Vite
- **Backend/API**: Node.js, Express, Supabase, Moblix API (mock e integração)
- **Banco de dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth, JWT
- **DevOps**: Docker, scripts CLI para automação

## Estrutura

- `src/`: Código-fonte principal (Vue, serviços, componentes, rotas)
- `scripts/`: Scripts utilitários para banco de dados e usuários
- `public/`: Assets estáticos
- `database/`: SQL para criação de tabelas
- `supabase/`: Configuração do projeto Supabase
- Arquivos JS avulsos: Scripts de automação, integração e manutenção

## Como rodar

### Pré-requisitos

- Node.js 18+
- Docker (opcional)
- Conta e projeto no Supabase

### Instalação

```sh
npm install
```

### Configuração

1. Crie um projeto no Supabase e obtenha a URL e a chave anônima.
2. Configure as variáveis de ambiente em `.env` ou diretamente no Dockerfile:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Execute os scripts de banco de dados:
   ```sh
   node create-clients-table.js
   node supabase-cli.js create-clients-table
   ```

### Executando em desenvolvimento

```sh
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

### Executando a API Moblix (mock)

```sh
node start-moblix-api.js
```

Acesse endpoints como:

- Status: `GET /moblix-api/status`
- Login: `POST /auth/login`
- Criar bilhete: `POST /moblix-api/api/Pedido/EmitirPedido`

### Usando Docker

```sh
docker build -t buscador-tglabs .
docker run -p 3000:3000 buscador-tglabs
```

## Scripts úteis

- `scripts/list-users.js`: Lista usuários e perfis do Supabase
- `scripts/send-password-reset.js`: Envia email de redefinição de senha
- `full-cleanup.js`: Limpa tabelas e usuários do banco
- `api-interceptor.js`: Monitoramento de requisições no navegador
