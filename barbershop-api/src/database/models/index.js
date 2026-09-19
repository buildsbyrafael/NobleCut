const sequelize = require("../connection");

const Usuario = require("./Usuario");
const Barbeiro = require("./Barbeiro");
const Servico = require("./Servico");
const BarbeiroServico = require("./BarbeiroServico");
const Agendamento = require("./Agendamento");
const Avaliacao = require("./Avaliacao");
const RecuperacaoSenha = require("./RecuperacaoSenha");

Usuario.hasOne(Barbeiro, {
  foreignKey: "usuarioId",
  as: "barbeiro"
});

Barbeiro.belongsTo(Usuario, {
  foreignKey: "usuarioId",
  as: "usuario"
});

Barbeiro.belongsToMany(Servico, {
  through: BarbeiroServico,
  foreignKey: "barbeiroId",
  otherKey: "servicoId",
  as: "servicos"
});

Servico.belongsToMany(Barbeiro, {
  through: BarbeiroServico,
  foreignKey: "servicoId",
  otherKey: "barbeiroId",
  as: "barbeiros"
});

Usuario.hasMany(Agendamento, {
  foreignKey: "clienteId",
  as: "agendamentos"
});

Agendamento.belongsTo(Usuario, {
  foreignKey: "clienteId",
  as: "cliente"
});

Barbeiro.hasMany(Agendamento, {
  foreignKey: "barbeiroId",
  as: "agendamentos"
});

Agendamento.belongsTo(Barbeiro, {
  foreignKey: "barbeiroId",
  as: "barbeiro"
});

Servico.hasMany(Agendamento, {
  foreignKey: "servicoId",
  as: "agendamentos"
});

Agendamento.belongsTo(Servico, {
  foreignKey: "servicoId",
  as: "servico"
});

Usuario.hasMany(Agendamento, {
  foreignKey: "canceladoPorUsuarioId",
  as: "cancelamentosRealizados"
});

Agendamento.belongsTo(Usuario, {
  foreignKey: "canceladoPorUsuarioId",
  as: "canceladoPorUsuario"
});

Agendamento.hasOne(Avaliacao, {
  foreignKey: "agendamentoId",
  as: "avaliacao"
});

Avaliacao.belongsTo(Agendamento, {
  foreignKey: "agendamentoId",
  as: "agendamento"
});

Usuario.hasMany(RecuperacaoSenha, {
  foreignKey: "usuarioId",
  as: "recuperacoesSenha"
});

RecuperacaoSenha.belongsTo(Usuario, {
  foreignKey: "usuarioId",
  as: "usuario"
});

module.exports = {
  sequelize,
  Usuario,
  Barbeiro,
  Servico,
  BarbeiroServico,
  Agendamento,
  Avaliacao,
  RecuperacaoSenha
};