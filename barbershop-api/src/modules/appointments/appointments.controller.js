const appointmentsService = require("./appointments.service");

async function create(req, res, next) {
  try {
    const appointment = await appointmentsService.create(
      req.user.id,
      req.body
    );

    return res.status(201).json({
      data: appointment
    });
  } catch (error) {
    return next(error);
  }
}

async function list(req, res, next) {
  try {
    const appointments = await appointmentsService.list(
      req.user,
      req.query
    );

    return res.status(200).json({
      data: appointments
    });
  } catch (error) {
    return next(error);
  }
}

async function getById(req, res, next) {
  try {
    const appointment = await appointmentsService.getById(
      req.user,
      req.params.id
    );

    return res.status(200).json({
      data: appointment
    });
  } catch (error) {
    return next(error);
  }
}

async function cancel(req, res, next) {
  try {
    const appointment = await appointmentsService.cancel(
      req.user,
      req.params.id
    );

    return res.status(200).json({
      data: appointment
    });
  } catch (error) {
    return next(error);
  }
}

async function complete(req, res, next) {
  try {
    const appointment = await appointmentsService.complete(
      req.user,
      req.params.id
    );

    return res.status(200).json({
      data: appointment
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
  list,
  getById,
  cancel,
  complete
};