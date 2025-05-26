# Sistema de Autenticação com Node.js e MySQL

Este é um sistema simples de autenticação que utiliza Node.js para o backend e MySQL para o banco de dados.

## Requisitos

- Node.js
- MySQL (XAMPP)
- NPM (Node Package Manager)

## Configuração

1. Primeiro, inicie o servidor MySQL do XAMPP.

2. Crie o banco de dados e a tabela executando o arquivo `database.sql` no phpMyAdmin ou no cliente MySQL.

3. Instale as dependências do projeto:
```bash
npm install
```

4. Configure as variáveis de ambiente:
   - Renomeie o arquivo `.env.example` para `.env`
   - Ajuste as configurações do banco de dados se necessário

5. Inicie o servidor:
```bash
npm run dev
```

6. Acesse o sistema no navegador:
```
http://localhost:3000
```

## Funcionalidades

- Cadastro de usuários com diferentes níveis de acesso (admin/usuário)
- Login com validação de credenciais
- Área administrativa protegida
- Interface responsiva e amigável

## Estrutura do Projeto

- `server.js` - Arquivo principal do servidor Node.js
- `public/index.html` - Interface do usuário
- `database.sql` - Script de criação do banco de dados
- `.env` - Configurações do ambiente 