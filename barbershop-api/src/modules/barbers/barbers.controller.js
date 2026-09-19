const barbersService = require("./barbers.service");

async function create(req, res) {
  const barbeiro = await barbersService.createBarber(req.body);

  return res.status(201).json({
    data: barbeiro
  });
}

async function list(req, res) {
  const barbeiros = await barbersService.listBarbers();

  return res.status(200).json({
    data: barbeiros
  });
}

async function getById(req, res) {
  const barbeiro = await barbersService.getBarberById(
    req.params.id
  );

  return res.status(200).json({
    data: barbeiro
  });
}

async function update(req, res) {
  const barbeiro = await barbersService.updateBarber(
    req.params.id,
    req.body
  );

  return res.status(200).json({
    data: barbeiro
  });
}

async function getServices(req, res) {
  const servicos = await barbersService.getBarberServices(
    req.params.id
  );

  return res.status(200).json({
    data: servicos
  });
}

async function updateServices(req, res) {
  const servicos = await barbersService.updateBarberServices(
    req.params.id,
    req.body.serviceIds
  );

  return res.status(200).json({
    data: servicos
  });
}

async function getReviews(req, res) {
  const avaliacoes = await barbersService.getBarberReviews(
    req.params.id
  );

  return res.status(200).json({
    data: avaliacoes
  });
}

module.exports = {
  create,
  list,
  getById,
  update,
  getServices,
  updateServices,
  getReviews
};