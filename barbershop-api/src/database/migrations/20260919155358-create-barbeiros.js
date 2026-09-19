"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("barbeiros", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      usuarioId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: "usuarios",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      fotoUrl: {
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable("barbeiros");
  }
};