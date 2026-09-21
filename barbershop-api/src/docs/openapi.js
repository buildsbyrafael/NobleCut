const schemas = require("./schemas");
const authPaths = require("./paths/auth.docs");
const usersPaths = require("./paths/users.docs");
const barbersPaths = require("./paths/barbers.docs");
const servicesPaths = require("./paths/services.docs");
const availabilityPaths = require("./paths/availability.docs");
const appointmentsPaths = require("./paths/appointments.docs");
const reviewsPaths = require("./paths/reviews.docs");

const openapiDocument = {
  openapi: "3.0.3",

  info: {
    title: "NobleCut API",
    version: "1.0.0",
    description:
      "API REST do NobleCut para gerenciamento de clientes, barbeiros, serviços, disponibilidade, agendamentos e avaliações."
  },

  servers: [
    {
      url: "http://localhost:3000/api/v1",
      description: "Ambiente local"
    }
  ],

  tags: [
    { name: "System" },
    { name: "Auth" },
    { name: "Users" },
    { name: "Barbers" },
    { name: "Services" },
    { name: "Availability" },
    { name: "Appointments" },
    { name: "Reviews" }
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },

    schemas
  },

  paths: {
    "/health": {
      get: {
        tags: ["System"],
        summary: "Verificar estado da API",
        responses: {
          200: {
            description: "API em funcionamento"
          }
        }
      }
    },

    ...authPaths,
    ...usersPaths,
    ...barbersPaths,
    ...servicesPaths,
    ...availabilityPaths,
    ...appointmentsPaths,
    ...reviewsPaths
  }
};

module.exports = openapiDocument;