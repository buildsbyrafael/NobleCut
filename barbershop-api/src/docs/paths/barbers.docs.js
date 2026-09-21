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
  "/barbers": {
    post: {
      tags: ["Barbers"],
      summary: "Cadastrar barbeiro",
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
              required: ["nome", "email", "senha"],
              properties: {
                nome: {
                  type: "string"
                },
                email: {
                  type: "string",
                  format: "email"
                },
                senha: {
                  type: "string",
                  format: "password"
                },
                telefone: {
                  type: "string"
                },
                descricao: {
                  type: "string"
                },
                fotoUrl: {
                  type: "string"
                },
                serviceIds: {
                  type: "array",
                  items: {
                    type: "string",
                    format: "uuid"
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: "Barbeiro cadastrado"
        },
        400: {
          description: "Dados inválidos"
        },
        403: {
          description: "Somente administrador"
        },
        404: {
          description: "Serviço informado não encontrado"
        },
        409: {
          description: "E-mail já utilizado"
        }
      }
    },

    get: {
      tags: ["Barbers"],
      summary: "Listar barbeiros",
      security: [
        {
          bearerAuth: []
        }
      ],
      responses: {
        200: {
          description: "Lista de barbeiros"
        }
      }
    }
  },

  "/barbers/{id}": {
    get: {
      tags: ["Barbers"],
      summary: "Consultar perfil do barbeiro",
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [idParameter],
      responses: {
        200: {
          description: "Perfil do barbeiro"
        },
        404: {
          description: "Barbeiro não encontrado"
        }
      }
    },

    patch: {
      tags: ["Barbers"],
      summary: "Atualizar barbeiro",
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
            schema: {
              type: "object",
              properties: {
                nome: {
                  type: "string"
                },
                email: {
                  type: "string",
                  format: "email"
                },
                telefone: {
                  type: "string"
                },
                descricao: {
                  type: "string"
                },
                fotoUrl: {
                  type: "string"
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: "Barbeiro atualizado"
        },
        403: {
          description: "Somente administrador"
        },
        404: {
          description: "Barbeiro não encontrado"
        }
      }
    }
  },

  "/barbers/{id}/services": {
    get: {
      tags: ["Barbers"],
      summary: "Consultar serviços do barbeiro",
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [idParameter],
      responses: {
        200: {
          description: "Serviços associados ao barbeiro"
        },
        404: {
          description: "Barbeiro não encontrado"
        }
      }
    },

    put: {
      tags: ["Barbers"],
      summary: "Definir serviços realizados pelo barbeiro",
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
            schema: {
              type: "object",
              required: ["serviceIds"],
              properties: {
                serviceIds: {
                  type: "array",
                  items: {
                    type: "string",
                    format: "uuid"
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: "Serviços atualizados"
        },
        403: {
          description: "Somente administrador"
        }
      }
    }
  },

  "/barbers/{id}/reviews": {
    get: {
      tags: ["Barbers", "Reviews"],
      summary: "Consultar avaliações do barbeiro",
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [idParameter],
      responses: {
        200: {
          description: "Média e avaliações do barbeiro"
        },
        404: {
          description: "Barbeiro não encontrado"
        }
      }
    }
  }
};