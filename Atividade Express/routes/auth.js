const express = require('express');
const router = express.Router();

router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Criar Conta' });
});

router.get('/signin', (req, res) => {
  res.render('signin', { title: 'Entrar' });
});

module.exports = router; 