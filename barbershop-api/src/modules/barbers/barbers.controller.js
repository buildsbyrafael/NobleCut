const barbersService = require("./barbers.service");

async function create(req, res) {
  const barbeiro = await barbersService.createBarber(req.body);

  return res.status(201).json({
    data: barbeiro
  });
}

module.exports = {
  create
};