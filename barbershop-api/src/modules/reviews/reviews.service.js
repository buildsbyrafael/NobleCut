const AppError = require("../../utils/AppError");
const APPOINTMENT_STATUS = require("../../constants/appointment-status");
const reviewsRepository = require("./reviews.repository");

function createAppError(statusCode, code, message) {
  const error = new AppError(message, statusCode, code);

  error.statusCode = statusCode;
  error.code = code;
  error.message = message;

  return error;
}

function serializeReview(review) {
  return {
    id: review.id,
    agendamentoId: review.agendamentoId,
    nota: review.nota,
    comentario: review.comentario,
    criadoEm: review.criadoEm
  };
}

async function createReview({
  appointmentId,
  userId,
  nota,
  comentario
}) {
  const appointment =
    await reviewsRepository.findAppointmentById(appointmentId);

  if (!appointment) {
    throw createAppError(
      404,
      "APPOINTMENT_NOT_FOUND",
      "Agendamento não encontrado."
    );
  }

  if (appointment.clienteId !== userId) {
    throw createAppError(
      403,
      "FORBIDDEN",
      "Você não possui permissão para avaliar este agendamento."
    );
  }

  if (appointment.status !== APPOINTMENT_STATUS.CONCLUIDO) {
    throw createAppError(
      409,
      "APPOINTMENT_NOT_REVIEWABLE",
      "Somente atendimentos concluídos podem ser avaliados."
    );
  }

  const existingReview =
    await reviewsRepository.findReviewByAppointmentId(appointmentId);

  if (existingReview) {
    throw createAppError(
      409,
      "APPOINTMENT_ALREADY_REVIEWED",
      "Este atendimento já foi avaliado."
    );
  }

  let review;

  try {
    review = await reviewsRepository.createReview({
      agendamentoId: appointmentId,
      nota,
      comentario:
        comentario === undefined || comentario === null
          ? null
          : comentario.trim()
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw createAppError(
        409,
        "APPOINTMENT_ALREADY_REVIEWED",
        "Este atendimento já foi avaliado."
      );
    }

    throw error;
  }

  return serializeReview(review);
}

module.exports = {
  createReview
};