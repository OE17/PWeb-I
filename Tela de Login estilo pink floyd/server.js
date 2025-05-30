const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pink_floyd_db'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Rota de login
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const query = 'SELECT * FROM usuarios WHERE email = ?';
    
    db.query(query, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const usuario = results[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
            { id: usuario.id, nivel_acesso: usuario.nivel_acesso },
            'seu_secret_key',
            { expiresIn: '1h' }
        );

        res.json({
            token,
            nivel_acesso: usuario.nivel_acesso,
            email: usuario.email
        });
    });
});

// Rota de registro
app.post('/api/registro', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
        const hashSenha = await bcrypt.hash(senha, 10);
        const query = 'INSERT INTO usuarios (email, senha) VALUES (?, ?)';

        db.query(query, [email, hashSenha], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Email já cadastrado' });
                }
                return res.status(500).json({ error: 'Erro ao registrar usuário' });
            }

            res.status(201).json({ message: 'Usuário registrado com sucesso' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 