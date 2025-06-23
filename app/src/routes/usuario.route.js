const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller')
const usuarioValidator = require('../validators/usuario.validator')

router.post('/', usuarioValidator.create(), usuarioController.create);
router.get('/', usuarioController.encontrarTodos);
router.get('/buscar', usuarioController.buscar);
router.get('/:id', usuarioValidator.encontrarPorId(), usuarioController.encontrarPorId);
router.delete('/:id', usuarioValidator.encontrarPorId(), usuarioController.excluir);
router.put('/:id/senha', usuarioValidator.alterarSenha(), usuarioController.alterarSenha);

module.exports = router;