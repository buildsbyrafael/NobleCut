const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connection");

class Avaliacao extends Model {}

Avaliacao.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    agendamentoId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true
    },
    nota: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "Avaliacao",
    tableName: "avaliacoes",
    timestamps: true,
    createdAt: "criadoEm",
    updatedAt: "atualizadoEm"
  }
);

module.exports = Avaliacao;