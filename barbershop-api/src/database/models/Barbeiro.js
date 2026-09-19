const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connection");

class Barbeiro extends Model {}

Barbeiro.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fotoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "Barbeiro",
    tableName: "barbeiros",
    timestamps: true,
    createdAt: "criadoEm",
    updatedAt: "atualizadoEm"
  }
);

module.exports = Barbeiro;