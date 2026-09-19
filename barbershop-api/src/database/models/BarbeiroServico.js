const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connection");

class BarbeiroServico extends Model {}

BarbeiroServico.init(
  {
    barbeiroId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    servicoId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    }
  },
  {
    sequelize,
    modelName: "BarbeiroServico",
    tableName: "barbeiro_servicos",
    timestamps: true,
    createdAt: "criadoEm",
    updatedAt: "atualizadoEm"
  }
);

module.exports = BarbeiroServico;