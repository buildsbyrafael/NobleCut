const bcrypt = require("bcryptjs");
const { UniqueConstraintError } = require("sequelize");
const barbersRepository = require("./barbers.repository");
const AppError = require("../../utils/AppError");
const USER_TYPES = require("../../constants/user-types");

async function createBarber({
  nome,
  email,
  senha,
  telefone,
  descricao,
  fotoUrl,
  serviceIds
}) {
  const normalizedName = nome.trim();
  const normalizedEmail = email.trim();
  const normalizedPhone = telefone.trim();

  try {
    return await barbersRepository.runInTransaction(
      async (transaction) => {
        const existingUser = await barbersRepository.findUserByEmail(
          normalizedEmail,
          transaction
        );

        if (existingUser) {
          throw new AppError(
            "E-mail já cadastrado.",
            409,
            "EMAIL_ALREADY_REGISTERED"
          );
        }

        const servicos = await barbersRepository.findServicesByIds(
          serviceIds,
          transaction
        );

        if (servicos.length !== serviceIds.length) {
          throw new AppError(
            "Um ou mais serviços informados não existem.",
            404,
            "SERVICE_NOT_FOUND"
          );
        }

        const senhaHash = await bcrypt.hash(senha, 12);

        const usuario = await barbersRepository.createUser(
          {
            nome: normalizedName,
            email: normalizedEmail,
            senhaHash,
            telefone: normalizedPhone,
            tipo: USER_TYPES.BARBEIRO
          },
          transaction
        );

        const barbeiro = await barbersRepository.createBarber(
          {
            usuarioId: usuario.id,
            descricao:
              descricao !== undefined ? descricao.trim() : null,
            fotoUrl:
              fotoUrl !== undefined ? fotoUrl.trim() : null
          },
          transaction
        );

        await barbersRepository.createBarberServices(
          barbeiro.id,
          serviceIds,
          transaction
        );

        return {
          id: barbeiro.id,
          usuarioId: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          telefone: usuario.telefone,
          descricao: barbeiro.descricao,
          fotoUrl: barbeiro.fotoUrl,
          tipo: usuario.tipo,
          servicos: servicos.map((servico) => ({
            id: servico.id,
            nome: servico.nome
          }))
        };
      }
    );
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw new AppError(
        "E-mail já cadastrado.",
        409,
        "EMAIL_ALREADY_REGISTERED"
      );
    }

    throw error;
  }
}

function calculateReviewSummary(
  barbeiroId,
  agendamentos,
  avaliacoes
) {
  const appointmentIds = new Set(
    agendamentos
      .filter(
        (agendamento) => agendamento.barbeiroId === barbeiroId
      )
      .map((agendamento) => agendamento.id)
  );

  const barbeiroAvaliacoes = avaliacoes.filter((avaliacao) =>
    appointmentIds.has(avaliacao.agendamentoId)
  );

  if (barbeiroAvaliacoes.length === 0) {
    return {
      mediaAvaliacao: null,
      quantidadeAvaliacoes: 0
    };
  }

  const soma = barbeiroAvaliacoes.reduce(
    (total, avaliacao) => total + Number(avaliacao.nota),
    0
  );

  return {
    mediaAvaliacao: Number(
      (soma / barbeiroAvaliacoes.length).toFixed(2)
    ),
    quantidadeAvaliacoes: barbeiroAvaliacoes.length
  };
}

async function listBarbers() {
  const barbeiros = await barbersRepository.findAllBarbers();

  if (barbeiros.length === 0) {
    return [];
  }

  const usuarioIds = barbeiros.map(
    (barbeiro) => barbeiro.usuarioId
  );

  const barbeiroIds = barbeiros.map(
    (barbeiro) => barbeiro.id
  );

  const [usuarios, agendamentos] = await Promise.all([
    barbersRepository.findUsersByIds(usuarioIds),
    barbersRepository.findAppointmentsByBarberIds(barbeiroIds)
  ]);

  const agendamentoIds = agendamentos.map(
    (agendamento) => agendamento.id
  );

  const avaliacoes =
    await barbersRepository.findReviewsByAppointmentIds(
      agendamentoIds
    );

  const usuariosPorId = new Map(
    usuarios.map((usuario) => [usuario.id, usuario])
  );

  return barbeiros.map((barbeiro) => {
    const usuario = usuariosPorId.get(barbeiro.usuarioId);

    const resumo = calculateReviewSummary(
      barbeiro.id,
      agendamentos,
      avaliacoes
    );

    return {
      id: barbeiro.id,
      nome: usuario.nome,
      descricao: barbeiro.descricao,
      fotoUrl: barbeiro.fotoUrl,
      mediaAvaliacao: resumo.mediaAvaliacao,
      quantidadeAvaliacoes: resumo.quantidadeAvaliacoes
    };
  });
}

async function getBarberById(id) {
  const barbeiro = await barbersRepository.findBarberById(id);

  if (!barbeiro) {
    throw new AppError(
      "Barbeiro não encontrado.",
      404,
      "BARBER_NOT_FOUND"
    );
  }

  const [usuario, associacoes, agendamentos] =
    await Promise.all([
      barbersRepository.findUserById(barbeiro.usuarioId),
      barbersRepository.findBarberServiceLinks(barbeiro.id),
      barbersRepository.findAppointmentsByBarberIds([
        barbeiro.id
      ])
    ]);

  const serviceIds = associacoes.map(
    (associacao) => associacao.servicoId
  );

  const appointmentIds = agendamentos.map(
    (agendamento) => agendamento.id
  );

  const [servicos, avaliacoes] = await Promise.all([
    barbersRepository.findServicesByIds(serviceIds),
    barbersRepository.findReviewsByAppointmentIds(
      appointmentIds
    )
  ]);

  const resumo = calculateReviewSummary(
    barbeiro.id,
    agendamentos,
    avaliacoes
  );

  return {
    id: barbeiro.id,
    nome: usuario.nome,
    descricao: barbeiro.descricao,
    fotoUrl: barbeiro.fotoUrl,
    mediaAvaliacao: resumo.mediaAvaliacao,
    quantidadeAvaliacoes: resumo.quantidadeAvaliacoes,
    servicos: servicos.map((servico) => ({
      id: servico.id,
      nome: servico.nome,
      descricao: servico.descricao,
      duracaoMinutos: servico.duracaoMinutos,
      preco: servico.preco
    }))
  };
}

async function updateBarber(id, data) {
  try {
    return await barbersRepository.runInTransaction(
      async (transaction) => {
        const barbeiro = await barbersRepository.findBarberById(
          id,
          transaction
        );

        if (!barbeiro) {
          throw new AppError(
            "Barbeiro não encontrado.",
            404,
            "BARBER_NOT_FOUND"
          );
        }

        const usuario = await barbersRepository.findUserById(
          barbeiro.usuarioId,
          transaction
        );

        const userData = {};
        const barberData = {};

        if (data.nome !== undefined) {
          userData.nome = data.nome.trim();
        }

        if (data.email !== undefined) {
          const normalizedEmail = data.email.trim();

          const existingUser =
            await barbersRepository.findUserByEmail(
              normalizedEmail,
              transaction
            );

          if (
            existingUser &&
            existingUser.id !== usuario.id
          ) {
            throw new AppError(
              "E-mail já cadastrado.",
              409,
              "EMAIL_ALREADY_REGISTERED"
            );
          }

          userData.email = normalizedEmail;
        }

        if (data.telefone !== undefined) {
          userData.telefone = data.telefone.trim();
        }

        if (data.descricao !== undefined) {
          barberData.descricao =
            data.descricao === null
              ? null
              : data.descricao.trim();
        }

        if (data.fotoUrl !== undefined) {
          barberData.fotoUrl =
            data.fotoUrl === null
              ? null
              : data.fotoUrl.trim();
        }

        if (Object.keys(userData).length > 0) {
          await barbersRepository.updateUser(
            usuario,
            userData,
            transaction
          );
        }

        if (Object.keys(barberData).length > 0) {
          await barbersRepository.updateBarber(
            barbeiro,
            barberData,
            transaction
          );
        }

        return {
          id: barbeiro.id,
          usuarioId: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          telefone: usuario.telefone,
          descricao: barbeiro.descricao,
          fotoUrl: barbeiro.fotoUrl,
          tipo: usuario.tipo
        };
      }
    );
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw new AppError(
        "E-mail já cadastrado.",
        409,
        "EMAIL_ALREADY_REGISTERED"
      );
    }

    throw error;
  }
}

async function getBarberServices(id) {
  const barbeiro = await barbersRepository.findBarberById(id);

  if (!barbeiro) {
    throw new AppError(
      "Barbeiro não encontrado.",
      404,
      "BARBER_NOT_FOUND"
    );
  }

  const associacoes =
    await barbersRepository.findBarberServiceLinks(
      barbeiro.id
    );

  const serviceIds = associacoes.map(
    (associacao) => associacao.servicoId
  );

  const servicos =
    await barbersRepository.findServicesByIds(serviceIds);

  return servicos.map((servico) => ({
    id: servico.id,
    nome: servico.nome,
    descricao: servico.descricao,
    duracaoMinutos: servico.duracaoMinutos,
    preco: servico.preco
  }));
}

async function updateBarberServices(id, serviceIds) {
  return barbersRepository.runInTransaction(
    async (transaction) => {
      const barbeiro = await barbersRepository.findBarberById(
        id,
        transaction
      );

      if (!barbeiro) {
        throw new AppError(
          "Barbeiro não encontrado.",
          404,
          "BARBER_NOT_FOUND"
        );
      }

      const servicos =
        await barbersRepository.findServicesByIds(
          serviceIds,
          transaction
        );

      if (servicos.length !== serviceIds.length) {
        throw new AppError(
          "Um ou mais serviços informados não existem.",
          404,
          "SERVICE_NOT_FOUND"
        );
      }

      await barbersRepository.deleteBarberServices(
        barbeiro.id,
        transaction
      );

      await barbersRepository.createBarberServices(
        barbeiro.id,
        serviceIds,
        transaction
      );

      return servicos.map((servico) => ({
        id: servico.id,
        nome: servico.nome,
        descricao: servico.descricao,
        duracaoMinutos: servico.duracaoMinutos,
        preco: servico.preco
      }));
    }
  );
}

async function getBarberReviews(id) {
  const barbeiro = await barbersRepository.findBarberById(id);

  if (!barbeiro) {
    throw new AppError(
      "Barbeiro não encontrado.",
      404,
      "BARBER_NOT_FOUND"
    );
  }

  const agendamentos =
    await barbersRepository.findAppointmentsByBarberIds([
      barbeiro.id
    ]);

  const appointmentIds = agendamentos.map(
    (agendamento) => agendamento.id
  );

  const avaliacoes =
    await barbersRepository.findReviewsByAppointmentIds(
      appointmentIds
    );

  const resumo = calculateReviewSummary(
    barbeiro.id,
    agendamentos,
    avaliacoes
  );

  return {
    media: resumo.mediaAvaliacao,
    quantidade: resumo.quantidadeAvaliacoes,
    avaliacoes: avaliacoes.map((avaliacao) => ({
      id: avaliacao.id,
      nota: avaliacao.nota,
      comentario: avaliacao.comentario,
      criadoEm: avaliacao.criadoEm
    }))
  };
}

module.exports = {
  createBarber,
  listBarbers,
  getBarberById,
  updateBarber,
  getBarberServices,
  updateBarberServices,
  getBarberReviews
};