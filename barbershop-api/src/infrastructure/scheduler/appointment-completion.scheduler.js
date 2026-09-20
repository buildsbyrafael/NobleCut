const appointmentsService = require(
  "../../modules/appointments/appointments.service"
);

const INTERVAL_MS = 60 * 1000;

async function runAppointmentCompletion() {
  try {
    const completed =
      await appointmentsService.completeAutomaticallyEligible();

    if (completed > 0) {
      console.log(
        `[Scheduler] ${completed} atendimento(s) concluído(s) automaticamente.`
      );
    }

    return completed;
  } catch (error) {
    console.error(
      "[Scheduler] Erro na conclusão automática de atendimentos:",
      error
    );

    return 0;
  }
}

function startAppointmentCompletionScheduler() {
  runAppointmentCompletion();

  return setInterval(
    runAppointmentCompletion,
    INTERVAL_MS
  );
}

module.exports = {
  runAppointmentCompletion,
  startAppointmentCompletionScheduler
};