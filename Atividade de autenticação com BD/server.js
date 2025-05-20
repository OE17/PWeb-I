require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Configuração do middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'sua_chave_secreta_muito_segura',
    resave: false,
    saveUninitialized: true
}));

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'sistema_auth'
});

connection.connect(error => {
    if (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Rotas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    connection.query(
        'SELECT * FROM usuarios WHERE email = ?',
        [email],
        async (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'Usuário não encontrado' });
            }

            const usuario = results[0];
            const senhaValida = await bcrypt.compare(senha, usuario.senha);

            if (!senhaValida) {
                return res.status(401).json({ error: 'Senha incorreta' });
            }

            req.session.usuario = {
                id: usuario.id,
                email: usuario.email,
                nivelAcesso: usuario.nivel_acesso
            };

            res.json({
                message: 'Login realizado com sucesso',
                nivelAcesso: usuario.nivel_acesso
            });
        }
    );
});

// Rota para cadastro de usuário
app.post('/cadastro', async (req, res) => {
    const { email, senha, nivelAcesso } = req.body;
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    connection.query(
        'INSERT INTO usuarios (email, senha, nivel_acesso) VALUES (?, ?, ?)',
        [email, senhaCriptografada, nivelAcesso],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
            }
            res.json({ message: 'Usuário cadastrado com sucesso' });
        }
    );
});

// Rota protegida de exemplo
app.get('/admin', (req, res) => {
    if (!req.session.usuario || req.session.usuario.nivelAcesso !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado' });
    }
    res.json({ message: 'Bem-vindo à área administrativa' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 