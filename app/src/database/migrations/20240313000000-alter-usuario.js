'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Adicionar restrições de not null
    await queryInterface.changeColumn('usuarios', 'nome', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.changeColumn('usuarios', 'email', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.changeColumn('usuarios', 'senha', {
      type: Sequelize.STRING,
      allowNull: false
    });

    // Adicionar índice único para email
    await queryInterface.addIndex('usuarios', ['email'], {
      unique: true,
      name: 'usuarios_email_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remover índice único
    await queryInterface.removeIndex('usuarios', 'usuarios_email_unique');

    // Reverter as colunas para permitir null
    await queryInterface.changeColumn('usuarios', 'nome', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.changeColumn('usuarios', 'email', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.changeColumn('usuarios', 'senha', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
}; 