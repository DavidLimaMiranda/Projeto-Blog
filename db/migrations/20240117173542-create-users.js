'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      foto_perfil: {
        allowNull: false,
        type: Sequelize.STRING
      },
      names: {
        allowNull: false,
        type: Sequelize.STRING(80)
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      passwords: {
        allowNull: false,
        type: Sequelize.STRING
      },
      descricao_perfil: {
        allowNull: false,
        type: Sequelize.STRING
      },
      publicacoes: {
        allowNull: false,
        type: Sequelize.MEDIUMINT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('users')
  }
};
