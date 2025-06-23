const usuarioService = require('../services/usuario.service')
const { validationResult } = require('express-validator')
const createError = require('http-errors')

const create = async function(req, res, next) {
    try{
        console.log('Dados recebidos:', req.body);
        
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            console.log('Erros de validação:', errors.array());
            throw(createError(422,{ errors: errors.array() }))
        }

        const response = await usuarioService.create(req.body);
        console.log('Resposta do service:', response);
        
        if (response && response.message){
            console.log('Erro no service:', response);
            throw response;
        }
        res.send(response);
    } catch (error){
        console.error('Erro no controller:', error);
        return next(error);
    }
}

const encontrarTodos = async function(req, res, next) {
    try {
        const response = await usuarioService.encontrarTodos();
        res.send(response);
    } catch (error) {
        next(error);
    }
}

const encontrarPorId = async function(req, res, next) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()){
            throw createError(422, { errors: errors.array() });
        }

        const response = await usuarioService.encontrarPorId(req.params.id);

        if (response && response.message){
            throw response;
        }

        res.send(response);
    } catch (error) {
        next(error)
    }
}

const excluir = async function(req, res, next) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()){
            throw createError(422, { errors: errors.array() });
        }

        const response = await usuarioService.excluir(req.params.id);

        if (response && response.message){
            throw response;
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

const buscar = async function(req, res, next) {
    try {
        const termo = req.query.termo || '';
        const response = await usuarioService.buscar(termo);
        res.send(response);
    } catch (error) {
        next(error);
    }
}

const alterarSenha = async function(req, res, next) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()){
            throw createError(422, { errors: errors.array() });
        }

        const response = await usuarioService.alterarSenha(req.params.id, req.body.novaSenha);

        if (response && response.message){
            throw response;
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    create: create,
    encontrarTodos: encontrarTodos,
    encontrarPorId: encontrarPorId,
    excluir: excluir,
    buscar: buscar,
    alterarSenha: alterarSenha
}