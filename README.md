# ✈️ Júlio Martins | Milhas & Viagens

Site oficial do Júlio Martins, especialista em milhas e viagens, construído com **Vue.js 3** e **Tailwind CSS**.

![Vue.js](https://img.shields.io/badge/Vue.js-3.4.0-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## 📋 **Sobre Júlio Martins**

Júlio Martins é um dos maiores especialistas em milhas e viagens do Brasil:

- **✈️ Mais de 100 milhões de milhas acumuladas**
- **🌍 Viajou para mais de 70 países**
- **👥 Mais de 10.000 membros orientados**
- **📅 Desde 2008 transformando sonhos em viagens**

## ✨ **Características**

### 🎨 **Interface Moderna**
- Design responsivo com Tailwind CSS
- Animações suaves e transições
- Componentes reutilizáveis
- Dark mode ready

### 🔧 **Funcionalidades**
- **Consultoria personalizada** em milhas
- **Treinamentos especializados**
- **Alertas de promoções** imperdíveis
- **Grupo gratuito** de milhas & viagens

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
API_VISUAL_DEMO/
├── public/                 # Arquivos públicos
├── src/
│   ├── assets/            # CSS e recursos
│   │   └── style.css      # Tailwind + estilos customizados
│   ├── components/        # Componentes Vue reutilizáveis
│   │   ├── Navbar.vue     # Navegação principal
│   │   └── Footer.vue     # Rodapé
│   ├── views/             # Páginas da aplicação
│   │   ├── Home.vue       # Página inicial
│   │   ├── MoblixDemo.vue # Demo da Moblix API
│   │   ├── GoogleFlightsDemo.vue # Demo Google Flights
│   │   └── ApiComparison.vue # Comparação das APIs
│   ├── router/            # Configuração de rotas
│   │   └── index.js       # Vue Router setup
│   ├── services/          # Serviços para APIs
│   ├── App.vue           # Componente raiz
│   └── main.js           # Entry point
├── index.html            # Template HTML
├── package.json          # Dependências
├── vite.config.js        # Configuração Vite
├── tailwind.config.js    # Configuração Tailwind
└── postcss.config.js     # Configuração PostCSS
```

## 🎯 **Páginas e Funcionalidades**

### 🏠 **Home**
- Hero section apresentando Júlio Martins
- Experiência e conquistas
- Serviços oferecidos
- Links para redes sociais

### 👨‍💼 **Sobre**
- Biografia completa do Júlio
- Trajetória profissional
- Conquistas e números
- Metodologia de trabalho

### ✈️ **Consultoria**
- Serviços de consultoria personalizada
- Planos e modalidades
- Depoimentos de clientes
- Formulário de contato

## 🛠️ **Tecnologias Utilizadas**

### **Frontend**
- **Vue.js 3** - Framework progressivo
- **Composition API** - Lógica reutilizável
- **Vue Router 4** - Roteamento SPA
- **Tailwind CSS** - Utility-first CSS
- **Vite** - Build tool moderna

### **Desenvolvimento**
- **PostCSS** - Processamento CSS
- **Autoprefixer** - Compatibilidade CSS
- **ESLint** - Linting JavaScript
- **Prettier** - Formatação código

### **Redes Sociais**
- **Instagram** - [@juliomartins__](https://www.instagram.com/juliomartins__/)
- **Grupo Telegram** - Alertas imperdíveis
- **WhatsApp** - Consultoria exclusiva

## 🎨 **Customização**

### **Cores (Tailwind)**
```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: { /* Azul personalizado */ },
      secondary: { /* Verde personalizado */ }
    }
  }
}
```

### **Componentes**
```vue
<!-- Exemplo de uso -->
<template>
  <Card>
    <CardHeader>Título</CardHeader>
    <CardContent>Conteúdo</CardContent>
  </Card>
</template>
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

## 🔧 **Configuração**

### **Variáveis de Ambiente**
```bash
# .env.local
VITE_MOBLIX_API_KEY=your_moblix_key
VITE_GOOGLE_FLIGHTS_API_KEY=your_google_key
VITE_API_BASE_URL=http://localhost:3000
```

### **Customização Tailwind**
```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      // Suas customizações
    }
  },
  plugins: []
}
```

## 📚 **Recursos Adicionais**

- [Vue.js 3 Documentation](https://vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Moblix API Docs](../API_DOCUMENTATIONS/MOBLIX_API_DOCUMENTATION.md)
- [Google Flights API Docs](../API_DOCUMENTATIONS/GOOGLE_FLIGHTS_API_DOCUMENTATION.md)

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 **Desenvolvido por**

**Júlio Martins | Milhas & Viagens**
- 📸 Instagram: [@juliomartins__](https://www.instagram.com/juliomartins__/)
- ✈️ Especialista em milhas desde 2008
- 🌍 Mais de 70 países visitados
- 💼 Consultoria personalizada

---

**✈️ Transforme seus sonhos em viagens com o Júlio Martins!**

