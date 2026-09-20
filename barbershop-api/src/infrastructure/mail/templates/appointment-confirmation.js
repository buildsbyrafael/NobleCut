function appointmentConfirmationTemplate({
  nome,
  tipoDestinatario,
  clienteNome,
  barbeiroNome,
  servicoNome,
  dataHoraInicio,
  dataHoraFim,
  preco
}) {
  const isClient = tipoDestinatario === "CLIENTE";

  const subject = isClient
    ? "NobleCut - Agendamento confirmado"
    : "NobleCut - Novo agendamento";

  const introduction = isClient
    ? `Olá, ${nome}. Seu agendamento foi confirmado.`
    : `Olá, ${nome}. Um novo atendimento foi agendado para você.`;

  const text = [
    introduction,
    "",
    `Cliente: ${clienteNome}`,
    `Barbeiro: ${barbeiroNome}`,
    `Serviço: ${servicoNome}`,
    `Início: ${dataHoraInicio}`,
    `Término: ${dataHoraFim}`,
    `Valor: R$ ${Number(preco).toFixed(2)}`,
    "",
    "NobleCut"
  ].join("\n");

  return {
    subject,
    text
  };
}

module.exports = appointmentConfirmationTemplate;