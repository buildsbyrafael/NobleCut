"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("recuperacoes_senha", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      usuarioId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      tokenHash: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      expiraEm: {
        type: Sequelize.DATE,
        allowNull: false
      },
      utilizadoEm: {
        type: Sequelize.DATE,
        allowNull: true
      },
      invalidadoEm: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("recuperacoes_senha");
  }
};