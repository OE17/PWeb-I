const db = require('../database/models/index')
const { Usuario } = require('../database/models/index')

const create = async function(usuario) {
    const usuarioCriado = await Usuario.create(usuario)
    return usuarioCriado;
}

const atualizar = async function(id, dados) {
    await Usuario.update(dados, {
        where: { id: id }
    });
}

const encontrarTodos = async function() {
    const usuarios = await Usuario.findAll()
    return usuarios;
}

const encontrarPorId = async function(id) {
    const usuario = await Usuario.findByPk(id)
    return usuario;
}

const encontrarPorWhere = async function(where) {
    const usuarios = await Usuario.findAll({
        where: where
    });
    return usuarios;
}

const excluir = async function(id) {
    await Usuario.destroy({
        where: { id: id }
    });
}

module.exports = {
    create: create,
    atualizar: atualizar,
    encontrarTodos: encontrarTodos,
    encontrarPorId: encontrarPorId,
    encontrarPorWhere: encontrarPorWhere,
    excluir: excluir
}