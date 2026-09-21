const idParameter = {
  name: "id",
  in: "path",
  required: true,
  schema: {
    type: "string",
    format: "uuid"
  }
};

module.exports = {
  "/appointments": {
    post: {
      tags: ["Appointments"],
      summary: "Criar agendamento",
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
              type: "object",
              required: ["barbeiroId", "servicoId", "dataHoraInicio"],
              properties: {
                barbeiroId: {
                  type: "string",
                  format: "uuid"
                },
                servicoId: {
                  type: "string",
                  format: "uuid"
                },
                dataHoraInicio: {
                  type: "string",
                  format: "date-time"
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: "Agendamento criado"
        },
        403: {
          description: "Somente cliente"
        },
        404: {
          description: "Barbeiro ou serviço não encontrado"
        },
        409: {
          description: "Conflito de disponibilidade"
        }
      }
    },

    get: {
      tags: ["Appointments"],
      summary: "Listar agendamentos",
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: "date",
          in: "query",
          required: false,
          schema: {
            type: "string",
            format: "date"
          }
        },
        {
          name: "status",
          in: "query",
          required: false,
          schema: {
            type: "string",
            enum: ["AGENDADO", "CONCLUIDO", "CANCELADO"]
          }
        },
        {
          name: "barberId",
          in: "query",
          required: false,
          schema: {
            type: "string",
            format: "uuid"
          }
        }
      ],
      responses: {
        200: {
          description: "Lista de agendamentos"
        }
      }
    }
  },

  "/appointments/{id}": {
    get: {
      tags: ["Appointments"],
      summary: "Consultar agendamento",
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [idParameter],
      responses: {
        200: {
          description: "Agendamento encontrado"
        },
        403: {
          description: "Sem permissão para consultar"
        },
        404: {
          description: "Agendamento não encontrado"
        }
      }
    }
  },

  "/appointments/{id}/cancel": {
    patch: {
      tags: ["Appointments"],
      summary: "Cancelar agendamento",
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [idParameter],
      responses: {
        200: {
          description: "Agendamento cancelado"
        },
        403: {
          description: "Sem permissão"
        },
        404: {
          description: "Agendamento não encontrado"
        },
        409: {
          description: "Agendamento não pode ser cancelado"
        }
      }
    }
  },

  "/appointments/{id}/complete": {
    patch: {
      tags: ["Appointments"],
      summary: "Concluir atendimento",
      description:
        "Somente o cliente responsável pode concluir manualmente um atendimento após dataHoraFim.",
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [idParameter],
      responses: {
        200: {
          description: "Atendimento concluído"
        },
        403: {
          description: "Sem permissão"
        },
        404: {
          description: "Agendamento não encontrado"
        },
        409: {
          description: "Atendimento ainda não pode ser concluído"
        }
      }
    }
  }
};