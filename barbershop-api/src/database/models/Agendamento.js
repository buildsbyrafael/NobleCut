const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connection");

class Agendamento extends Model {}

Agendamento.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    clienteId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    barbeiroId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    servicoId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    servicoNome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    servicoDuracaoMinutos: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    servicoPreco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    dataHoraInicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dataHoraFim: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("AGENDADO", "CONCLUIDO", "CANCELADO"),
      allowNull: false,
      defaultValue: "AGENDADO"
    },
    canceladoPorTipo: {
      type: DataTypes.ENUM("CLIENTE", "BARBEIRO", "ADMINISTRADOR"),
      allowNull: true
    },
    canceladoPorUsuarioId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    canceladoEm: {
      type: DataTypes.DATE,
      allowNull: true
    },
    concluidoPor: {
      type: DataTypes.ENUM("CLIENTE", "SISTEMA"),
      allowNull: true
    },
    concluidoEm: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "Agendamento",
    tableName: "agendamentos",
    timestamps: true,
    createdAt: "criadoEm",
    updatedAt: "atualizadoEm"
  }
);

module.exports = Agendamento;