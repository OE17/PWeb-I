const express = require('express');
const router = express.Router();

// Rota principal
router.get('/', (req, res) => {
    res.render('index', { 
        title: 'AnimeWorld - Seu Portal de Animes',
        activeNav: 'home'
    });
});

// Rota de catálogo
router.get('/catalogo', (req, res) => {
    res.render('catalogo', { 
        title: 'Catálogo de Animes',
        activeNav: 'catalogo'
    });
});

// Rota de lançamentos
router.get('/lancamentos', (req, res) => {
    res.render('lancamentos', { 
        title: 'Últimos Lançamentos',
        activeNav: 'lancamentos'
    });
});

// Rota de favoritos
router.get('/favoritos', (req, res) => {
    res.render('favoritos', { 
        title: 'Meus Favoritos',
        activeNav: 'favoritos'
    });
});

module.exports = router; 