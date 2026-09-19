"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("agendamentos", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      clienteId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      barbeiroId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "barbeiros",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      servicoId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "servicos",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      servicoNome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      servicoDuracaoMinutos: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      servicoPreco: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      dataHoraInicio: {
        type: Sequelize.DATE,
        allowNull: false
      },
      dataHoraFim: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM("AGENDADO", "CONCLUIDO", "CANCELADO"),
        allowNull: false,
        defaultValue: "AGENDADO"
      },
      canceladoPorTipo: {
        type: Sequelize.ENUM("CLIENTE", "BARBEIRO", "ADMINISTRADOR"),
        allowNull: true
      },
      canceladoPorUsuarioId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "usuarios",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      canceladoEm: {
        type: Sequelize.DATE,
        allowNull: true
      },
      concluidoPor: {
        type: Sequelize.ENUM("CLIENTE", "SISTEMA"),
        allowNull: true
      },
      concluidoEm: {
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
    await queryInterface.dropTable("agendamentos");
  }
};