const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connection");

class RecuperacaoSenha extends Model {}

RecuperacaoSenha.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    tokenHash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    expiraEm: {
      type: DataTypes.DATE,
      allowNull: false
    },
    utilizadoEm: {
      type: DataTypes.DATE,
      allowNull: true
    },
    invalidadoEm: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "RecuperacaoSenha",
    tableName: "recuperacoes_senha",
    timestamps: true,
    createdAt: "criadoEm",
    updatedAt: "atualizadoEm"
  }
);

module.exports = RecuperacaoSenha;