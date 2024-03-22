const ApiError = require('../exceptions/api-error');
const userService = require('../service/user.service');

module.exports = async (req, res, next) => {
  try {
    // Проверка токена на его валидность
    const userData = req.userData;
    if(!userData) return next(ApiError.UnauthorizedError())
    
    const isAdmin = await userService.isAdmin(userData.email);
    if(!isAdmin) return next(ApiError.BadRequest("Вы не являетесь администратором для исполнения этого запроса!"))

    next()
  } catch (error) {
    next(error)
  }
}
