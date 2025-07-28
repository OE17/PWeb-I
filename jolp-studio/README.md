# JOLP Studio Website

Site oficial do JOLP Studio Softworks, desenvolvido em React com Vite. O site apresenta os jogos e projetos do estúdio, com páginas de início, download e contato.

## ✨ Funcionalidades

- **Página Inicial**: Carrossel interativo com imagens dos projetos
- **Downloads**: Seção para baixar jogos com suporte para múltiplas plataformas
- **Contato**: Página com informações de contato do estúdio
- **Design Responsivo**: Interface adaptada para diferentes dispositivos
- **Efeitos Visuais**: Animações 3D e transições suaves entre páginas

## 🛠️ Tecnologias Utilizadas

- **React 19.1.0** - Biblioteca para interface de usuário
- **Vite** - Build tool e servidor de desenvolvimento
- **React Router DOM** - Roteamento entre páginas
- **React Slick** - Componente de carrossel
- **CSS3** - Estilização com animações e efeitos modernos

## 🚀 Como executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd jolp-studio
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse o site em: `http://localhost:5173`

## 📜 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Executa o linter ESLint

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header.jsx      # Cabeçalho do site
│   └── Header.css      # Estilos do cabeçalho
├── pages/              # Páginas do site
│   ├── Inicio.jsx      # Página inicial com carrossel
│   ├── Download.jsx    # Página de downloads
│   └── Contato.jsx     # Página de contato
├── assets/             # Imagens e recursos
│   ├── LogoSite.png    # Logo do estúdio
│   ├── Carrosel1-3.png # Imagens do carrossel
│   └── ...             # Outros assets
└── App.jsx             # Componente principal
```

## 🎨 Características do Design

- Interface moderna com gradientes e efeitos visuais
- Carrossel automático com navegação manual
- Efeitos 3D no título principal
- Transições suaves entre páginas
- Layout responsivo

## 📧 Contato

**JOLP Studio Softworks**
- Email: jolpstudio@example.com

---

© 2025 JOLP Studio Softworks. Todos os direitos reservados.
