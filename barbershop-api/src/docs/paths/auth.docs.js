module.exports = {
  "/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Cadastrar cliente",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["nome", "email", "senha", "telefone"],
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
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: "Cliente cadastrado"
        },
        400: {
          description: "Dados inválidos"
        },
        409: {
          description: "E-mail já cadastrado"
        }
      }
    }
  },

  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Autenticar usuário",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "senha"],
              properties: {
                email: {
                  type: "string",
                  format: "email"
                },
                senha: {
                  type: "string",
                  format: "password"
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: "Autenticação realizada"
        },
        400: {
          description: "Dados inválidos"
        },
        401: {
          description: "Credenciais inválidas"
        }
      }
    }
  },

  "/auth/password-recovery": {
    post: {
      tags: ["Auth"],
      summary: "Solicitar recuperação de senha",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email"],
              properties: {
                email: {
                  type: "string",
                  format: "email"
                }
              }
            }
          }
        }
      },
      responses: {
        202: {
          description: "Solicitação aceita"
        }
      }
    }
  },

  "/auth/password-reset": {
    post: {
      tags: ["Auth"],
      summary: "Redefinir senha",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["token", "novaSenha"],
              properties: {
                token: {
                  type: "string"
                },
                novaSenha: {
                  type: "string",
                  format: "password"
                }
              }
            }
          }
        }
      },
      responses: {
        204: {
          description: "Senha redefinida"
        },
        400: {
          description: "Token ou senha inválidos"
        }
      }
    }
  }
};