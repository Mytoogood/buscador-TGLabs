# Use uma imagem base de Node.js
FROM node:18-alpine

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie o arquivo package.json e package-lock.json (se existir)
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie todo o resto do código
COPY . .

# Faça o build da aplicação
RUN npm run build

# Instale um servidor web simples para servir os arquivos estáticos
RUN npm install -g serve

# Exponha a porta 3000
EXPOSE 3000

# Defina variáveis de ambiente (substitua pelos valores reais)
ENV VITE_SUPABASE_URL=your_supabase_url_here
ENV VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Execute o comando para servir a aplicação buildada
CMD ["serve", "-s", "dist", "-l", "3000"]
