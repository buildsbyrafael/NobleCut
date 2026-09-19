"use strict";

require("dotenv").config();

const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");

module.exports = {
  async up(queryInterface) {
    const nome = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const senha = process.env.ADMIN_PASSWORD;
    const telefone = process.env.ADMIN_PHONE || null;

    if (!nome || !email || !senha) {
      throw new Error(
        "ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD devem estar definidos no .env."
      );
    }

    const [usuarios] = await queryInterface.sequelize.query(
      "SELECT id FROM usuarios WHERE email = :email LIMIT 1",
      {
        replacements: { email }
      }
    );

    if (usuarios.length > 0) {
      return;
    }

    const senhaHash = await bcrypt.hash(senha, 12);
    const agora = new Date();

    await queryInterface.bulkInsert("usuarios", [
      {
        id: randomUUID(),
        nome,
        email,
        senhaHash,
        telefone,
        tipo: "ADMINISTRADOR",
        criadoEm: agora,
        atualizadoEm: agora
      }
    ]);
  },

  async down(queryInterface) {
    const email = process.env.ADMIN_EMAIL;

    if (!email) {
      return;
    }

    await queryInterface.bulkDelete("usuarios", {
      email,
      tipo: "ADMINISTRADOR"
    });
  }
};