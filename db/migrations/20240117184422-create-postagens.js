'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('postagens', {
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
      imagem: {
        allowNull: false,
        type: Sequelize.STRING
      },
      descricao: {
        allowNull: false,
        type: Sequelize.STRING
      },
      likes: {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('postagens');
  }
};
