const availabilityService = require("./availability.service");

async function listSlots(req, res, next) {
  try {
    const data = await availabilityService.getSlots(
      req.user.id,
      req.query.date
    );

    return res.status(200).json({
      data
    });
  } catch (error) {
    return next(error);
  }
}

async function listBarbers(req, res, next) {
  try {
    const data = await availabilityService.getAvailableBarbers(
      req.user.id,
      req.query.startAt
    );

    return res.status(200).json({
      data
    });
  } catch (error) {
    return next(error);
  }
}

async function listBarberServices(req, res, next) {
  try {
    const data = await availabilityService.getAvailableServices(
      req.user.id,
      req.params.barberId,
      req.query.startAt
    );

    if (data === null) {
      return res.status(404).json({
        error: {
          code: "BARBER_NOT_FOUND",
          message: "Barbeiro não encontrado."
        }
      });
    }

    return res.status(200).json({
      data
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listSlots,
  listBarbers,
  listBarberServices
};