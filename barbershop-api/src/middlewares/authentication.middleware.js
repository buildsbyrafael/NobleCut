const AppError = require("../utils/AppError");
const { verifyAccessToken } = require("../utils/token");

function authenticationMiddleware(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return next(
      new AppError(
        "Token de autenticação não informado.",
        401,
        "UNAUTHORIZED"
      )
    );
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(
      new AppError(
        "Token de autenticação inválido.",
        401,
        "UNAUTHORIZED"
      )
    );
  }

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      tipo: payload.tipo
    };

    return next();
  } catch (error) {
    return next(
      new AppError(
        "Token inválido ou expirado.",
        401,
        "UNAUTHORIZED"
      )
    );
  }
}

module.exports = authenticationMiddleware;