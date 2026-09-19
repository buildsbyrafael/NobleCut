const updateMeSchema = {
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

    const allowedFields = ["nome", "email", "telefone"];
    const receivedFields = Object.keys(data);

    const invalidFields = receivedFields.filter(
      (field) => !allowedFields.includes(field)
    );

    for (const field of invalidFields) {
      errors.push({
        field,
        message: "Campo não permitido para atualização."
      });
    }

    const fieldsToUpdate = receivedFields.filter((field) =>
      allowedFields.includes(field)
    );

    if (receivedFields.length === 0) {
      errors.push({
        field: "body",
        message: "Informe ao menos um campo para atualização."
      });

      return errors;
    }

    if (fieldsToUpdate.length === 0) {
      return errors;
    }

    if ("nome" in data) {
      if (typeof data.nome !== "string" || !data.nome.trim()) {
        errors.push({
          field: "nome",
          message: "Nome inválido."
        });
      }
    }

    if ("email" in data) {
      if (typeof data.email !== "string" || !data.email.trim()) {
        errors.push({
          field: "email",
          message: "E-mail inválido."
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
    }

    if ("telefone" in data) {
      if (typeof data.telefone !== "string" || !data.telefone.trim()) {
        errors.push({
          field: "telefone",
          message: "Telefone inválido."
        });
      }
    }

    return errors;
  }
};

module.exports = {
  updateMeSchema
};