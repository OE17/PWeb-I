const express = require('express');
const exphbs = require('express-handlebars');
const mysql = require('mysql2');
// const bcrypt = require('bcryptjs'); // Removido bcrypt por enquanto
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path'); // Adicionado para servir arquivos estáticos

const app = express();

// Configuração do Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'sua_chave_secreta',
    resave: false,
    saveUninitialized: true
}));

// Servir arquivos estáticos da pasta 'views' (onde está login.html)
app.use(express.static(path.join(__dirname, 'views')));

const conexao = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '',
    database: 'aula'
});

conexao.connect(function (erro) {
    if (erro) throw erro;
    console.log("Conectado no banco de dados!");
});

// Middleware para verificar autenticação
const checkAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Middleware para verificar se é admin
const checkAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.nivel_acesso === 'admin') {
        next();
    } else {
        res.status(403).send('Acesso negado');
    }
};

// Rotas
app.get('/login', (req, res) => {
    // res.render('login', { error: null }); // Alterado para servir o HTML diretamente
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    conexao.query(
        'SELECT * FROM usuarios WHERE email = ?',
        [email],
        async (error, results) => {
            if (error) {
                console.error("Erro na consulta ao banco:", error);
                // return res.render('login', { error: 'Erro ao fazer login' });
                return res.status(500).send('Erro interno ao tentar fazer login.');
            }

            if (results.length === 0) {
                // return res.render('login', { error: 'Usuário não encontrado' });
                return res.status(401).send('Usuário não encontrado.');
            }

            const user = results[0];
            // const senhaCorreta = await bcrypt.compare(senha, user.senha); // Removida comparação com bcrypt
            const senhaCorreta = (senha === user.senha); // Comparação direta de senha

            if (!senhaCorreta) {
                // return res.render('login', { error: 'Senha incorreta' });
                return res.status(401).send('Senha incorreta.');
            }

            // req.session.user = { // A sessão não será usada para este fluxo específico
            // id: user.id,
            // email: user.email,
            // nivel_acesso: user.nivel_acesso
            // };

            // res.redirect('/dashboard'); // Alterado para responder com o nível de acesso

            if (user.nivel_acesso === 'administrador') {
                res.send('Login bem-sucedido. Nível de acesso: Administrador.');
            } else {
                res.send('Login bem-sucedido. Nível de acesso: Usuário (sem acesso aos recursos de administrador).');
            }
        }
    );
});

app.get('/dashboard', checkAuth, (req, res) => {
    res.send(`Bem-vindo ${req.session.user.email}! Seu nível de acesso é: ${req.session.user.nivel_acesso}`);
});

app.get('/admin', checkAuth, checkAdmin, (req, res) => {
    res.send('Página de administrador');
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/', function (req, res) {
    res.render('formulario');
});

app.post('/cadastrar', function (req, res) {
    let nome = req.body.nome;
    console.log(req.body);
    res.write('sadfsadf');
    res.end();
});

app.get('/listar', function (req, res) {
    let sql = 'select * from teste';
    conexao.query(sql, function (erro, retorno) {
        res.render('formulario', { listagem: retorno });
    });
});

const PORT = 8050;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});