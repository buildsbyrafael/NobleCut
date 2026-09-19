"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("servicos", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      duracaoMinutos: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      preco: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      criadoEm: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      atualizadoEm: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("servicos");
  }
};