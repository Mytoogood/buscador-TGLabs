# Configuração da Moblix API - Produção

## 📋 Pré-requisitos

1. **Conta Moblix**: Acesse [moblix.com](https://moblix.com) e crie uma conta
2. **API Key**: Obtenha sua chave de API no painel de desenvolvedor
3. **App ID**: Configure seu aplicativo no dashboard da Moblix

## 🔧 Configuração

### 1. Variáveis de Ambiente

Edite o arquivo `.env.local` com suas credenciais reais:

```env
# Moblix API - Configurações de produção
VITE_MOBLIX_API_KEY=sua_chave_api_aqui
VITE_MOBLIX_API_URL=https://api.moblix.com/v1
VITE_MOBLIX_APP_ID=seu_app_id_aqui

# Configurações adicionais
VITE_MOBLIX_ENVIRONMENT=production
VITE_MOBLIX_REGION=us-east-1
```

### 2. Funcionalidades Disponíveis

A aplicação suporta as seguintes funcionalidades da Moblix API:

- **User Management**: Criação e gerenciamento de usuários
- **Push Notifications**: Envio de notificações push
- **Analytics**: Coleta e visualização de dados
- **File Upload**: Upload de arquivos
- **Data Storage**: Armazenamento de dados

### 3. Endpoints Configurados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/users` | Lista usuários |
| POST | `/users` | Cria novo usuário |
| POST | `/push/send` | Envia push notification |
| GET | `/analytics` | Obtém dados de analytics |
| POST | `/files/upload` | Upload de arquivos |

## 🚀 Como Obter as Credenciais

### 1. API Key
1. Acesse o [Dashboard Moblix](https://dashboard.moblix.com)
2. Vá em **Settings > API Keys**
3. Clique em **Generate New Key**
4. Copie a chave gerada

### 2. App ID
1. No dashboard, vá em **Apps**
2. Selecione ou crie um novo app
3. O App ID estará visível na página de detalhes

### 3. Configuração de Permissões
Certifique-se de que sua API Key tem as seguintes permissões:
- ✅ User Management
- ✅ Push Notifications
- ✅ Analytics Read
- ✅ File Upload
- ✅ Data Storage

## 🔐 Segurança

⚠️ **IMPORTANTE**: 
- Nunca exponha suas chaves de API em repositórios públicos
- Use variáveis de ambiente para todas as credenciais
- Regenere suas chaves regularmente
- Configure rate limiting adequado

## 🛠️ Testando a Configuração

Após configurar as credenciais:

1. Reinicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse a página da Moblix API no navegador
3. Teste as funcionalidades disponíveis
4. Verifique o console do navegador para possíveis erros

## 📞 Suporte

Em caso de problemas:
- Documentação oficial: [docs.moblix.com](https://docs.moblix.com)
- Suporte técnico: support@moblix.com
- Status da API: [status.moblix.com](https://status.moblix.com)

## 🔍 Troubleshooting

### Erro 401 - Unauthorized
- Verifique se a API Key está correta
- Confirme se a chave não expirou
- Verifique as permissões da chave

### Erro 403 - Forbidden
- Confirme as permissões da API Key
- Verifique se o App ID está correto
- Confirme se a conta está ativa

### Erro 429 - Rate Limit
- Implemente retry logic
- Verifique os limites da sua conta
- Considere upgrade do plano se necessário

