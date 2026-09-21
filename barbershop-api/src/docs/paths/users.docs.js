module.exports = {
  "/users/me": {
    get: {
      tags: ["Users"],
      summary: "Consultar usuário autenticado",
      security: [
        {
          bearerAuth: []
        }
      ],
      responses: {
        200: {
          description: "Dados do usuário"
        },
        401: {
          description: "Não autenticado"
        }
      }
    },

    patch: {
      tags: ["Users"],
      summary: "Atualizar usuário autenticado",
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
              properties: {
                nome: {
                  type: "string"
                },
                telefone: {
                  type: "string"
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: "Usuário atualizado"
        },
        400: {
          description: "Dados inválidos"
        },
        401: {
          description: "Não autenticado"
        }
      }
    }
  }
};