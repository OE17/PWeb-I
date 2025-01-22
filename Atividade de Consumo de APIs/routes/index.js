const express = require('express');
const router = express.Router();
const { getBitcoinPrice } = require('../services/bitcoinService');

// Middleware de log de acesso
router.use((req, res, next) => {
    console.log(`Accessed ${req.originalUrl} at ${new Date().toISOString()}`);
    next();
});

router.get('/', async (req, res, next) => {
    try {
        const data = await getBitcoinPrice();
        res.render('index', { 
            title: 'Bitcoin Price', 
            bpi: data.bpi, 
            time: data.time 
        });
    } catch (error) {
        next(error);
    }
});

router.get('/usd', async (req, res, next) => {
    try {
        const data = await getBitcoinPrice();
        res.render('currency', { 
            title: 'Bitcoin Price in USD', 
            rate: data.bpi.USD.rate, 
            description: data.bpi.USD.description, 
            time: data.time 
        });
    } catch (error) {
        next(error);
    }
});

router.get('/eur', async (req, res, next) => {
    try {
        const data = await getBitcoinPrice();
        res.render('currency', { 
            title: 'Bitcoin Price in EUR', 
            rate: data.bpi.EUR.rate, 
            description: data.bpi.EUR.description, 
            time: data.time 
        });
    } catch (error) {
        next(error);
    }
});

router.get('/gbp', async (req, res, next) => {
    try {
        const data = await getBitcoinPrice();
        res.render('currency', { 
            title: 'Bitcoin Price in GBP', 
            rate: data.bpi.GBP.rate, 
            description: data.bpi.GBP.description, 
            time: data.time 
        });
    } catch (error) {
        next(error);
    }
});

// Página de erro para endpoints inexistentes
router.use((req, res) => {
    res.status(404).render('error', { 
        message: 'Page not found', 
        error: { status: 404 }
    });
});

module.exports = router;