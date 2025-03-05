const express = require('express');
const router = express.Router();

router.get('/about', (req, res) => {
  res.render('about', { title: 'Sobre Nós' });
});

router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contato' });
});

router.post('/contact', (req, res) => {
  // Aqui você normalmente enviaria um e-mail ou salvaria no banco de dados
  // Por enquanto, apenas simularemos o sucesso
  console.log('Mensagem recebida:', req.body);
  res.send('Mensagem enviada com sucesso! Entraremos em contato em breve.');
});

router.get('/portfolio', (req, res) => {
  res.render('portfolio', { title: 'Portfólio' });
});

module.exports = router; 