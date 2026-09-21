const {
  Agendamento,
  Avaliacao
} = require("../../database/models");

async function findAppointmentById(id) {
  return Agendamento.findByPk(id);
}

async function findReviewByAppointmentId(agendamentoId) {
  return Avaliacao.findOne({
    where: {
      agendamentoId
    }
  });
}

async function createReview(data) {
  return Avaliacao.create(data);
}

module.exports = {
  findAppointmentById,
  findReviewByAppointmentId,
  createReview
};