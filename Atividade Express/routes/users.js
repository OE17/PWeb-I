const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  res.render('users', { title: 'Página Users' });
});

router.get('/:userid', (req, res) => {
  const userId = req.params.userid;
  res.render('user', { title: 'Perfil do Usuário', userId: userId });
});

module.exports = router;
