const idParameter = {
  name: "id",
  in: "path",
  required: true,
  schema: {
    type: "string",
    format: "uuid"
  }
};

const serviceBody = {
  type: "object",
  properties: {
    nome: {
      type: "string"
    },
    descricao: {
      type: "string"
    },
    duracaoMinutos: {
      type: "integer",
      minimum: 30,
      multipleOf: 30
    },
    preco: {
      type: "number",
      minimum: 0
    }
  }
};

module.exports = {
  "/services": {
    post: {
      tags: ["Services"],
      summary: "Cadastrar serviço",
      security: [
        {
          bearerAuth: []
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              ...serviceBody,
              required: ["nome", "duracaoMinutos", "preco"]
            }
          }
        }
      },
      responses: {
        201: {
          description: "Serviço criado"
        },
        400: {
          description: "Dados inválidos"
        },
        403: {
          description: "Somente administrador"
        }
      }
    },

    get: {
      tags: ["Services"],
      summary: "Listar serviços",
      security: [
        {
          bearerAuth: []
        }
      ],
      responses: {
        200: {
          description: "Lista de serviços"
        }
      }
    }
  },

  "/services/{id}": {
    get: {
      tags: ["Services"],
      summary: "Consultar serviço",
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [idParameter],
      responses: {
        200: {
          description: "Serviço encontrado"
        },
        404: {
          description: "Serviço não encontrado"
        }
      }
    },

    patch: {
      tags: ["Services"],
      summary: "Atualizar serviço",
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [idParameter],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: serviceBody
          }
        }
      },
      responses: {
        200: {
          description: "Serviço atualizado"
        },
        403: {
          description: "Somente administrador"
        },
        404: {
          description: "Serviço não encontrado"
        },
        409: {
          description: "Serviço possui atendimentos agendados"
        }
      }
    },

    delete: {
      tags: ["Services"],
      summary: "Remover serviço",
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [idParameter],
      responses: {
        204: {
          description: "Serviço removido"
        },
        403: {
          description: "Somente administrador"
        },
        404: {
          description: "Serviço não encontrado"
        },
        409: {
          description: "Serviço possui atendimentos agendados"
        }
      }
    }
  }
};