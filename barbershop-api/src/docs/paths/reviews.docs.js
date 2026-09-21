module.exports = {
  "/appointments/{id}/review": {
    post: {
      tags: ["Reviews"],
      summary: "Avaliar atendimento",
      description:
        "Somente o cliente responsável pode avaliar um atendimento concluído. Cada atendimento permite uma única avaliação e avaliações são imutáveis.",
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "UUID do agendamento",
          schema: {
            type: "string",
            format: "uuid"
          }
        }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["nota"],
              additionalProperties: false,
              properties: {
                nota: {
                  type: "integer",
                  minimum: 1,
                  maximum: 5
                },
                comentario: {
                  type: "string",
                  nullable: true
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: "Avaliação criada"
        },
        400: {
          description: "Dados inválidos"
        },
        403: {
          description: "Cliente sem permissão para avaliar"
        },
        404: {
          description: "Agendamento não encontrado"
        },
        409: {
          description:
            "Atendimento não concluído ou atendimento já avaliado"
        }
      }
    }
  }
};