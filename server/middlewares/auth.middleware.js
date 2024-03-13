const ApiError = require('../exceptions/api-error')
const tokenService = require('../service/token.service')

module.exports = async (req, res, next) => {
  try {
    // Проверка токена на его валидность
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError())
    }

    const accessToken = authorizationHeader.split(' ')[1]
    if (!accessToken) {
      return next(ApiError.UnauthorizedError())
    }
    const userData = await tokenService.validateAccessToken(accessToken)
    if (!userData) {
      return next(ApiError.UnauthorizedError())
    }

    req.userData = userData
    next()
  } catch (error) {
    console.log(error)
  }
}
