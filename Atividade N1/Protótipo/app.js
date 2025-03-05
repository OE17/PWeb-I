const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

const app = express();

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 