# 🔑 Configuração das APIs Reais

Este documento explica como obter e configurar as chaves de API necessárias para usar as APIs reais no projeto API_VISUAL_DEMO.

## 📋 Pré-requisitos

- Contas nas plataformas das APIs
- Chaves de API válidas
- Projeto configurado com as dependências instaladas

## 🌐 Google Flights API (Travel Partner API)

### 1. Como obter a chave de API:

1. **Acesse o Google Cloud Console**: https://console.cloud.google.com/
2. **Crie um novo projeto** ou selecione um existente
3. **Ative a Travel Partner API**:
   - Vá para "APIs & Services" > "Library"
   - Procure por "Travel Partner API"
   - Clique em "Enable"
4. **Crie credenciais**:
   - Vá para "APIs & Services" > "Credentials"
   - Clique em "Create Credentials" > "API Key"
   - Copie a chave gerada

### 2. Configuração:

```bash
# No arquivo .env.local
VITE_GOOGLE_FLIGHTS_API_KEY=sua_chave_da_google_flights_api_aqui
VITE_GOOGLE_FLIGHTS_API_URL=https://www.googleapis.com/travel/v1
```

### 3. Endpoints principais:

- **Search Flights**: `/flights/search`
- **Flight Details**: `/flights/{flightId}`
- **Airports**: `/airports`

## 📱 Moblix API

### 1. Como obter a chave de API:

1. **Acesse o site da Moblix**: https://moblix.com/
2. **Crie uma conta** ou faça login
3. **Acesse o dashboard** de desenvolvedor
4. **Gere uma nova chave de API**:
   - Vá para "API Keys" ou "Developer Settings"
   - Clique em "Generate New API Key"
   - Copie a chave gerada

### 2. Configuração:

```bash
# No arquivo .env.local
VITE_MOBLIX_API_KEY=sua_chave_da_moblix_api_aqui
VITE_MOBLIX_API_URL=https://api.moblix.com/v1
```

### 3. Endpoints principais:

- **Users**: `/users`
- **Push Notifications**: `/push/send`
- **Analytics**: `/analytics`
- **File Upload**: `/files/upload`

## ⚙️ Configuração do Projeto

### 1. Instalar dependências:

```bash
npm install
```

### 2. Configurar variáveis de ambiente:

1. **Copie o arquivo de exemplo**:
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edite o arquivo .env.local** com suas chaves:
   ```bash
   # Google Flights API
   VITE_GOOGLE_FLIGHTS_API_KEY=AIzaSyD...
   VITE_GOOGLE_FLIGHTS_API_URL=https://www.googleapis.com/travel/v1

   # Moblix API
   VITE_MOBLIX_API_KEY=mk_live_...
   VITE_MOBLIX_API_URL=https://api.moblix.com/v1
   ```

### 3. Executar o projeto:

```bash
npm run dev
```

## 🔧 Configurações Avançadas

### CORS (Cross-Origin Resource Sharing)

Algumas APIs podem ter restrições de CORS. Para resolver:

1. **Configure os domínios permitidos** no painel da API
2. **Use um proxy** se necessário:
   ```javascript
   // vite.config.js
   export default defineConfig({
     server: {
       proxy: {
         '/api/google': {
           target: 'https://www.googleapis.com',
           changeOrigin: true,
           rewrite: (path) => path.replace(/^\/api\/google/, '')
         },
         '/api/moblix': {
           target: 'https://api.moblix.com',
           changeOrigin: true,
           rewrite: (path) => path.replace(/^\/api\/moblix/, '')
         }
       }
     }
   })
   ```

### Rate Limiting

As APIs têm limites de requisições:

- **Google Flights**: 1000 requisições/dia (gratuito)
- **Moblix**: Varia conforme o plano

### Tratamento de Erros

O projeto já inclui tratamento básico de erros:

```javascript
// Exemplo de tratamento
try {
  const response = await googleFlightsService.searchFlights(params)
  // Processar resposta
} catch (error) {
  if (error.response?.status === 401) {
    console.error('Chave de API inválida')
  } else if (error.response?.status === 429) {
    console.error('Limite de requisições excedido')
  }
}
```

## 🚨 Troubleshooting

### Problemas Comuns:

1. **Erro 401 - Unauthorized**:
   - Verifique se a chave de API está correta
   - Confirme se a API está ativada no painel

2. **Erro 429 - Too Many Requests**:
   - Aguarde antes de fazer nova requisição
   - Considere implementar cache

3. **Erro de CORS**:
   - Configure os domínios permitidos
   - Use proxy se necessário

4. **Resposta vazia**:
   - Verifique os parâmetros da requisição
   - Confirme se os endpoints estão corretos

### Debug:

Para debugar as requisições:

```javascript
// Adicione logs detalhados
console.log('Fazendo requisição para:', url)
console.log('Parâmetros:', params)
console.log('Headers:', headers)
```

## 📞 Suporte

### Google Flights API:
- **Documentação**: https://developers.google.com/travel/
- **Suporte**: Google Cloud Support

### Moblix API:
- **Documentação**: https://docs.moblix.com/
- **Suporte**: support@moblix.com

## 📝 Notas Importantes

1. **Nunca commite chaves de API** no controle de versão
2. **Use diferentes chaves** para desenvolvimento e produção
3. **Monitore o uso** para evitar cobranças inesperadas
4. **Implemente cache** para otimizar o número de requisições

---

**✅ Após configurar tudo, teste as funcionalidades no demo para garantir que está funcionando corretamente!**

