const createBarberSchema = {
  validate(data) {
    const errors = [];

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return [
        {
          field: "body",
          message: "Corpo da requisição inválido."
        }
      ];
    }

    if (typeof data.nome !== "string" || !data.nome.trim()) {
      errors.push({
        field: "nome",
        message: "Nome é obrigatório."
      });
    }

    if (typeof data.email !== "string" || !data.email.trim()) {
      errors.push({
        field: "email",
        message: "E-mail é obrigatório."
      });
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(data.email.trim())) {
        errors.push({
          field: "email",
          message: "E-mail inválido."
        });
      }
    }

    if (typeof data.senha !== "string" || !data.senha) {
      errors.push({
        field: "senha",
        message: "Senha é obrigatória."
      });
    }

    if (typeof data.telefone !== "string" || !data.telefone.trim()) {
      errors.push({
        field: "telefone",
        message: "Telefone é obrigatório."
      });
    }

    if (
      data.descricao !== undefined &&
      typeof data.descricao !== "string"
    ) {
      errors.push({
        field: "descricao",
        message: "Descrição inválida."
      });
    }

    if (
      data.fotoUrl !== undefined &&
      typeof data.fotoUrl !== "string"
    ) {
      errors.push({
        field: "fotoUrl",
        message: "URL da foto inválida."
      });
    }

    if (!Array.isArray(data.serviceIds)) {
      errors.push({
        field: "serviceIds",
        message: "serviceIds deve ser um array."
      });
    } else {
      const uniqueIds = new Set(data.serviceIds);

      if (uniqueIds.size !== data.serviceIds.length) {
        errors.push({
          field: "serviceIds",
          message: "serviceIds não pode conter valores duplicados."
        });
      }

      for (const id of data.serviceIds) {
        if (typeof id !== "string" || !id.trim()) {
          errors.push({
            field: "serviceIds",
            message: "Todos os IDs de serviço devem ser válidos."
          });

          break;
        }
      }
    }

    return errors;
  }
};

module.exports = {
  createBarberSchema
};