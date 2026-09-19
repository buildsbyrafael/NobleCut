const { Usuario } = require("../../database/models");

async function findUserById(id) {
  return Usuario.findByPk(id);
}

async function findUserByEmail(email) {
  return Usuario.findOne({
    where: {
      email
    }
  });
}

async function updateUser(usuario, data) {
  return usuario.update(data);
}

module.exports = {
  findUserById,
  findUserByEmail,
  updateUser
};