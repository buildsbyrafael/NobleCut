module.exports = {
  Error: {
    type: "object",
    properties: {
      error: {
        type: "object",
        properties: {
          code: {
            type: "string"
          },
          message: {
            type: "string"
          }
        }
      }
    }
  },

  User: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid"
      },
      nome: {
        type: "string"
      },
      email: {
        type: "string",
        format: "email"
      },
      telefone: {
        type: "string",
        nullable: true
      },
      tipo: {
        type: "string",
        enum: ["CLIENTE", "BARBEIRO", "ADMINISTRADOR"]
      }
    }
  },

  Service: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid"
      },
      nome: {
        type: "string"
      },
      descricao: {
        type: "string",
        nullable: true
      },
      duracaoMinutos: {
        type: "integer"
      },
      preco: {
        type: "number"
      }
    }
  },

  Barber: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid"
      },
      nome: {
        type: "string"
      },
      descricao: {
        type: "string",
        nullable: true
      },
      fotoUrl: {
        type: "string",
        nullable: true
      },
      mediaAvaliacao: {
        type: "number"
      },
      quantidadeAvaliacoes: {
        type: "integer"
      }
    }
  },

  Review: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid"
      },
      agendamentoId: {
        type: "string",
        format: "uuid"
      },
      nota: {
        type: "integer",
        minimum: 1,
        maximum: 5
      },
      comentario: {
        type: "string",
        nullable: true
      },
      criadoEm: {
        type: "string",
        format: "date-time"
      }
    }
  },

  Appointment: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid"
      },
      status: {
        type: "string",
        enum: ["AGENDADO", "CONCLUIDO", "CANCELADO"]
      },
      dataHoraInicio: {
        type: "string",
        format: "date-time"
      },
      dataHoraFim: {
        type: "string",
        format: "date-time"
      }
    }
  }
};