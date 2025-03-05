# Lira Solutions - Site Institucional

Este é um projeto desenvolvido com Express.js que demonstra uma estrutura básica de um site institucional. O site inclui várias páginas com diferentes funcionalidades e um design moderno e responsivo.

## 📋 Requisitos do Exercício

O exercício consiste em criar uma aplicação utilizando o framework Express que contenha:
- Estrutura de rotas com requisições GET
- Sistema de templates EJS
- Layout compartilhado entre as páginas
- Middleware para logging de acessos
- Formulários funcionais
- Design responsivo

## 🚀 Tecnologias Utilizadas

- Node.js
- Express.js
- EJS (Template Engine)
- Express EJS Layouts
- Morgan (HTTP request logger)

## 📦 Dependências

```json
{
  "cookie-parser": "~1.4.4",
  "debug": "~2.6.9",
  "ejs": "~2.6.1",
  "express": "~4.16.1",
  "express-ejs-layouts": "^2.5.1",
  "http-errors": "~1.6.3",
  "morgan": "~1.9.1"
}
```

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor:
```bash
npm start
```

4. Acesse a aplicação em:
```
http://localhost:3000
```

## 📂 Estrutura do Projeto

```
.
├── bin/
│   └── www              # Arquivo de inicialização
├── public/              # Arquivos estáticos
│   ├── images/
│   ├── javascripts/
│   └── stylesheets/
├── routes/             # Rotas da aplicação
│   ├── index.js
│   ├── users.js
│   ├── auth.js
│   └── pages.js
├── views/              # Templates EJS
│   ├── layout.ejs      # Layout principal
│   ├── index.ejs
│   ├── about.ejs
│   ├── contact.ejs
│   ├── portfolio.ejs
│   ├── signin.ejs
│   └── signup.ejs
├── app.js             # Arquivo principal da aplicação
└── package.json
```

## 📱 Páginas Disponíveis

- **Home** (`/`): Página inicial com visão geral
- **Sobre** (`/about`): Informações sobre a Lira Solutions
- **Portfólio** (`/portfolio`): Projetos da empresa
- **Contato** (`/contact`): Formulário de contato
- **Login** (`/signin`): Página de login
- **Cadastro** (`/signup`): Página de cadastro
- **Usuários** (`/users`): Lista de usuários
- **Perfil** (`/users/:userid`): Perfil individual de usuário

## 💼 Funcionalidades

- Layout responsivo com navegação intuitiva
- Formulários de contato e autenticação
- Sistema de templates com EJS
- Middleware de logging para todas as requisições
- Tratamento de erros 404
- Design moderno e amigável

## 📄 Licença

Este projeto está sob a licença ISC.

## 👨‍💻 Autor

Desenvolvido como parte de um exercício prático de Express.js.

---

⌨️ com ❤️ por [OE17] 