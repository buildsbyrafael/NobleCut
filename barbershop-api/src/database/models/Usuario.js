const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connection");

class Usuario extends Model {}

Usuario.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    senhaHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipo: {
      type: DataTypes.ENUM("CLIENTE", "BARBEIRO", "ADMINISTRADOR"),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "Usuario",
    tableName: "usuarios",
    timestamps: true,
    createdAt: "criadoEm",
    updatedAt: "atualizadoEm"
  }
);

module.exports = Usuario;