const ApiError = require('../exceptions/api-error');
const userService = require('../service/user.service');

module.exports = async (req, res, next) => {
  try {
    // Проверка токена на его валидность
    const userData = req.userData;
    if(!userData) return next(ApiError.UnauthorizedError())
    
    if(!userData.cancreate) return next(ApiError.BadRequest("У вас не хватает прав для исполнения этого запроса!", ["У вас не хватает прав для исполнения этого запроса!"]))

    next()
  } catch (error) {
    next(error)
  }
}
