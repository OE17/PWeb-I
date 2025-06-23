const { body, param } = require('express-validator');
const { validatorMessage } = require('../utils/errorMessage');

function create() {
    return [
        body('nome')
            .notEmpty().withMessage('Nome é obrigatório')
            .isLength({ min: 3 }).withMessage('Nome deve ter no mínimo 3 caracteres'),
        body('email')
            .notEmpty().withMessage('Email é obrigatório')
            .isEmail().withMessage('Email inválido'),
        body('senha')
            .notEmpty().withMessage('Senha é obrigatória')
            .isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres')
    ]
}

function encontrarPorId() {
    return [
        param('id')
            .notEmpty().withMessage('ID é obrigatório')
            .isInt().withMessage('ID deve ser um número inteiro')
    ]
}

function alterarSenha() {
    return [
        param('id')
            .notEmpty().withMessage('ID é obrigatório')
            .isInt().withMessage('ID deve ser um número inteiro'),
        body('novaSenha')
            .notEmpty().withMessage('Nova senha é obrigatória')
            .isLength({ min: 6 }).withMessage('Nova senha deve ter no mínimo 6 caracteres')
    ]
}

module.exports = {
    create: create,
    encontrarPorId: encontrarPorId,
    alterarSenha: alterarSenha
};