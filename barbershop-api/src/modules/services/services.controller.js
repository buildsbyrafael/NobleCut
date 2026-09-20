const servicesService = require("./services.service");

async function create(req, res, next) {
  try {
    const service = await servicesService.createService(req.body);

    return res.status(201).json({
      data: service
    });
  } catch (error) {
    return next(error);
  }
}

async function list(req, res, next) {
  try {
    const services = await servicesService.listServices();

    return res.status(200).json({
      data: services
    });
  } catch (error) {
    return next(error);
  }
}

async function getById(req, res, next) {
  try {
    const service = await servicesService.getServiceById(
      req.params.id
    );

    return res.status(200).json({
      data: service
    });
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const service = await servicesService.updateService(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      data: service
    });
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    await servicesService.deleteService(req.params.id);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
  list,
  getById,
  update,
  remove
};