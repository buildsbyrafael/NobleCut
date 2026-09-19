const registerSchema = {
  validate(data) {
    const errors = [];

    if (!data || typeof data !== "object") {
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

    return errors;
  }
};

const loginSchema = {
  validate(data) {
    const errors = [];

    if (!data || typeof data !== "object") {
      return [
        {
          field: "body",
          message: "Corpo da requisição inválido."
        }
      ];
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

    return errors;
  }
};

const passwordRecoverySchema = {
  validate(data) {
    const errors = [];

    if (!data || typeof data !== "object") {
      return [
        {
          field: "body",
          message: "Corpo da requisição inválido."
        }
      ];
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

    return errors;
  }
};

const passwordResetSchema = {
  validate(data) {
    const errors = [];

    if (!data || typeof data !== "object") {
      return [
        {
          field: "body",
          message: "Corpo da requisição inválido."
        }
      ];
    }

    if (typeof data.token !== "string" || !data.token.trim()) {
      errors.push({
        field: "token",
        message: "Credencial de recuperação é obrigatória."
      });
    }

    if (typeof data.novaSenha !== "string" || !data.novaSenha) {
      errors.push({
        field: "novaSenha",
        message: "Nova senha é obrigatória."
      });
    }

    return errors;
  }
};

module.exports = {
  registerSchema,
  loginSchema,
  passwordRecoverySchema,
  passwordResetSchema
};