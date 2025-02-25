const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.URI;  // URI do MongoDB no arquivo .env
const client = new MongoClient(uri);
const mydb = client.db('animeDB').collection('animes');
const animesDAO = require('./animesDAO');

app.listen(3001, () => {
    console.log("Servidor rodando na porta 3001...");
});

// Rota para buscar todos os animes (limitado a 10)
app.get('/all', async (req, res) => {
    const docs = await animesDAO.getAnimes(mydb);
    res.json(JSON.parse(JSON.stringify(docs, null, 2)));
});

// Rota para adicionar um anime (título, gênero, episódios, nota)
app.get('/add/:t/:g/:e/:n', async (req, res) => {
    const doc = {
        titulo: req.params.t,
        genero: req.params.g.split(','), // Pode receber múltiplos gêneros separados por vírgula
        episodios: parseInt(req.params.e),
        nota: parseFloat(req.params.n)
    };
    const result = await animesDAO.insertAnime(mydb, doc);
    res.json(result);
});

// Rota para deletar um anime pelo título
app.get('/del/:t', async (req, res) => {
    const titulo = { titulo: req.params.t };
    const result = await animesDAO.deleteAnimeByTitulo(mydb, titulo);
    res.json(result);
});

// Rota para atualizar a nota de um anime pelo título
app.get('/update/:t/:n', async (req, res) => {
    const titulo = { titulo: req.params.t };
    const novaNota = { $set: { nota: parseFloat(req.params.n) } };
    const result = await animesDAO.updateNotaByTitulo(mydb, titulo, novaNota);
    res.json(result);
});
