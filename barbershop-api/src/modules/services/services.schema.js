const allowedFields = [
  "nome",
  "descricao",
  "duracaoMinutos",
  "preco"
];

function validateObject(data) {
  return data !== null && typeof data === "object" && !Array.isArray(data);
}

function validateUnknownFields(data, errors) {
  for (const field of Object.keys(data)) {
    if (!allowedFields.includes(field)) {
      errors.push({
        field,
        message: "Campo não permitido."
      });
    }
  }
}

function validateNome(nome, errors, required) {
  if (nome === undefined) {
    if (required) {
      errors.push({
        field: "nome",
        message: "Nome é obrigatório."
      });
    }

    return;
  }

  if (typeof nome !== "string" || nome.trim().length === 0) {
    errors.push({
      field: "nome",
      message: "Nome deve ser uma string não vazia."
    });
  }
}

function validateDescricao(descricao, errors) {
  if (descricao === undefined || descricao === null) {
    return;
  }

  if (typeof descricao !== "string") {
    errors.push({
      field: "descricao",
      message: "Descrição deve ser uma string."
    });
  }
}

function validateDuracaoMinutos(duracaoMinutos, errors, required) {
  if (duracaoMinutos === undefined) {
    if (required) {
      errors.push({
        field: "duracaoMinutos",
        message: "Duração é obrigatória."
      });
    }

    return;
  }

  if (
    !Number.isInteger(duracaoMinutos) ||
    duracaoMinutos <= 0 ||
    duracaoMinutos % 30 !== 0
  ) {
    errors.push({
      field: "duracaoMinutos",
      message: "Duração deve ser um número inteiro positivo e múltiplo de 30."
    });
  }
}

function validatePreco(preco, errors, required) {
  if (preco === undefined) {
    if (required) {
      errors.push({
        field: "preco",
        message: "Preço é obrigatório."
      });
    }

    return;
  }

  if (
    typeof preco !== "number" ||
    !Number.isFinite(preco) ||
    preco < 0
  ) {
    errors.push({
      field: "preco",
      message: "Preço deve ser um número maior ou igual a zero."
    });
  }
}

const createServiceSchema = {
  validate(data) {
    const errors = [];

    if (!validateObject(data)) {
      return [
        {
          field: "body",
          message: "Corpo da requisição inválido."
        }
      ];
    }

    validateUnknownFields(data, errors);
    validateNome(data.nome, errors, true);
    validateDescricao(data.descricao, errors);
    validateDuracaoMinutos(data.duracaoMinutos, errors, true);
    validatePreco(data.preco, errors, true);

    return errors;
  }
};

const updateServiceSchema = {
  validate(data) {
    const errors = [];

    if (!validateObject(data)) {
      return [
        {
          field: "body",
          message: "Corpo da requisição inválido."
        }
      ];
    }

    const fields = Object.keys(data);

    if (fields.length === 0) {
      errors.push({
        field: "body",
        message: "Informe ao menos um campo para atualização."
      });

      return errors;
    }

    validateUnknownFields(data, errors);
    validateNome(data.nome, errors, false);
    validateDescricao(data.descricao, errors);
    validateDuracaoMinutos(data.duracaoMinutos, errors, false);
    validatePreco(data.preco, errors, false);

    return errors;
  }
};

module.exports = {
  createServiceSchema,
  updateServiceSchema
};