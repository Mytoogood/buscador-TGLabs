# 🔍 Buscador TGLabs - API de Voos

Sistema de busca de voos integrado com API Moblix, construído com **Vue.js 3** e **Tailwind CSS**.

![Vue.js](https://img.shields.io/badge/Vue.js-3.4.0-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## 📋 **Sobre o Projeto**

O Buscador TGLabs é uma aplicação web desenvolvida para busca e comparação de voos utilizando a API Moblix:

- **✈️ Busca de voos em tempo real**
- **🌍 Múltiplas companhias aéreas**
- **💰 Comparação de preços**
- **📅 Filtros por data e destino**

## ✨ **Características**

### 🎨 **Interface Moderna**
- Design responsivo com Tailwind CSS
- Animações suaves e transições
- Componentes reutilizáveis
- Dark mode ready

### 🔧 **Funcionalidades**
- **Busca de voos** por origem/destino
- **Filtros avançados** por companhia
- **Comparação de preços** em tempo real
- **Resultados organizados** por menor preço

### ⚡ **Performance**
- Vue.js 3 com Composition API
- Vite para build rápido
- Lazy loading de componentes
- Otimização automática

## 🚀 **Instalação e Uso**

### **Pré-requisitos**
- Node.js 16+ 
- npm ou yarn

### **1. Instalar Dependências**
```bash
npm install
```

### **2. Executar em Desenvolvimento**
```bash
npm run dev
```
Acesse: http://localhost:3000

### **3. Build para Produção**
```bash
npm run build
```

### **4. Preview da Build**
```bash
npm run preview
```

## 📁 **Estrutura do Projeto**

```
buscador-TGLabs/
├── public/                 # Arquivos públicos
├── src/
│   ├── assets/            # CSS e recursos
│   │   └── style.css      # Tailwind + estilos customizados
│   ├── components/        # Componentes Vue reutilizáveis
│   │   ├── Navbar.vue     # Navegação principal
│   │   └── Footer.vue     # Rodapé
│   ├── views/             # Páginas da aplicação
│   │   ├── Home.vue       # Página inicial
│   │   ├── Flights.vue    # Busca de voos
│   │   └── Results.vue    # Resultados da busca
│   ├── router/            # Configuração de rotas
│   │   └── index.js       # Vue Router setup
│   ├── services/          # Serviços para APIs
│   │   └── moblixApiService.js # Integração Moblix
│   ├── App.vue           # Componente raiz
│   └── main.js           # Entry point
├── index.html            # Template HTML
├── package.json          # Dependências
├── vite.config.js        # Configuração Vite
├── tailwind.config.js    # Configuração Tailwind
└── postcss.config.js     # Configuração PostCSS
```

## 🛠️ **Tecnologias Utilizadas**

### **Frontend**
- **Vue.js 3** - Framework progressivo
- **Composition API** - Lógica reutilizável
- **Vue Router 4** - Roteamento SPA
- **Tailwind CSS** - Utility-first CSS
- **Vite** - Build tool moderna

### **APIs**
- **Moblix API** - Busca de voos e preços
- **Axios** - Cliente HTTP
- **JavaScript ES6+** - Funcionalidades modernas

### **Desenvolvimento**
- **PostCSS** - Processamento CSS
- **Autoprefixer** - Compatibilidade CSS
- **ESLint** - Linting JavaScript
- **Prettier** - Formatação código

## 🔧 **Configuração**

### **Variáveis de Ambiente**
```bash
# .env.local
VITE_MOBLIX_API_KEY=your_moblix_key
VITE_MOBLIX_BASE_URL=https://api.moblix.com
VITE_API_BASE_URL=http://localhost:3000
```

## 📦 **Scripts Disponíveis**

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento

# Build
npm run build        # Build para produção
npm run preview      # Preview da build

# Linting
npm run lint         # ESLint
npm run lint:fix     # Corrigir automaticamente
```

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 **Desenvolvido por**

**TGLabs - Tecnologia & Inovação**
- 🚀 Soluções em desenvolvimento web
- ✈️ Especialização em APIs de viagens
- 💼 Consultoria em tecnologia

---

**✈️ Encontre os melhores voos com o Buscador TGLabs!**
