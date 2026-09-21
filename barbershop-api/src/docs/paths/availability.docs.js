module.exports = {
  "/availability/slots": {
    get: {
      tags: ["Availability"],
      summary: "Consultar horários disponíveis",
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: "date",
          in: "query",
          required: true,
          schema: {
            type: "string",
            format: "date"
          },
          example: "2026-09-21"
        }
      ],
      responses: {
        200: {
          description: "Horários disponíveis"
        },
        400: {
          description: "Data inválida"
        },
        403: {
          description: "Somente cliente"
        }
      }
    }
  },

  "/availability/barbers": {
    get: {
      tags: ["Availability"],
      summary: "Consultar barbeiros disponíveis",
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: "startAt",
          in: "query",
          required: true,
          schema: {
            type: "string",
            format: "date-time"
          }
        }
      ],
      responses: {
        200: {
          description: "Barbeiros disponíveis"
        },
        400: {
          description: "Horário inválido"
        },
        403: {
          description: "Somente cliente"
        }
      }
    }
  },

  "/availability/barbers/{barberId}/services": {
    get: {
      tags: ["Availability"],
      summary: "Consultar serviços disponíveis do barbeiro",
      security: [
        {
          bearerAuth: []
        }
      ],
      parameters: [
        {
          name: "barberId",
          in: "path",
          required: true,
          schema: {
            type: "string",
            format: "uuid"
          }
        },
        {
          name: "startAt",
          in: "query",
          required: true,
          schema: {
            type: "string",
            format: "date-time"
          }
        }
      ],
      responses: {
        200: {
          description: "Serviços disponíveis"
        },
        400: {
          description: "Horário inválido"
        },
        403: {
          description: "Somente cliente"
        },
        404: {
          description: "Barbeiro não encontrado"
        }
      }
    }
  }
};