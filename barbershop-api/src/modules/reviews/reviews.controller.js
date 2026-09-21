const reviewsService = require("./reviews.service");

async function create(req, res, next) {
  try {
    const review = await reviewsService.createReview({
      appointmentId: req.params.id,
      userId: req.user.id,
      nota: req.body.nota,
      comentario: req.body.comentario
    });

    return res.status(201).json({
      data: review
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create
};