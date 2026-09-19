const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connection");

class Servico extends Model {}

Servico.init(
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
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    duracaoMinutos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 30,
        isMultipleOf30(value) {
          if (value % 30 !== 0) {
            throw new Error("A duração deve ser múltipla de 30 minutos.");
          }
        }
      }
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    }
  },
  {
    sequelize,
    modelName: "Servico",
    tableName: "servicos",
    timestamps: true,
    createdAt: "criadoEm",
    updatedAt: "atualizadoEm"
  }
);

module.exports = Servico;