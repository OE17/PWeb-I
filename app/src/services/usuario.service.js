const usuarioRepository = require('../repositories/usuario.repository')
const createError = require('http-errors')
require('dotenv').config();
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const create = async function(usuario) {
    const usuariosExistentes = await usuarioRepository.encontrarPorWhere({ email: usuario.email });

    if (usuariosExistentes && usuariosExistentes.length > 0) {
        return createError(409, 'Usuário já existe');
    }

    usuario.senha = await bcrypt.hash(usuario.senha, parseInt(process.env.SALT))
    const usuarioCriado = await usuarioRepository.create(usuario);
    return usuarioCriado;
}

const encontrarTodos = async function() {
    const usuarios = await usuarioRepository.encontrarTodos();
    return usuarios;
}

const encontrarPorId = async function(id) {
    const usuario = await usuarioRepository.encontrarPorId(id);

    if (!usuario){
        return createError(404, 'Usuário não encontrado');
    }

    return usuario;
}

const excluir = async function(id) {
    const usuario = await usuarioRepository.encontrarPorId(id);

    if (!usuario) {
        return createError(404, 'Usuário não encontrado');
    }

    await usuarioRepository.excluir(id);
    return null;
}

const buscar = async function(termo) {
    const usuarios = await usuarioRepository.encontrarPorWhere({
        [Op.or]: [
            { nome: { [Op.like]: `%${termo}%` } },
            { email: { [Op.like]: `%${termo}%` } }
        ]
    });
    return usuarios;
}

const alterarSenha = async function(id, novaSenha) {
    const usuario = await usuarioRepository.encontrarPorId(id);

    if (!usuario) {
        return createError(404, 'Usuário não encontrado');
    }

    const senhaHash = await bcrypt.hash(novaSenha, parseInt(process.env.SALT));
    await usuarioRepository.atualizar(id, { senha: senhaHash });
    return null;
}

module.exports = {
    create: create,
    encontrarTodos: encontrarTodos,
    encontrarPorId: encontrarPorId,
    excluir: excluir,
    buscar: buscar,
    alterarSenha: alterarSenha
}