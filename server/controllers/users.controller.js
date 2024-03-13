const logger = require('log4js').getLogger()
logger.level = 'debug'
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error')
const UserService = require('../service/user.service')
const offersService = require('../service/offers.service')

module.exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest('Ошибка при валидации данных пользователя', ['Ошибка при валидации данных пользователя']))
    }
    const { email, password, username, phoneNumber } = req.body
    const userData = await UserService.register(email, password, username, phoneNumber)

    console.log(userData)

    // Сохранение в куки пользователя токен для авторизации
    res.cookie('token', userData.token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })
    return res.json(userData)
  } catch (e) {
    next(e)
    logger.debug(typeof e)
  }
}

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const userData = await UserService.login(email, password)
    res.cookie('refreshToken', userData.refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })
    return res.json(userData)
  } catch (e) {
    next(e)
  }
}

exports.logout = async (req, res, next) => {
  try{
    const {refreshToken} = req.cookies;
    const token = await UserService.logout(refreshToken)
    res.clearCookie('refreshToken')
    return res.json(token)
  } catch(e){
    next(e)
  }
}

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies
    const userData = await UserService.refresh(refreshToken)
    res.cookie('refreshToken', userData.refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })
    return res.json(userData)
  } catch (e) {
    next(e)
  }
}


exports.isAdmin = async (req, res, next) => {
  try {
    const admin = await UserService.isAdmin(req.userData.email)

    res.status(200).send({admin: admin})
  } catch (error) {
    next(error)
  }
}