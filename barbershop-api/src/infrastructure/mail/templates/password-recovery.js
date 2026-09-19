function passwordRecoveryTemplate({ nome, token }) {
  return {
    subject: "Recuperação de senha - NobleCut",
    text: [
      `Olá, ${nome}.`,
      "",
      "Foi solicitada uma recuperação de senha para sua conta NobleCut.",
      "",
      `Credencial de recuperação: ${token}`,
      "",
      "Essa credencial é válida por 10 minutos e poderá ser utilizada apenas uma vez.",
      "",
      "Se você não solicitou a recuperação, ignore esta mensagem."
    ].join("\n")
  };
}

module.exports = passwordRecoveryTemplate;