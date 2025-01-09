const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
    console.log('running...');
});

let db = [
    {
        id: 1,
        titulo: "A Revolução dos Bichos",
        autor: "George Orwell",
        editora: "Companhia das Letras",
        ano: 1945,
        quant: 12,
        preco: 34.9
    },
    {
        id: 2,
        titulo: "1984",
        autor: "George Orwell",
        editora: "Companhia das Letras",
        ano: 1949,
        quant: 8,
        preco: 39.9
    },
    {
        id: 3,
        titulo: "O Pequeno Príncipe",
        autor: "Antoine de Saint-Exupéry",
        editora: "Agir",
        ano: 1943,
        quant: 15,
        preco: 25.0
    },
    {
        id: 4,
        titulo: "Dom Quixote",
        autor: "Miguel de Cervantes",
        editora: "Saraiva",
        ano: 1605,
        quant: 5,
        preco: 60.0
    },
    {
        id: 5,
        titulo: "Harry Potter e a Pedra Filosofal",
        autor: "J.K. Rowling",
        editora: "Rocco",
        ano: 1997,
        quant: 20,
        preco: 49.9
    },
    {
        id: 6,
        titulo: "O Senhor dos Anéis: A Sociedade do Anel",
        autor: "J.R.R. Tolkien",
        editora: "HarperCollins",
        ano: 1954,
        quant: 10,
        preco: 59.9
    },
    {
        id: 7,
        titulo: "O Código Da Vinci",
        autor: "Dan Brown",
        editora: "Sextante",
        ano: 2003,
        quant: 7,
        preco: 45.0
    },
    {
        id: 8,
        titulo: "Orgulho e Preconceito",
        autor: "Jane Austen",
        editora: "Martin Claret",
        ano: 1813,
        quant: 9,
        preco: 35.5
    },
    {
        id: 9,
        titulo: "A Arte da Guerra",
        autor: "Sun Tzu",
        editora: "Lafonte",
        ano: -500,
        quant: 0,
        preco: 29.9
    },
    {
        id: 10,
        titulo: "O Hobbit",
        autor: "J.R.R. Tolkien",
        editora: "HarperCollins",
        ano: 1937,
        quant: 13,
        preco: 39.9
    }
];

// Operações CRUD
app.get('/livros', (req, res) => {
    res.json(db);
});

app.post('/livros', (req, res) => {
    let lastId = Math.max(...db.map(l => l.id));
    const livro = {
        id: ++lastId,
        titulo: req.body.titulo,
        autor: req.body.autor,
        editora: req.body.editora,
        ano: req.body.ano,
        quant: req.body.quant,
        preco: req.body.preco
    };
    db.push(livro);
    res.json(db);
});

app.get('/livros/:id', (req, res) => {
    let livro = db.find(l => l.id === parseInt(req.params.id));
    if (livro) {
        res.json(livro);
    } else {
        res.status(404).send('Livro não encontrado');
    }
});

app.put('/livros/:id', (req, res) => {
    let livro = db.find(l => l.id === parseInt(req.params.id));
    if (livro) {
        livro.titulo = req.body.titulo || livro.titulo;
        livro.autor = req.body.autor || livro.autor;
        livro.editora = req.body.editora || livro.editora;
        livro.ano = req.body.ano || livro.ano;
        livro.quant = req.body.quant || livro.quant;
        livro.preco = req.body.preco || livro.preco;
        res.json(livro);
    } else {
        res.status(404).send('Livro não encontrado');
    }
});

app.delete('/livros/:id', (req, res) => {
    db = db.filter(l => l.id !== parseInt(req.params.id));
    res.json(db);
});

// Operações adicionais
app.get('/livros/editora/:editora', (req, res) => {
    let livros = db.filter(l => l.editora.toLowerCase() === req.params.editora.toLowerCase());
    res.json(livros);
});

app.get('/livros/titulo/:keyword', (req, res) => {
    let livros = db.filter(l => l.titulo.toLowerCase().includes(req.params.keyword.toLowerCase()));
    res.json(livros);
});

app.get('/livros/acima-preco/:preco', (req, res) => {
    let livros = db.filter(l => l.preco > parseFloat(req.params.preco));
    res.json(livros);
});

app.get('/livros/abaixo-preco/:preco', (req, res) => {
    let livros = db.filter(l => l.preco < parseFloat(req.params.preco));
    res.json(livros);
});

app.get('/livros/mais-recentes', (req, res) => {
    let livros = [...db].sort((a, b) => b.ano - a.ano);
    res.json(livros);
});

app.get('/livros/mais-antigos', (req, res) => {
    let livros = [...db].sort((a, b) => a.ano - b.ano);
    res.json(livros);
});

app.get('/livros/sem-estoque', (req, res) => {
    let livros = db.filter(l => l.quant === 0);
    res.json(livros);
});

// Endpoint inexistente
app.use((req, res) => {
    res.status(404).send('Endpoint não encontrado');
});